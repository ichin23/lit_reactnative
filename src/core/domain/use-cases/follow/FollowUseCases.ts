import { IFollowRepository } from "../repositories/IFollowRepository";

export class FollowUser {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, followingId: string): Promise<void> {
        if (userId === followingId) {
            throw new Error("Users cannot follow themselves");
        }
        await this.followRepository.follow(userId, followingId);
    }
}

export class UnfollowUser {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, followingId: string): Promise<void> {
        await this.followRepository.unfollow(userId, followingId);
    }
}

export class IsFollowing {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, followingId: string): Promise<boolean> {
        return await this.followRepository.isFollowing(userId, followingId);
    }
}
