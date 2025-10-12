import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";
import { GeoCoordinates } from "../../value-objects/GeoCoordinates";


export class CreatePost{
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
            0,
            imgUrl,
            datetime,
            geolocation
        );

        await this.postRepository.save(post);
        console.log(await this.postRepository.getAll());
        return post;
    }

}