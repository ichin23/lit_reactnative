import { FollowUser, UnfollowUser, IsFollowing } from "../domain/use-cases/follow/FollowUseCases";
import { SupabaseFollowRepository } from "../infra/repositories/SupabaseFollowRepository";
import { SendFollowRequest } from "../domain/use-cases/follow/SendFollowRequest";
import { AcceptFollowRequest } from "../domain/use-cases/follow/AcceptFollowRequest";
import { RejectFollowRequest } from "../domain/use-cases/follow/RejectFollowRequest";
import { GetPendingFollowRequests } from "../domain/use-cases/follow/GetPendingFollowRequests";
import { GetSentFollowRequests } from "../domain/use-cases/follow/GetSentFollowRequests";
import { HasFollowRequest } from "../domain/use-cases/follow/HasFollowRequest";


export function makeFollowUseCases() {
    const followRepository = new SupabaseFollowRepository();

    const followUser = new FollowUser(followRepository);
    const unfollowUser = new UnfollowUser(followRepository);
    const isFollowing = new IsFollowing(followRepository);
    const sendFollowRequest = new SendFollowRequest(followRepository);
    const acceptFollowRequest = new AcceptFollowRequest(followRepository);
    const rejectFollowRequest = new RejectFollowRequest(followRepository);
    const getPendingFollowRequests = new GetPendingFollowRequests(followRepository);
    const getSentFollowRequests = new GetSentFollowRequests(followRepository);
    const hasFollowRequest = new HasFollowRequest(followRepository);

    return {
        followUser,
        unfollowUser,
        isFollowing,
        sendFollowRequest,
        acceptFollowRequest,
        rejectFollowRequest,
        getPendingFollowRequests,
        getSentFollowRequests,
        hasFollowRequest
    };
}
