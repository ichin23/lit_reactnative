import { ClusteredPost, IPostRepository } from "../../repositories/IPostRepository";

export class FindClusteredPostByGeoLocation {
    constructor(private readonly postRepository: IPostRepository) { }

    async execute(params: { latitude: number, longitude: number, radius: number, zoom: number }): Promise<ClusteredPost[]> {
        return this.postRepository.findClusteredByGeolocation(params.latitude, params.longitude, params.radius, params.zoom);
    }
}
