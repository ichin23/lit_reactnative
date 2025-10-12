import { IPostRepository } from "../../repositories/IPostRepository";


export class DeletePost{
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: { id: string }): Promise<void> {
        await this.postRepository.delete(params.id);
    }

}