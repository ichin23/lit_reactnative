import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";
import { GeoCoordinates } from "../../value-objects/GeoCoordinates";

export class UpdatePost{
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: {
        id: string,
        title: string,
        userId: string,
        userName: string,
        partiu: number,
        imgUrl: string,
        datetime: string,
        geolocation: GeoCoordinates
    }): Promise<void> {
        const { id, title, userId, userName, partiu, imgUrl, datetime, geolocation } = params;

        const post = Post.create(
            id,
            title,
            userId,
            userName,
            partiu,
            imgUrl,
            datetime,
            geolocation
        );

        await this.postRepository.update(post);
    }

}