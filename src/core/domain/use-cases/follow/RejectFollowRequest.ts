import { IFollowRepository } from "../../repositories/IFollowRepository";

export class RejectFollowRequest {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, requesterId: string): Promise<void> {
        await this.followRepository.rejectFollowRequest(userId, requesterId);
    }
}
