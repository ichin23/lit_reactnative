import { Post } from "../../domain/entities/Post";
import { ClusteredPost, IPostRepository } from "../../domain/repositories/IPostRepository";
import { supabase } from "../supabase/client/supabaseClient";


export class SupabasePostRepository implements IPostRepository {
    private static instance: SupabasePostRepository;

    private constructor() { }

    public static getInstance(): SupabasePostRepository {
        if (!SupabasePostRepository.instance) {
            SupabasePostRepository.instance = new SupabasePostRepository();
        }
        return SupabasePostRepository.instance;
    }

    async save(post: Post): Promise<void> {
        console.log("Enviando supabase: ", post)
        const response = await supabase.from('post').insert({
            title: post.title,
            imgUrl: post.imgUrl,
            geolocation: post.geolocation,
        }).select()

        console.log("response supabase: ", response)
        if (response.error) {
            throw Error(response.error.message)
        }

    }
    async getAll(sortBy?: 'createdAt' | 'partiu'): Promise<Post[]> {
        let query = supabase.from('post').select('*, user:userId(imgUrl, username)');

        if (sortBy === 'createdAt') {
            query = query.order('createdAt', { ascending: false });
        } else if (sortBy === 'partiu') {
            query = query.order('partiu', { ascending: false });
        }

        const response = await query;
        console.log(response)
        if (response.data) {
            return response.data.map((post: any) => ({
                ...post,
                userProfileImgUrl: post.user?.imgUrl,
                username: post.user?.username
            })) as Post[];
        }
        return [];
    }
    async findById(id: string): Promise<Post | undefined> {
        const response = await supabase.from('post').select('*, user:userId(imgUrl, username)').match({ id }).single();
        if (response.data) {
            const post = response.data as any;
            return {
                ...post,
                userProfileImgUrl: post.user?.imgUrl,
                username: post.user?.username
            } as Post;
        }
        return undefined;
    }
    async findByUserId(userId: string): Promise<Post[]> {
        const response = await supabase.from('post').select('*, user:userId(imgUrl, username)').match({ userId });
        if (response.data) {
            return response.data.map((post: any) => ({
                ...post,
                userProfileImgUrl: post.user?.imgUrl,
                username: post.user?.username
            })) as Post[];
        }
        return [];
    }
    async findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]> {
        const response = await supabase.rpc('posts_in_radius', {
            lat: latitude,
            long: longitude,
            radius_meters: radius
        })
        console.log("Find Geolocation Response: ", response)
        // Note: RPC might not return user info joined. If needed, we'd need to fetch users or update RPC.
        // For now, assuming RPC returns basic post info.
        return response.data as Post[]
    }
    async findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
        const response = await supabase.rpc('get_feed_clusters_by_location', {
            center_lat: latitude,
            center_lon: longitude,
            radius_meters: radius,
            zoom_level: zoom
        })
        console.log("Find Clustered Geolocation Response: ", response)
        return (response.data as ClusteredPost[]) || [];
    }
    async update(id: string, post: Partial<Post>): Promise<void> {
        await supabase.from('post').update(post).match({ id });
    }
    async delete(id: string): Promise<void> {
        console.log(id)
        const { error } = await supabase.from('post').delete().match({ id });
        if (error) {
            console.error(error)
        }
    }

    async addPartiu(postId: string, userId: string): Promise<void> {
        const { error } = await supabase.from('partiu').insert({ idPost: postId, idUser: userId });
        if (error) {
            throw new Error(error.message);
        }
    }

    async getFeedClusters(): Promise<Post[][]> {
        const { data, error } = await supabase.rpc('get_feed_clusters', { radius_meters: 30 });

        if (error) {
            console.error(error)
            throw new Error(error.message);
        }

        if (!data) {
            return [];
        }
        console.log(data)
        return data.map((cluster: any) => cluster.posts);
    }

}