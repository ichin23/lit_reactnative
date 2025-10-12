
import { makePostUseCases } from "../../factories/makePostUseCases";

describe("makePostUseCases", () => {
  it("should return all post use cases", () => {
    const useCases = makePostUseCases();

    expect(useCases.createPost).toBeDefined();
    expect(useCases.updatePost).toBeDefined();
    expect(useCases.deletePost).toBeDefined();
    expect(useCases.findPosts).toBeDefined();
    expect(useCases.findPostByUserId).toBeDefined();
    expect(useCases.findPostByGeoLocation).toBeDefined();
  });
});
