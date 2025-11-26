import { Post } from "../../../domain/entities/Post";
import { ClusteredPost, IPostRepository } from "../../../domain/repositories/IPostRepository";
import { CacheDatabase } from "../../db/CacheDatabase";

export class SQLitePostRepository implements IPostRepository {
    private static instance: SQLitePostRepository;

    private constructor() { }

    public static getInstance(): SQLitePostRepository {
        if (!SQLitePostRepository.instance) {
            SQLitePostRepository.instance = new SQLitePostRepository();
        }
        return SQLitePostRepository.instance;
    }

    async save(post: Post, syncStatus: 'synced' | 'pending' = 'synced'): Promise<Post> {
        // In a real offline scenario, we might want to queue this for sync
        // For now, we just save to the local cache so it appears in the UI
        await CacheDatabase.savePost(post, syncStatus);
        return post;
    }

    async getPendingPosts(): Promise<Post[]> {
        return await CacheDatabase.getPendingPosts();
    }

    async saveAll(posts: Post[]): Promise<void> {
        await CacheDatabase.savePosts(posts);
    }

    async replaceSyncedPosts(posts: Post[]): Promise<void> {
        await CacheDatabase.syncCacheWithOnlinePosts(posts);
    }

    async getAll(sortBy?: 'createdAt' | 'partiu'): Promise<Post[]> {
        // CacheDatabase.getPosts returns posts sorted by createdAt DESC by default
        // We might need to implement sorting in CacheDatabase if 'partiu' sort is needed offline
        return await CacheDatabase.getPosts(100);
    }

    async findById(id: string): Promise<Post | undefined> {
        // CacheDatabase doesn't have a findById for posts yet, but we can filter
        // Or we can add it to CacheDatabase. For now, let's filter from getAll
        // Optimization: Add getPostById to CacheDatabase later
        const posts = await CacheDatabase.getPosts(500); // Get more to increase chance of finding
        return posts.find(p => p.id === id);
    }

    async findByUserId(userId: string): Promise<Post[]> {
        return await CacheDatabase.getPostsByUserId(userId);
    }

    async findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]> {
        // Complex geospatial queries are hard in SQLite without extensions
        // For offline mode, we might return empty or just recent posts
        // For now, returning empty as it's an advanced feature
        console.warn('Geolocation search not supported offline');
        return [];
    }

    async findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
        console.warn('Clustered search not supported offline');
        return [];
    }

    async findFriendsPosts(): Promise<Post[]> {
        console.warn('Friends posts search not supported offline');
        return [];
    }

    async update(id: string, post: Partial<Post>): Promise<void> {
        // We need to implement update in CacheDatabase or re-save the post
        // For now, let's try to find, merge, and save
        const existing = await this.findById(id);
        if (existing) {
            const updated = { ...existing, ...post } as Post;
            // Re-create Post entity to ensure validity if needed, or just cast
            // Since Post properties are readonly, we technically create a new object
            // But CacheDatabase.savePosts takes Post objects.
            // We might need a way to construct a Post from partial data + existing
            // For now, assuming simple properties update

            // Hack: We need to reconstruct the Post entity properly
            // This is a limitation of the current simple Cache implementation
            // Let's just save it if we have the full object, otherwise skip
            // Actually, CacheDatabase.savePosts does an INSERT OR REPLACE
            // So if we have the full object, it works.
            // But we only have Partial<Post> here.

            // TODO: Implement proper update in CacheDatabase
            console.warn('Offline update partially supported');
        }
    }

    async delete(id: string): Promise<void> {
        await CacheDatabase.deletePost(id);
    }

    async addPartiu(postId: string, userId: string): Promise<void> {
        console.warn('Offline addPartiu not supported');
    }

    async getFeedClusters(): Promise<Post[][]> {
        console.warn('Offline feed clusters not supported');
        return [];
    }
}
