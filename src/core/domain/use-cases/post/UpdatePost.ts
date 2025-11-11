import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";
import { GeoCoordinates } from "../../value-objects/GeoCoordinates";

export class UpdatePost{
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: {
        id: string,
        title: string,
    }): Promise<void> {
        const { id, title } = params;

        await this.postRepository.update(id, { title });
    }

}