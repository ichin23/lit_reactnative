import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class FindPostById {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(id: string): Promise<Post | undefined> {
        return this.postRepository.findById(id);
    }
}
