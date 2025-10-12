
import { FindPostByUserId } from "../../../../domain/use-cases/post/FindPostByUserId";
import { MockPostRepository } from "../../../../infra/repositories/MockPostRepository";
import { Post } from "../../../../domain/entities/Post";

describe("FindPostByUserId", () => {
  it("should find posts by user id", async () => {
    const mockPostRepository = new MockPostRepository();
    const findPostByUserId = new FindPostByUserId(mockPostRepository);

    const post1 = Post.create("1", "Post 1", "user1", "User 1", 0, "url1", new Date().toISOString(), { latitude: 10, longitude: 20 });
    const post2 = Post.create("2", "Post 2", "user1", "User 1", 0, "url2", new Date().toISOString(), { latitude: 11, longitude: 21 });
    const post3 = Post.create("3", "Post 3", "user2", "User 2", 0, "url3", new Date().toISOString(), { latitude: 12, longitude: 22 });

    await mockPostRepository.save(post1);
    await mockPostRepository.save(post2);
    await mockPostRepository.save(post3);

    const posts = await findPostByUserId.execute({ userId: "user1" });

    expect(posts).toHaveLength(2);
    expect(posts).toContainEqual(post1);
    expect(posts).toContainEqual(post2);
  });
});
