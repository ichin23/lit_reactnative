import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";


export class SupabasePostRepository implements IPostRepository{
    save(post: Post): Promise<void> {
        throw new Error("Method not implemented.");
    }
    getAll(): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    findById(id: string): Promise<Post | undefined> {
        throw new Error("Method not implemented.");
    }
    findByUserId(userId: string): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]> {
        throw new Error("Method not implemented.");
    }
    update(post: Post): Promise<void> {
        throw new Error("Method not implemented.");
    }
    delete(id: string): Promise<void> {
        throw new Error("Method not implemented.");
    }

}