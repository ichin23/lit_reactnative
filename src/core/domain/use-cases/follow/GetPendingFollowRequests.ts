import { IFollowRepository } from "../../repositories/IFollowRepository";

export class GetPendingFollowRequests {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string): Promise<string[]> {
        return await this.followRepository.getPendingFollowRequests(userId);
    }
}
