import { IFollowRepository } from "../../repositories/IFollowRepository";

export class GetSentFollowRequests {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string): Promise<string[]> {
        return await this.followRepository.getSentFollowRequests(userId);
    }
}
