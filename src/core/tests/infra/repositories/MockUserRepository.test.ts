
import { MockUserRepository } from "../../../infra/repositories/MockUserRepository";
import { User } from "../../../domain/entities/User";
import { Name } from "../../../domain/value-objects/Name";
import { Email } from "../../../domain/value-objects/Email";
import { Password } from "../../../domain/value-objects/Password";
import { GeoCoordinates } from "../../../domain/value-objects/GeoCoordinates";

describe("MockUserRepository", () => {
  let repository: MockUserRepository;
  let user1: User;
  let user2: User;

  beforeEach(() => {
    repository = new MockUserRepository();
    user1 = User.create("1", Name.create("User 1"), Email.create("user1@example.com"), Password.create("password123"));
    user2 = User.create("2", Name.create("User 2"), Email.create("user2@example.com"), Password.create("password456"));
  });

  it("should save and find a user by id", async () => {
    await repository.save(user1);
    const found = await repository.findById("1");
    expect(found).toEqual(user1);
  });

  it("should find a user by email", async () => {
    await repository.save(user1);
    const found = await repository.findByEmail("user1@example.com");
    expect(found).toEqual(user1);
  });

  it("should return null if user is not found by email", async () => {
    const found = await repository.findByEmail("nonexistent@example.com");
    expect(found).toBeNull();
  });

  it("should update a user", async () => {
    await repository.save(user1);
    const updatedUser = User.create("1", Name.create("Updated User"), Email.create("user1@example.com"), Password.create("newpassword"));
    await repository.update(updatedUser);
    const found = await repository.findById("1");
    expect(found).toEqual(updatedUser);
  });

  it("should delete a user", async () => {
    await repository.save(user1);
    await repository.delete("1");
    const found = await repository.findById("1");
    expect(found).toBeNull();
  });
});
