import { ClusteredPost, IPostRepository } from "../../repositories/IPostRepository";

export class GetFriendsFeed {
    constructor(private postRepository: IPostRepository) { }

    async execute(params: { latitude: number; longitude: number; radius: number; zoom: number }): Promise<ClusteredPost[]> {
        return await this.postRepository.findFriendsClusteredByGeolocation(
            params.latitude,
            params.longitude,
            params.radius,
            params.zoom
        );
    }
}
