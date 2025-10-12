
import { CreatePost } from "../../../../domain/use-cases/post/CreatePost";
import { MockPostRepository } from "../../../../infra/repositories/MockPostRepository";
import { Post } from "../../../../domain/entities/Post";
import { GeoCoordinates } from "../../../../domain/value-objects/GeoCoordinates";

describe("CreatePost", () => {
  it("should create a new post", async () => {
    const mockPostRepository = new MockPostRepository();
    const createPost = new CreatePost(mockPostRepository);

    const postData = {
      title: "Test Post",
      userId: "1",
      userName: "Test User",
      imgUrl: "http://example.com/img.png",
      datetime: new Date().toISOString(),
      geolocation: GeoCoordinates.create(10, 20),
    };

    const post = await createPost.execute(postData);

    expect(post).toBeInstanceOf(Post);
    expect(post.title).toBe(postData.title);
    expect(post.userId).toBe(postData.userId);

    const savedPost = await mockPostRepository.findById(post.id);
    expect(savedPost).toEqual(post);
  });
});
