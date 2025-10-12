
import { DeletePost } from "../../../../domain/use-cases/post/DeletePost";
import { MockPostRepository } from "../../../../infra/repositories/MockPostRepository";
import { Post } from "../../../../domain/entities/Post";

describe("DeletePost", () => {
  it("should delete a post", async () => {
    const mockPostRepository = new MockPostRepository();
    const deletePost = new DeletePost(mockPostRepository);

    const post = Post.create(
      "1",
      "Test Post",
      "user1",
      "Test User",
      0,
      "http://example.com/img.png",
      new Date().toISOString(),
      { latitude: 10, longitude: 20 }
    );
    await mockPostRepository.save(post);

    await deletePost.execute({ id: "1" });

    const deletedPost = await mockPostRepository.findById("1");
    expect(deletedPost).toBeUndefined();
  });
});
