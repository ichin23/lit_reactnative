import { IFollowRepository } from "../../domain/repositories/IFollowRepository";
import { supabase } from "../supabase/client/supabaseClient";

export class SupabaseFollowRepository implements IFollowRepository {
    async follow(userId: string, followingId: string): Promise<void> {
        const { error } = await supabase
            .from('follow')
            .insert({ user_id: userId, following: followingId });

        if (error) {
            throw new Error(error.message);
        }
    }

    async unfollow(userId: string, followingId: string): Promise<void> {
        const { error } = await supabase
            .from('follow')
            .delete()
            .match({ user_id: userId, following: followingId });

        if (error) {
            throw new Error(error.message);
        }
    }

    async isFollowing(userId: string, followingId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('follow')
            .select('*')
            .match({ user_id: userId, following: followingId })
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw new Error(error.message);
        }

        return !!data;
    }

    async getFollowers(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('follow')
            .select('user_id')
            .eq('following', userId);

        if (error) {
            throw new Error(error.message);
        }

        return data.map((row: any) => row.user_id);
    }

    async getFollowing(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('follow')
            .select('following')
            .eq('user_id', userId);

        if (error) {
            throw new Error(error.message);
        }

        return data.map((row: any) => row.following);
    }

    async sendFollowRequest(userId: string, targetUserId: string): Promise<void> {
        console.log("Send Follow Request: ", userId, targetUserId)
        console.log("User Auth id: ", (await supabase.auth.getSession()).data.session?.user.id)
        const { error } = await supabase
            .from('follow_request')
            .insert({ user_request: userId, user_follow: targetUserId });

        if (error) {
            throw new Error(error.message);
        }
    }

    async acceptFollowRequest(userId: string, requesterId: string): Promise<void> {
        // Start a transaction-like operation: first add to follow, then remove from follow_request
        const { error: followError } = await supabase
            .from('follow')
            .insert({ user_id: requesterId, following: userId });

        if (followError) {
            throw new Error(followError.message);
        }

        const { error: deleteError } = await supabase
            .from('follow_request')
            .delete()
            .match({ user_request: requesterId, user_follow: userId });

        if (deleteError) {
            throw new Error(deleteError.message);
        }
    }

    async rejectFollowRequest(userId: string, requesterId: string): Promise<void> {
        const { error } = await supabase
            .from('follow_request')
            .delete()
            .match({ user_request: requesterId, user_follow: userId });

        if (error) {
            throw new Error(error.message);
        }
    }

    async getPendingFollowRequests(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('follow_request')
            .select('user_request')
            .eq('user_follow', userId);

        if (error) {
            throw new Error(error.message);
        }

        return data.map((row: any) => row.user_request);
    }

    async getSentFollowRequests(userId: string): Promise<string[]> {
        const { data, error } = await supabase
            .from('follow_request')
            .select('user_follow')
            .eq('user_request', userId);

        if (error) {
            throw new Error(error.message);
        }

        return data.map((row: any) => row.user_follow);
    }

    async hasFollowRequest(userId: string, targetUserId: string): Promise<boolean> {
        const { data, error } = await supabase
            .from('follow_request')
            .select('*')
            .match({ user_request: userId, user_follow: targetUserId })
            .single();

        if (error && error.code !== 'PGRST116') { // PGRST116 is "Row not found"
            throw new Error(error.message);
        }

        return !!data;
    }
}
