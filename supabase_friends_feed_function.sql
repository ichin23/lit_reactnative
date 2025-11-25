CREATE OR REPLACE FUNCTION get_friends_feed_clusters_by_location(
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
        SELECT 
            p.*,
            u."imgUrl" as "userProfileImgUrl",
            u.username
        FROM public.post p
        LEFT JOIN public.user u ON p."userId" = u.id
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
        AND p."userId" IN (SELECT following FROM public.follow WHERE user_id = auth.uid())
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
            p."userProfileImgUrl",
            p.username,
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
                    'createdAt', "createdAt",
                    'userProfileImgUrl', "userProfileImgUrl",
                    'username', username
                )
                ORDER BY "createdAt" DESC
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
