
import { MockPostRepository } from "../../../infra/repositories/MockPostRepository";
import { Post } from "../../../domain/entities/Post";
import { GeoCoordinates } from "../../../domain/value-objects/GeoCoordinates";
import { posts } from "../../../../services/data";

describe("MockPostRepository", () => {
  let repository: MockPostRepository;
  let post1: Post;
  let post2: Post;

  beforeEach(async () => {
    MockPostRepository.reset();
    repository = MockPostRepository.getInstance();
    post1 = Post.create("1", "Post 1", "user1", "User 1", undefined, 0, "url1", new Date().toISOString(), GeoCoordinates.create(10, 20));
    post2 = Post.create("2", "2", "user2", "User 2", undefined, 0, "url2", new Date().toISOString(), GeoCoordinates.create(30, 40));

    await repository.save(post1);
    await repository.save(post2);
  });

  it("should save a post", async () => {
    const post = Post.create("3", "Post 3", "user3", "User 3", undefined, 0, "url3", new Date().toISOString(), GeoCoordinates.create(50, 60));
    await repository.save(post);
    const foundPost = await repository.findById("3");
    expect(foundPost).toEqual(post);
  });

  it("should find a post by id", async () => {
    const foundPost = await repository.findById("1");
    expect(foundPost).toEqual(post1);
  });

  it("should find posts by user id", async () => {
    const posts = await repository.findByUserId("user1");
    expect(posts).toContainEqual(post1);
    expect(posts).not.toContainEqual(post2);
  });

  it("should find posts by geolocation", async () => {
    const posts = await repository.findByGeolocation(10, 20, 100); // Large radius
    expect(posts).toContainEqual(post1);
  });

  it("should update a post", async () => {
    const updatedPost = Post.create("1", "Updated Post", "user1", "User 1", undefined, 1, "url1_updated", new Date().toISOString(), GeoCoordinates.create(11, 21));
    await repository.update("1", updatedPost);
    const found = await repository.findById("1");
    expect(found).toEqual(updatedPost);
  });

  it("should delete a post", async () => {
    await repository.delete("1");
    const found = await repository.findById("1");
    expect(found).toBeUndefined();
  });
});
