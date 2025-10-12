
import { Name } from "../../../domain/value-objects/Name";

describe("Name", () => {
  it("should create a valid name", () => {
    const nameValue = "John Doe";
    const name = Name.create(nameValue);
    expect(name).toBeInstanceOf(Name);
    expect(name.value).toBe(nameValue);
  });

  it("should throw an error for an empty name", () => {
    const invalidName = "";
    expect(() => Name.create(invalidName)).toThrow("Invalid name");
  });
});
