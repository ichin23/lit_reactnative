import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";
import { GeoCoordinates } from "../../value-objects/GeoCoordinates";

export class UpdatePost {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: {
        id: string,
        title?: string,
        only_friends?: boolean,
    }): Promise<void> {
        const { id, title, only_friends } = params;

        const updateData: any = {};
        if (title !== undefined) updateData.title = title;
        if (only_friends !== undefined) updateData.only_friends = only_friends;

        await this.postRepository.update(id, updateData);
    }

}