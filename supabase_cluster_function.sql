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
