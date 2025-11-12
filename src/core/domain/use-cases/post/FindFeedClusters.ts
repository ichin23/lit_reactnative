import { Post } from "../../domain/entities/Post";
import { IPostRepository } from "../../domain/repositories/IPostRepository";

export class FindFeedClusters {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(): Promise<Post[][]> {
        return this.postRepository.getFeedClusters();
    }
}
