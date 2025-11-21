
import { UpdatePost } from "../../../../domain/use-cases/post/UpdatePost";
import { MockPostRepository } from "../../../../infra/repositories/MockPostRepository";
import { Post } from "../../../../domain/entities/Post";
import { GeoCoordinates } from "../../../../domain/value-objects/GeoCoordinates";

describe("UpdatePost", () => {
  it("should update a post", async () => {
    const mockPostRepository = new MockPostRepository();
    const updatePost = new UpdatePost(mockPostRepository);

    const originalPost = Post.create(
      "1",
      "Original Title",
      "user1",
      "User 1",
      undefined,
      0,
      "url1",
      new Date().toISOString(),
      GeoCoordinates.create(10, 20)
    );
    await mockPostRepository.save(originalPost);

    const updatedData = {
      id: "1",
      title: "Updated Title",
      userId: "user1",
      userName: "User 1",
      userProfileImgUrl: undefined,
      partiu: 1,
      imgUrl: "url2",
      datetime: new Date().toISOString(),
      geolocation: GeoCoordinates.create(11, 21),
    };

    await updatePost.execute(updatedData);

    const updatedPost = await mockPostRepository.findById("1");

    expect(updatedPost).toBeDefined();
    expect(updatedPost!.title).toBe(updatedData.title);
    expect(updatedPost!.partiu).toBe(updatedData.partiu);
    expect(updatedPost!.geolocation).toEqual(updatedData.geolocation);
  });
});
