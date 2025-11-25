import * as SQLite from 'expo-sqlite';
import { Post } from '../../domain/entities/Post';
import { User } from '../../domain/entities/User';
import { Name } from '../../domain/value-objects/Name';
import { Username } from '../../domain/value-objects/Username';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { GeoCoordinates } from '../../domain/value-objects/GeoCoordinates';

export class CacheDatabase {
    private static db: SQLite.SQLiteDatabase;

    private static initPromise: Promise<void> | null = null;

    static async init() {
        if (this.db) return;

        if (this.initPromise) {
            return this.initPromise;
        }

        this.initPromise = (async () => {
            try {
                await this.performInit();
            } catch (error) {
                console.error('Initial cache DB init failed, attempting to reset...', error);
                try {
                    // Close if possible (though db might be null)
                    if (this.db) {
                        await (this.db as any).closeAsync?.();
                    }
                    // Delete the database file
                    await SQLite.deleteDatabaseAsync('lit_cache.db');
                    this.db = undefined as any; // Reset db reference

                    // Retry init
                    await this.performInit();
                    console.log('Cache DB recovered after reset');
                } catch (retryError) {
                    console.error('Fatal: Could not initialize cache DB even after reset:', retryError);
                    this.initPromise = null; // Allow retry later
                    throw retryError;
                }
            }
        })();

        return this.initPromise;
    }

    private static async performInit() {
        this.db = await SQLite.openDatabaseAsync('lit_cache.db');

        // Create cached_posts table
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS cached_posts (
                id TEXT PRIMARY KEY,
                title TEXT,
                userId TEXT NOT NULL,
                authorName TEXT, 
                userProfileImgUrl TEXT,
                username TEXT,
                partiu INTEGER DEFAULT 0,
                imgUrl TEXT,
                datetime TEXT,
                geolocation_lat REAL,
                geolocation_lng REAL,
                only_friends INTEGER DEFAULT 0,
                createdAt TEXT,
                cachedAt TEXT NOT NULL
            );
        `);

        // Create cached_users table
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS cached_users (
                id TEXT PRIMARY KEY,
                name TEXT NOT NULL,
                username TEXT NOT NULL,
                email TEXT NOT NULL,
                imgUrl TEXT,
                cachedAt TEXT NOT NULL
            );
        `);

        // Create cache_metadata table
        await this.db.execAsync(`
            CREATE TABLE IF NOT EXISTS cache_metadata (
                key TEXT PRIMARY KEY,
                lastSync TEXT NOT NULL,
                status TEXT DEFAULT 'fresh'
            );
        `);

        console.log('Cache database initialized');
    }

    // ==================== POST CACHE METHODS ====================

    static async savePost(post: Post): Promise<void> {
        try {
            await this.init();
            const now = new Date().toISOString();

            await this.db.runAsync(
                `INSERT OR REPLACE INTO cached_posts 
                (id, title, userId, authorName, userProfileImgUrl, username, partiu, imgUrl, datetime, 
                 geolocation_lat, geolocation_lng, only_friends, createdAt, cachedAt) 
                VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                [
                    post.id,
                    post.title,
                    post.userId,
                    post.userName,
                    post.userProfileImgUrl || null,
                    post.username,
                    post.partiu,
                    post.imgUrl,
                    post.datetime,
                    post.geolocation.latitude,
                    post.geolocation.longitude,
                    post.only_friends ? 1 : 0,
                    (post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt)).toISOString(),
                    now
                ]
            );

            // Update metadata
            await this.updateCacheMetadata('posts');
        } catch (error) {
            console.error('Error saving post to cache:', error);
        }
    }

    static async savePosts(posts: Post[]): Promise<void> {
        try {
            await this.init();

            const now = new Date().toISOString();

            // We do NOT clear old posts here anymore. This method is for upserting.
            // Use replacePosts if you want to clear cache first.

            // Insert new posts
            for (const post of posts) {
                await this.db.runAsync(
                    `INSERT OR REPLACE INTO cached_posts 
                    (id, title, userId, authorName, userProfileImgUrl, username, partiu, imgUrl, datetime, 
                     geolocation_lat, geolocation_lng, only_friends, createdAt, cachedAt) 
                    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
                    [
                        post.id,
                        post.title,
                        post.userId,
                        post.userName,
                        post.userProfileImgUrl || null,
                        post.username,
                        post.partiu,
                        post.imgUrl,
                        post.datetime,
                        post.geolocation.latitude,
                        post.geolocation.longitude,
                        post.only_friends ? 1 : 0,
                        (post.createdAt instanceof Date ? post.createdAt : new Date(post.createdAt)).toISOString(),
                        now
                    ]
                );
            }

            // Update metadata
            await this.updateCacheMetadata('posts');

            console.log(`Cached ${posts.length} posts (upsert)`);
        } catch (error) {
            console.error('Error saving posts to cache:', error);
        }
    }

    static async replacePosts(posts: Post[]): Promise<void> {
        try {
            await this.init();

            // Clear old posts first
            await this.db.runAsync('DELETE FROM cached_posts');

            // Then save new ones
            await this.savePosts(posts);

            console.log(`Replaced cache with ${posts.length} posts`);
        } catch (error) {
            console.error('Error replacing posts cache:', error);
        }
    }

    static async getPosts(limit: number = 100): Promise<Post[]> {
        try {
            await this.init();

            const results = await this.db.getAllAsync(
                `SELECT * FROM cached_posts ORDER BY createdAt DESC LIMIT ?`,
                [limit]
            );

            return results.map((row: any) => Post.create(
                row.id,
                row.title,
                row.userId,
                row.authorName, // Map back from authorName
                row.userProfileImgUrl,
                row.username,
                row.partiu,
                row.imgUrl,
                row.datetime,
                GeoCoordinates.create(row.geolocation_lat, row.geolocation_lng),
                row.only_friends === 1,
                row.createdAt
            ));
        } catch (error) {
            console.error('Error getting posts from cache:', error);
            return [];
        }
    }

    static async getPostsByUserId(userId: string): Promise<Post[]> {
        try {
            await this.init();

            const results = await this.db.getAllAsync(
                `SELECT * FROM cached_posts WHERE userId = ? ORDER BY createdAt DESC`,
                [userId]
            );

            return results.map((row: any) => Post.create(
                row.id,
                row.title,
                row.userId,
                row.authorName, // Map back from authorName
                row.userProfileImgUrl,
                row.username,
                row.partiu,
                row.imgUrl,
                row.datetime,
                GeoCoordinates.create(row.geolocation_lat, row.geolocation_lng),
                row.only_friends === 1,
                row.createdAt
            ));
        } catch (error) {
            console.error('Error getting posts by userId from cache:', error);
            return [];
        }
    }

    // ==================== USER CACHE METHODS ====================

    static async saveUser(user: User): Promise<void> {
        try {
            await this.init();

            const now = new Date().toISOString();

            await this.db.runAsync(
                `INSERT OR REPLACE INTO cached_users (id, name, username, email, imgUrl, cachedAt) 
                 VALUES (?, ?, ?, ?, ?, ?)`,
                [
                    user.id,
                    user.name.value,
                    user.username.value,
                    user.email.value,
                    user.imgUrl || null,
                    now
                ]
            );

            console.log(`Cached user: ${user.username.value}`);
        } catch (error) {
            console.error('Error saving user to cache:', error);
        }
    }

    static async getUser(id: string): Promise<User | null> {
        try {
            await this.init();

            const result = await this.db.getFirstAsync(
                'SELECT * FROM cached_users WHERE id = ?',
                [id]
            );

            if (result) {
                const user = result as any;
                return User.create(
                    user.id,
                    Name.create(user.name),
                    Username.create(user.username),
                    Email.create(user.email),
                    Password.create('Cached123*'), // Placeholder
                    user.imgUrl
                );
            }

            return null;
        } catch (error) {
            console.error('Error getting user from cache:', error);
            return null;
        }
    }

    // ==================== CACHE METADATA METHODS ====================

    static async updateCacheMetadata(key: string): Promise<void> {
        try {
            await this.init();

            const now = new Date().toISOString();

            await this.db.runAsync(
                `INSERT OR REPLACE INTO cache_metadata (key, lastSync, status) VALUES (?, ?, 'fresh')`,
                [key, now]
            );
        } catch (error) {
            console.error('Error updating cache metadata:', error);
        }
    }

    static async getCacheAge(key: string): Promise<number> {
        try {
            await this.init();

            const result = await this.db.getFirstAsync(
                'SELECT lastSync FROM cache_metadata WHERE key = ?',
                [key]
            );

            if (result) {
                const lastSync = new Date((result as any).lastSync);
                const now = new Date();
                return now.getTime() - lastSync.getTime();
            }

            return Infinity; // No cache exists
        } catch (error) {
            console.error('Error getting cache age:', error);
            return Infinity;
        }
    }

    // ==================== CACHE MANAGEMENT ====================

    static async pruneCache(): Promise<void> {
        try {
            await this.init();

            // Keep only the 500 most recent posts
            await this.db.runAsync(`
                DELETE FROM cached_posts 
                WHERE id NOT IN (
                    SELECT id FROM cached_posts 
                    ORDER BY cachedAt DESC 
                    LIMIT 500
                )
            `);

            console.log('Cache pruned');
        } catch (error) {
            console.error('Error pruning cache:', error);
        }
    }

    static async clearCache(): Promise<void> {
        try {
            await this.init();

            await this.db.runAsync('DELETE FROM cached_posts');
            await this.db.runAsync('DELETE FROM cached_users');
            await this.db.runAsync('DELETE FROM cache_metadata');

            console.log('Cache cleared');
        } catch (error) {
            console.error('Error clearing cache:', error);
        }
    }
}
