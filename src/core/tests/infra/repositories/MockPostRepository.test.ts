
import { MockPostRepository } from "../../../infra/repositories/MockPostRepository";
import { Post } from "../../../domain/entities/Post";
import { GeoCoordinates } from "../../../domain/value-objects/GeoCoordinates";
import { posts } from "../../../../services/data";

describe("MockPostRepository", () => {
  let repository: MockPostRepository;
  let post1: Post;
  let post2: Post;

  beforeEach(() => {
    MockPostRepository.reset();
    repository = MockPostRepository.getInstance();
    post1 = Post.create("1", "Post 1", "user1", "User 1", 0, "url1", new Date().toISOString(), GeoCoordinates.create(10, 20));
    post2 = Post.create("2", "Post 2", "user2", "User 2", 0, "url2", new Date().toISOString(), GeoCoordinates.create(30, 40));
  });

  it("should save and find a post by id", async () => {
    await repository.save(post1);
    const found = await repository.findById("1");
    expect(found).toEqual(post1);
  });

  it("should get all posts", async () => {
    await repository.save(post1);
    await repository.save(post2);
    const all = await repository.getAll();
    expect(all).toEqual([post1, post2]);
  });

  it("should find posts by user id", async () => {
    await repository.save(post1);
    await repository.save(post2);
    const user1Posts = await repository.findByUserId("user1");
    expect(user1Posts).toEqual([post1]);
  });

  it("should find posts by geolocation", async () => {
    await repository.save(post1);
    await repository.save(post2);
    const nearbyPosts = await repository.findByGeolocation(10.1, 20.1, 0.2);
    expect(nearbyPosts).toEqual([post1]);
  });

  it("should update a post", async () => {
    await repository.save(post1);
    const updatedPost = Post.create("1", "Updated Post", "user1", "User 1", 1, "url1_updated", new Date().toISOString(), GeoCoordinates.create(11, 21));
    await repository.update(updatedPost);
    const found = await repository.findById("1");
    expect(found).toEqual(updatedPost);
  });

  it("should delete a post", async () => {
    await repository.save(post1);
    await repository.delete("1");
    const found = await repository.findById("1");
    expect(found).toBeUndefined();
  });
});
