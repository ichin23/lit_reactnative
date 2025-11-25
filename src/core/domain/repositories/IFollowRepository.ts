export interface IFollowRepository {
    follow(userId: string, followingId: string): Promise<void>;
    unfollow(userId: string, followingId: string): Promise<void>;
    isFollowing(userId: string, followingId: string): Promise<boolean>;
    getFollowers(userId: string): Promise<string[]>; // Returns list of user IDs
    getFollowing(userId: string): Promise<string[]>; // Returns list of user IDs

    // Follow request methods
    sendFollowRequest(userId: string, targetUserId: string): Promise<void>;
    acceptFollowRequest(userId: string, requesterId: string): Promise<void>;
    rejectFollowRequest(userId: string, requesterId: string): Promise<void>;
    getPendingFollowRequests(userId: string): Promise<string[]>; // Returns list of user IDs who sent requests
    getSentFollowRequests(userId: string): Promise<string[]>; // Returns list of user IDs to whom user sent requests
    hasFollowRequest(userId: string, targetUserId: string): Promise<boolean>;
}
