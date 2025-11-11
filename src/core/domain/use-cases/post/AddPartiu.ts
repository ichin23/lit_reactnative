import { IPostRepository } from "../../repositories/IPostRepository";

export class AddPartiu {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: { postId: string, userId: string }): Promise<void> {
        await this.postRepository.addPartiu(params.postId, params.userId);
    }
}
