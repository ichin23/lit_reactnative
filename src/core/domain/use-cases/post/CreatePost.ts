import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";
import { GeoCoordinates } from "../../value-objects/GeoCoordinates";


export class CreatePost {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: {
        title: string,
        userId: string,
        userName: string,
        imgUrl: string,
        datetime: string,
        geolocation: GeoCoordinates
    }): Promise<Post> {
        const { title, userId, userName, imgUrl, datetime, geolocation } = params;

        const post = Post.create(
            Math.random().toString(),
            title,
            userId,
            userName,
            undefined,
            userName, // Using userName as username for now, or should we pass it in params?
            0,
            imgUrl,
            datetime,
            geolocation
        );

        await this.postRepository.save(post);
        return post;
    }

}