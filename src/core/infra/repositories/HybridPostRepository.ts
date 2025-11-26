import NetInfo from '@react-native-community/netinfo';
import { ClusteredPost, IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import { SupabasePostRepository } from "./supabasePostRepository";
import { SQLitePostRepository } from "./sqlite/SQLitePostRepository";
import { ImageUploadService } from "../../services/ImageUploadService";

export class HybridPostRepository implements IPostRepository {
    private static instance: HybridPostRepository;
    private onlineRepo: IPostRepository;
    private offlineRepo: IPostRepository;

    private constructor() {
        this.onlineRepo = SupabasePostRepository.getInstance();
        this.offlineRepo = SQLitePostRepository.getInstance();
    }

    public static getInstance(): HybridPostRepository {
        if (!HybridPostRepository.instance) {
            HybridPostRepository.instance = new HybridPostRepository();
        }
        return HybridPostRepository.instance;
    }

    private async isOnline(): Promise<boolean> {
        const state = await NetInfo.fetch();
        return state.isConnected ?? false;
    }

    async save(post: Post): Promise<Post> {
        if (await this.isOnline()) {
            try {
                let finalPost = post;
                // Check for local URIs (file://, content://, ph://)
                if (post.imgUrl && (post.imgUrl.startsWith('file://') || post.imgUrl.startsWith('content://') || post.imgUrl.startsWith('ph://'))) {
                    // Upload image
                    const fileName = post.imgUrl.split('/').pop();
                    const publicUrl = await ImageUploadService.uploadImage(
                        { uri: post.imgUrl },
                        'lit-photos',
                        fileName || `post_${Date.now()}.jpg`
                    );

                    // Create new post with updated URL
                    finalPost = Post.create(
                        post.id,
                        post.title,
                        post.userId,
                        post.userName,
                        post.userProfileImgUrl,
                        post.username,
                        post.partiu,
                        publicUrl, // New URL
                        post.datetime,
                        post.geolocation,
                        post.only_friends,
                        post.createdAt
                    );
                }

                const savedPost = await this.onlineRepo.save(finalPost);
                await this.offlineRepo.save(savedPost, 'synced');
                return savedPost;
            } catch (error) {
                console.warn('Online save failed, falling back to offline.', error);
                await this.offlineRepo.save(post, 'pending');
                return post;
            }
        } else {
            await this.offlineRepo.save(post, 'pending');
            return post;
        }
    }

    async getAll(sortBy?: 'createdAt' | 'partiu'): Promise<Post[]> {
        if (await this.isOnline()) {
            try {
                const posts = await this.onlineRepo.getAll(sortBy);
                // Background sync: save fetched posts to offline cache
                // We don't await this to keep UI responsive
                // Background sync: save fetched posts to offline cache
                // We don't await this to keep UI responsive
                if (this.offlineRepo instanceof SQLitePostRepository) {
                    (this.offlineRepo as SQLitePostRepository).replaceSyncedPosts(posts).catch(err => console.error('Background cache update failed', err));
                } else {
                    // Fallback if not SQLitePostRepository (should not happen with current setup)
                    posts.forEach(p => this.offlineRepo.save(p).catch(() => { }));
                }

                return posts;

                return posts;
            } catch (error) {
                console.warn('Online fetch failed, falling back to offline.', error);
                return this.offlineRepo.getAll(sortBy);
            }
        }
        return this.offlineRepo.getAll(sortBy);
    }

    async findById(id: string): Promise<Post | undefined> {
        if (await this.isOnline()) {
            try {
                const post = await this.onlineRepo.findById(id);
                if (post) {
                    this.offlineRepo.save(post).catch(() => { });
                    return post;
                }
            } catch (error) {
                console.warn('Online findById failed, falling back to offline.', error);
            }
        }
        return this.offlineRepo.findById(id);
    }

    async findByUserId(userId: string): Promise<Post[]> {
        if (await this.isOnline()) {
            try {
                const posts = await this.onlineRepo.findByUserId(userId);
                posts.forEach(p => this.offlineRepo.save(p).catch(() => { }));
                return posts;
            } catch (error) {
                console.warn('Online findByUserId failed, falling back to offline.', error);
            }
        }
        return this.offlineRepo.findByUserId(userId);
    }

    async findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]> {
        if (await this.isOnline()) {
            return this.onlineRepo.findByGeolocation(latitude, longitude, radius);
        }
        return this.offlineRepo.findByGeolocation(latitude, longitude, radius);
    }

    async findFriendsPosts(): Promise<Post[]> {
        if (await this.isOnline()) {
            return this.onlineRepo.findFriendsPosts();
        }
        return this.offlineRepo.findFriendsPosts();
    }

    async findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
        if (await this.isOnline()) {
            return this.onlineRepo.findClusteredByGeolocation(latitude, longitude, radius, zoom);
        }
        return this.offlineRepo.findClusteredByGeolocation(latitude, longitude, radius, zoom);
    }

    async update(id: string, post: Partial<Post>): Promise<void> {
        if (await this.isOnline()) {
            try {
                await this.onlineRepo.update(id, post);
                await this.offlineRepo.update(id, post);
            } catch (error) {
                console.warn('Online update failed, falling back to offline.', error);
                await this.offlineRepo.update(id, post);
            }
        } else {
            await this.offlineRepo.update(id, post);
        }
    }

    async delete(id: string): Promise<void> {
        if (await this.isOnline()) {
            try {
                await this.onlineRepo.delete(id);
                await this.offlineRepo.delete(id);
            } catch (error) {
                console.warn('Online delete failed, falling back to offline.', error);
                await this.offlineRepo.delete(id);
            }
        } else {
            await this.offlineRepo.delete(id);
        }
    }

    async addPartiu(postId: string, userId: string): Promise<void> {
        if (await this.isOnline()) {
            await this.onlineRepo.addPartiu(postId, userId);
        } else {
            await this.offlineRepo.addPartiu(postId, userId);
        }
    }

    async getFeedClusters(): Promise<Post[][]> {
        if (await this.isOnline()) {
            return this.onlineRepo.getFeedClusters();
        }
        return this.offlineRepo.getFeedClusters();
    }
    async syncPendingPosts(): Promise<void> {
        if (!(await this.isOnline())) {
            return;
        }

        const pendingPosts = await (this.offlineRepo as SQLitePostRepository).getPendingPosts();
        if (pendingPosts.length === 0) {
            return;
        }

        console.log(`Syncing ${pendingPosts.length} pending posts...`);

        for (const post of pendingPosts) {
            try {
                let finalPost = post;
                if (post.imgUrl && (post.imgUrl.startsWith('file://') || post.imgUrl.startsWith('content://') || post.imgUrl.startsWith('ph://'))) {
                    console.log(`Uploading image for pending post ${post.id}...`);
                    const fileName = post.imgUrl.split('/').pop();
                    try {
                        const publicUrl = await ImageUploadService.uploadImage(
                            { uri: post.imgUrl },
                            'lit-photos',
                            fileName || `post_${Date.now()}.jpg`
                        );

                        finalPost = Post.create(
                            post.id,
                            post.title,
                            post.userId,
                            post.userName,
                            post.userProfileImgUrl,
                            post.username,
                            post.partiu,
                            publicUrl,
                            post.datetime,
                            post.geolocation,
                            post.only_friends,
                            post.createdAt
                        );
                    } catch (uploadError) {
                        console.error(`Failed to upload image for post ${post.id}:`, uploadError);
                        // If upload fails, we might want to skip this post or retry later.
                        // For now, we continue to next post.
                        continue;
                    }
                }

                const savedPost = await this.onlineRepo.save(finalPost);

                // If ID changed (which is likely if we used a temp ID), delete the old pending post
                if (savedPost.id !== post.id) {
                    console.log(`Post ID changed from ${post.id} to ${savedPost.id}. Deleting old pending post.`);
                    await this.offlineRepo.delete(post.id);
                }

                // Update local cache to 'synced' with new URL and ID
                await this.offlineRepo.save(savedPost, 'synced');
                console.log(`Synced post ${savedPost.id}`);
            } catch (error) {
                console.error(`Failed to sync post ${post.id}:`, error);
                // Keep it as pending
            }
        }
    }
}
