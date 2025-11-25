import { IPostRepository } from "../../repositories/IPostRepository";
import { Post } from "../../entities/Post";

export class GetFriendsFeed {
    constructor(private postRepository: IPostRepository) { }

    async execute(): Promise<Post[]> {
        return await this.postRepository.findFriendsPosts();
    }
}
