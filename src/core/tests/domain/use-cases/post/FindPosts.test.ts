
import { FindPosts } from "../../../../domain/use-cases/post/FindPosts";
import { MockPostRepository } from "../../../../infra/repositories/MockPostRepository";
import { Post } from "../../../../domain/entities/Post";

describe("FindPosts", () => {
  it("should find all posts", async () => {
    const mockPostRepository = new MockPostRepository();
    const findPosts = new FindPosts(mockPostRepository);

    const post1 = Post.create("1", "Post 1", "user1", "User 1", 0, "url1", new Date().toISOString(), { latitude: 10, longitude: 20 });
    const post2 = Post.create("2", "Post 2", "user2", "User 2", 0, "url2", new Date().toISOString(), { latitude: 11, longitude: 21 });

    await mockPostRepository.save(post1);
    await mockPostRepository.save(post2);

    const posts = await findPosts.execute();

    expect(posts).toHaveLength(7);
    expect(posts).toContainEqual(post1);
    expect(posts).toContainEqual(post2);
  });
});
