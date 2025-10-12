import { Post } from "../entities/Post";


export interface IPostRepository{
    save(post: Post): Promise<void>;
    getAll(): Promise<Post[]>;
    findById(id: string): Promise<Post | undefined>;
    findByUserId(userId: string): Promise<Post[]>;
    findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]>;
    update(post: Post): Promise<void>;
    delete(id: string): Promise<void>;
}