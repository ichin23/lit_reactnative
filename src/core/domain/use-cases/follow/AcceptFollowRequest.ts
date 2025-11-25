import { IFollowRepository } from "../../repositories/IFollowRepository";

export class AcceptFollowRequest {
    constructor(private followRepository: IFollowRepository) { }

    async execute(userId: string, requesterId: string): Promise<void> {
        await this.followRepository.acceptFollowRequest(userId, requesterId);
    }
}
