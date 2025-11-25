import { posts } from "../../../services/data";
import { Post } from "../../domain/entities/Post";
import { ClusteredPost, IPostRepository } from "../../domain/repositories/IPostRepository";

export class MockPostRepository implements IPostRepository {
  private static instance: MockPostRepository;

  private posts: Post[] = [];

  private constructor() { }

  public static getInstance(): MockPostRepository {
    if (!MockPostRepository.instance) {
      MockPostRepository.instance = new MockPostRepository();
    }
    return MockPostRepository.instance
  }

  async save(post: Post): Promise<void> {
    this.posts.push(post);
    console.log("Post add mock")
  }

  async getAll(sortBy?: 'createdAt' | 'partiu'): Promise<Post[]> {
    let sortedPosts = [...this.posts];

    if (sortBy === 'createdAt') {
      sortedPosts.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
    } else if (sortBy === 'partiu') {
      sortedPosts.sort((a, b) => b.partiu - a.partiu);
    }

    return sortedPosts;
  }

  async findById(id: string): Promise<Post | undefined> {
    return this.posts.find(post => post.id === id);
  }

  async findByUserId(userId: string): Promise<Post[]> {
    return this.posts.filter(post => post.userId === userId);
  }

  async findByGeolocation(latitude: number, longitude: number, radius: number): Promise<Post[]> {
    return this.posts.filter(post => {
      const distance = Math.sqrt(
        Math.pow(post.geolocation.latitude - latitude, 2) +
        Math.pow(post.geolocation.longitude - longitude, 2)
      );
      return distance <= radius;
    });
  }


  async findClusteredByGeolocation(latitude: number, longitude: number, radius: number, zoom: number): Promise<ClusteredPost[]> {
    // Mock implementation: return all posts in a single cluster for now
    return [{
      cluster_id: '1',
      posts: this.posts
    }];
  }

  async update(id: string, post: Partial<Post>): Promise<void> {
    const index = this.posts.findIndex(p => p.id === id);
    if (index !== -1) {
      // Create a new Post instance with updated properties
      const existingPost = this.posts[index];
      // This is a bit hacky for a mock, but we can't easily update readonly properties without a proper method or reflection
      // For now, let's assume we can cast to any to bypass readonly for the mock
      this.posts[index] = { ...existingPost, ...post } as Post;
    }
  }

  async delete(id: string): Promise<void> {
    this.posts = this.posts.filter(post => post.id !== id);
  }

  async addPartiu(postId: string, userId: string): Promise<void> {
    const index = this.posts.findIndex(p => p.id === postId);
    if (index !== -1) {
      const post = this.posts[index];
      // Bypass readonly for mock
      (post as any).partiu++;
    }
  }

  async getFeedClusters(): Promise<Post[][]> {
    return [this.posts];
  }

  public static reset() {
    this.getInstance().posts = [];
  }
}