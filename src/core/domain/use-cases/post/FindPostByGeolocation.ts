import { Post } from "../../entities/Post";
import { IPostRepository } from "../../repositories/IPostRepository";

export class FindPostByGeoLocation{
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: { latitude: number, longitude: number, radius: number }): Promise<Post[]> {
        return this.postRepository.findByGeolocation(params.latitude, params.longitude, params.radius);
    }

}