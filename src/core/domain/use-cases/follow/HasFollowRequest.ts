import { IFollowRepository } from "../../repositories/IFollowRepository";

export class HasFollowRequest {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, targetUserId: string): Promise<boolean> {
        return await this.followRepository.hasFollowRequest(userId, targetUserId);
    }
}
