-- Habilita o PostGIS se ainda não estiver habilitado
create extension if not exists postgis with schema extensions;

-- Função para agrupar posts
create or replace function get_clustered_posts(
    lat float,
    long float,
    radius_meters int,
    zoom_level int
)
returns table (
    id text,
    is_cluster boolean,
    point_count bigint,
    latitude float,
    longitude float,
    post_id text -- para pontos únicos
)
as $$
declare
    -- Ajuste a distância do cluster baseado no nível de zoom
    -- Este valor pode precisar de ajustes para se adequar à sua preferência
    cluster_distance_meters int := 10000 / zoom_level;
begin
    return query
    with posts_in_radius as (
        select
            p.id,
            ST_SetSRID(ST_MakePoint((p.geolocation->>'longitude')::float, (p.geolocation->>'latitude')::float), 4326) as geom
        from
            public.post p
        where
            ST_DWithin(
                ST_SetSRID(ST_MakePoint((p.geolocation->>'longitude')::float, (p.geolocation->>'latitude')::float), 4326),
                ST_SetSRID(ST_MakePoint(long, lat), 4326),
                radius_meters
            )
    ),
    clustered as (
        select
            pr.id,
            ST_ClusterDBSCAN(pr.geom, eps := cluster_distance_meters, minpoints := 2) over () as cluster_id,
            pr.geom
        from
            posts_in_radius pr
    ),
    clusters as (
        select
            c.cluster_id,
            count(*) as point_count,
            ST_AsText(ST_Centroid(ST_Collect(c.geom))) as centroid
        from
            clustered c
        where
            c.cluster_id is not null
        group by
            c.cluster_id
    )
    -- Pontos únicos (não em um cluster)
    select
        c.id::text as id,
        false as is_cluster,
        1 as point_count,
        ST_Y(c.geom::geometry) as latitude,
        ST_X(c.geom::geometry) as longitude,
        c.id::text as post_id
    from
        clustered c
    where
        c.cluster_id is null

    union all

    -- Clusters
    select
        cl.cluster_id::text as id,
        true as is_cluster,
        cl.point_count,
        ST_Y(ST_PointFromText(cl.centroid, 4326)) as latitude,
        ST_X(ST_PointFromText(cl.centroid, 4326)) as longitude,
        null as post_id
    from
        clusters cl;
end;
$$ language plpgsql;

-- Create partiu table
create table public.partiu (
  "idUser" uuid not null default auth.uid (),
  created_at timestamp with time zone not null default now(),
  "idPost" uuid not null,
  constraint partiu_pkey primary key ("idUser", "idPost"),
  constraint partiu_idPost_fkey foreign KEY ("idPost") references post (id) on delete cascade,
  constraint partiu_idUser_fkey foreign KEY ("idUser") references "user" (id) on delete cascade
) TABLESPACE pg_default;

-- Function to update partiu count on post
CREATE OR REPLACE FUNCTION update_partiu_count()
RETURNS TRIGGER AS $$
BEGIN
    UPDATE post
    SET partiu = (SELECT COUNT(*) FROM partiu WHERE "idPost" = NEW."idPost")
    WHERE id = NEW."idPost";
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger to update partiu count
CREATE TRIGGER partiu_insert_trigger
AFTER INSERT ON partiu
FOR EACH ROW
EXECUTE FUNCTION update_partiu_count();

-- RLS policy for partiu table
CREATE POLICY "Allow authenticated users to insert"
ON public.partiu
FOR INSERT
TO authenticated
WITH CHECK (true);

CREATE OR REPLACE FUNCTION get_feed_clusters(
    radius_meters int
)
RETURNS jsonb AS $$
DECLARE
    result jsonb;
BEGIN
    WITH clustered_posts AS (
        SELECT
            p.id,
            p.title,
            p."imgUrl",
            p."userId",
            p.partiu,
            p.geolocation,
            p."createdAt",
            ST_ClusterDBSCAN(
                ST_Transform(
                    ST_SetSRID(
                        ST_MakePoint(
                            (p.geolocation->>'longitude')::float,
                            (p.geolocation->>'latitude')::float
                        ),
                        4326
                    ), 
                    3857
                ),
                eps := radius_meters,
                minpoints := 1
            ) OVER () AS cluster_id
        FROM
            public.post p
    ),
    grouped_clusters AS (
        SELECT
            cluster_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'title', title,
                    'imgUrl', "imgUrl",
                    'userId', "userId",
                    'partiu', partiu,
                    'geolocation', geolocation,
                    'createdAt', "createdAt"
                )
            ) AS posts,
            MAX("createdAt") as max_created_at
        FROM
            clustered_posts
        GROUP BY
            cluster_id
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'cluster_id', cluster_id,
                'posts', posts
            )
            ORDER BY max_created_at DESC
        )
    INTO
        result
    FROM
        grouped_clusters;

    RETURN result;
END;
$$ LANGUAGE plpgsql;


CREATE OR REPLACE FUNCTION get_feed_clusters_by_location(
    center_lat float,
    center_lon float,
    radius_meters int,
    zoom_level int
)
RETURNS jsonb AS $$
DECLARE
    eps_meters float;
    result jsonb;
BEGIN
    -- Agrupamento fixo de 10 metros
    eps_meters := 30;

    WITH posts_in_radius AS (
        SELECT *
        FROM public.post p
        WHERE 
            p.geolocation->>'latitude' IS NOT NULL
        AND p.geolocation->>'longitude' IS NOT NULL
        AND ST_DWithin(
            ST_Transform(
                ST_SetSRID(
                    ST_MakePoint(
                        (p.geolocation->>'longitude')::float,
                        (p.geolocation->>'latitude')::float
                    ),
                    4326
                ), 
                3857
            ),
            ST_Transform(
                ST_SetSRID(ST_MakePoint(center_lon, center_lat), 4326),
                3857
            ),
            radius_meters
        )
    ),
    clustered_posts AS (
        SELECT
            p.id,
            p.title,
            p."imgUrl",
            p."userId",
            p.partiu,
            p.geolocation,
            p."createdAt",
            ST_ClusterDBSCAN(
                ST_Transform(
                    ST_SetSRID(
                        ST_MakePoint(
                            (p.geolocation->>'longitude')::float,
                            (p.geolocation->>'latitude')::float
                        ),
                        4326
                    ),
                    3857
                ),
                eps := eps_meters,
                minpoints := 1
            ) OVER () AS cluster_id
        FROM posts_in_radius p
    ),
    grouped_clusters AS (
        SELECT
            cluster_id,
            jsonb_agg(
                jsonb_build_object(
                    'id', id,
                    'title', title,
                    'imgUrl', "imgUrl",
                    'userId', "userId",
                    'partiu', partiu,
                    'geolocation', geolocation,
                    'createdAt', "createdAt"
                )
            ) AS posts,
            MAX("createdAt") AS max_created_at
        FROM clustered_posts
        GROUP BY cluster_id
    )
    SELECT
        jsonb_agg(
            jsonb_build_object(
                'cluster_id', cluster_id,
                'posts', posts
            )
            ORDER BY max_created_at DESC
        )
    INTO result
    FROM grouped_clusters;

    RETURN result;
END;
$$ LANGUAGE plpgsql;
