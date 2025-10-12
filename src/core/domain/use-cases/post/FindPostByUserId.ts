import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class FindPostByUserId{
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: { userId: string }): Promise<Post[]> {
        return this.postRepository.findByUserId(params.userId);
    }

}