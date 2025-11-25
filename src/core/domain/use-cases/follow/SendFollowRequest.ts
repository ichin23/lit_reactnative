import { IFollowRepository } from "../../repositories/IFollowRepository";

export class SendFollowRequest {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, targetUserId: string): Promise<void> {
        if (userId === targetUserId) {
            throw new Error("Users cannot send follow requests to themselves");
        }

        // Check if already following
        const isFollowing = await this.followRepository.isFollowing(userId, targetUserId);
        if (isFollowing) {
            throw new Error("Already following this user");
        }

        // Check if request already exists
        const hasRequest = await this.followRepository.hasFollowRequest(userId, targetUserId);
        if (hasRequest) {
            throw new Error("Follow request already sent");
        }

        await this.followRepository.sendFollowRequest(userId, targetUserId);
    }
}
