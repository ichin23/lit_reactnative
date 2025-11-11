import { Post } from "../entities/Post";

export type ClusteredPost = {
    id: string;
    is_cluster: boolean;
    point_count: number;
    latitude: number;
    longitude: number;
    post_id: string | null;
};


export interface IPostRepository{
    save(post: Post): Promise<void>;
    getAll(sortBy?: 'createdAt' | 'partiu'): Promise<Post[]>;
    findById(id: string): Promise<Post | undefined>;
    findByUserId(userId: string): Promise<Post[]>;
    findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]>;
    findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]>;
    update(id: string, post: Partial<Post>): Promise<void>;
    delete(id: string): Promise<void>;
    addPartiu(postId: string, userId: string): Promise<void>;
}