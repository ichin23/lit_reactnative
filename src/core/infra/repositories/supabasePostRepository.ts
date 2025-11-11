import { Post } from "../../domain/entities/Post";
import { ClusteredPost, IPostRepository } from "../../domain/repositories/IPostRepository";
import { supabase } from "../supabase/client/supabaseClient";


export class SupabasePostRepository implements IPostRepository{
    private static instance: SupabasePostRepository;

    private constructor() {}

    public static getInstance(): SupabasePostRepository {
        if (!SupabasePostRepository.instance) {
            SupabasePostRepository.instance = new SupabasePostRepository();
        }
        return SupabasePostRepository.instance;
    }

    async save(post: Post): Promise<void> {
        console.log("Enviando supabase: ",post)
        const response = await supabase.from('post').insert({
            title: post.title,
            imgUrl: post.imgUrl,
            geolocation: post.geolocation,
        }).select()

        console.log("response supabase: ", response)
        if(response.error){
            throw Error(response.error.message)
        }

    }
    async getAll(): Promise<Post[]> {
        const response = await supabase.from('post').select()

        return response.data as Post[]
    }
    async findById(id: string): Promise<Post | undefined> {
        const response = await supabase.from('post').select().match({ id }).single();
        return response.data as Post | undefined
    }
    async findByUserId(userId: string): Promise<Post[]> {
        const response = await supabase.from('post').select().match({ userId });
        return response.data as Post[]
    }
    async findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]> {
        const response = await supabase.rpc('posts_in_radius', {
            lat: latitude,
            long: longitude,
            radius_meters: radius
        })
        console.log("Find Geolocation Response: ", response)
        return response.data as Post[]
    }
    async findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
        const response = await supabase.rpc('get_clustered_posts', {
            lat: latitude,
            long: longitude,
            radius_meters: radius,
            zoom_level: zoom
        })
        console.log("Find Clustered Geolocation Response: ", response)
        return (response.data as ClusteredPost[]) || [];
    }
    update(post: Post): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async delete(id: string): Promise<void> {
        await supabase.from('post').delete().match({ id });
    }

}