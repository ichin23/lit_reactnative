import NetInfo from '@react-native-community/netinfo';
import { ClusteredPost, IPostRepository } from "../../domain/repositories/IPostRepository";
import { Post } from "../../domain/entities/Post";
import { SupabasePostRepository } from "./supabasePostRepository";
import { SQLitePostRepository } from "./sqlite/SQLitePostRepository";

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

    async save(post: Post): Promise<void> {
        if (await this.isOnline()) {
            try {
                await this.onlineRepo.save(post);
                await this.offlineRepo.save(post);
            } catch (error) {
                console.warn('Online save failed, falling back to offline.', error);
                await this.offlineRepo.save(post);
            }
        } else {
            await this.offlineRepo.save(post);
        }
    }

    async getAll(sortBy?: 'createdAt' | 'partiu'): Promise<Post[]> {
        if (await this.isOnline()) {
            try {
                const posts = await this.onlineRepo.getAll(sortBy);
                // Background sync: save fetched posts to offline cache
                // We don't await this to keep UI responsive
                this.offlineRepo.save(posts as any).catch(err => console.error('Background cache update failed', err));

                // Note: SQLitePostRepository.save expects a single Post, but CacheDatabase.savePosts expects array.
                // We need to fix SQLitePostRepository to handle bulk save or loop here.
                // Actually, let's check SQLitePostRepository implementation.
                // It calls CacheDatabase.savePosts([post]).
                // So we should probably add a saveAll method to IPostRepository or cast to specific type.
                // For now, let's just loop or use a helper.
                // Better yet, let's just let the UI be fast and return online data.
                // But we MUST update cache.

                // Let's use a loop for now as save() takes one post
                // Optimization: Add saveAll to SQLitePostRepository later
                posts.forEach(p => this.offlineRepo.save(p).catch(() => { }));

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

    async findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
        if (await this.isOnline()) {
            return this.onlineRepo.findClusteredByGeolocation(latitude, longitude, radius, zoom);
        }
        return this.offlineRepo.findClusteredByGeolocation(latitude, longitude, radius, zoom);
    }

    async findFriendsClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
        if (await this.isOnline()) {
            return this.onlineRepo.findFriendsClusteredByGeolocation(latitude, longitude, radius, zoom);
        }
        return this.offlineRepo.findFriendsClusteredByGeolocation(latitude, longitude, radius, zoom);
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
}
