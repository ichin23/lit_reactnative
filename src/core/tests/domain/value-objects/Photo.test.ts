
import { Photo } from "../../../domain/value-objects/Photo";

describe("Photo", () => {
  it("should create a valid photo with a valid URL", () => {
    const photoUrl = "http://example.com/photo.jpg";
    const photo = Photo.create(photoUrl);
    expect(photo).toBeInstanceOf(Photo);
    expect(photo.url).toBe(photoUrl);
  });

  it("should throw an error for an invalid URL", () => {
    const invalidUrl = "invalid-url";
    expect(() => Photo.create(invalidUrl)).toThrow("Invalid photo URL");
  });
});
