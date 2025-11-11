import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";


export class FindPosts{
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(): Promise<Post[]> {
        return this.postRepository.getAll('createdAt');
    }

}