import { FindUserByEmail } from "../../../../domain/use-cases/user/FindUserByEmail";
import { MockUserRepository } from "../../../../infra/repositories/MockUserRepository";
import { User } from "../../../../domain/entities/User";
import { Name } from "../../../../domain/value-objects/Name";
import { Email } from "../../../../domain/value-objects/Email";
import { Password } from "../../../../domain/value-objects/Password";
import { Username } from "../../../../domain/value-objects/Username";

describe("FindUserByEmail", () => {
  const mockUserRepository = new MockUserRepository();
  const findUserByEmail = new FindUserByEmail(mockUserRepository);

  const user = User.create(
    "1",
    Name.create("Test User"),
    Username.create("testuser"),
    Email.create("test@example.com"),
    Password.create("hashed_password")
  );

  beforeAll(async () => {
    await mockUserRepository.save(user);
  });

  it("should find a user by email", async () => {
    const result = await findUserByEmail.execute({ email: "test@example.com" });
    expect(result).toEqual(user);
  });

  it("should return null if user is not found", async () => {
    const result = await findUserByEmail.execute({ email: "not-found@example.com" });
    expect(result).toBeNull();
  });
});
