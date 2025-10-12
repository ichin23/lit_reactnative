
import { FindPostByGeoLocation } from "../../../../domain/use-cases/post/FindPostByGeolocation";
import { MockPostRepository } from "../../../../infra/repositories/MockPostRepository";
import { Post } from "../../../../domain/entities/Post";

describe("FindPostByGeoLocation", () => {
  it("should find posts by geolocation", async () => {
    const mockPostRepository = new MockPostRepository();
    const findPostByGeoLocation = new FindPostByGeoLocation(mockPostRepository);

    const post1 = Post.create("1", "Post 1", "user1", "User 1", 0, "url1", new Date().toISOString(), { latitude: 10, longitude: 20 });
    const post2 = Post.create("2", "Post 2", "user2", "User 2", 0, "url2", new Date().toISOString(), { latitude: 10.001, longitude: 20.001 });
    const post3 = Post.create("3", "Post 3", "user3", "User 3", 0, "url3", new Date().toISOString(), { latitude: 30, longitude: 40 });

    await mockPostRepository.save(post1);
    await mockPostRepository.save(post2);
    await mockPostRepository.save(post3);

    const params = { latitude: 10, longitude: 20, radius: 0.2 };
    const posts = await findPostByGeoLocation.execute(params);

    expect(posts).toHaveLength(2);
    expect(posts).toContainEqual(post1);
    expect(posts).toContainEqual(post2);
  });
});
