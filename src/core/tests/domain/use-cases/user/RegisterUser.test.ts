
import { RegisterUser } from "../../../../domain/use-cases/user/RegisterUser";
import { MockUserRepository } from "../../../../infra/repositories/MockUserRepository";
import { User } from "../../../../domain/entities/User";
import { Name } from "../../../../domain/value-objects/Name";
import { Email } from "../../../../domain/value-objects/Email";
import { Password } from "../../../../domain/value-objects/Password";
import { GeoCoordinates } from "../../../../domain/value-objects/GeoCoordinates";

describe("RegisterUser", () => {
  it("should register a new user", async () => {
    const mockUserRepository = new MockUserRepository();
    const registerUser = new RegisterUser(mockUserRepository);

    const userData = {
      name: "Test User",
      email: "test@example.com",
      password: "password123"
    };

    const user = await registerUser.execute(userData);

    expect(user).toBeInstanceOf(User);
    expect(user.name.value).toBe(userData.name);
    expect(user.email.value).toBe(userData.email);

    const savedUser = await mockUserRepository.findByEmail(userData.email);
    expect(savedUser).toEqual(user);
  });

  it("should throw an error if user already exists", async () => {
    const mockUserRepository = new MockUserRepository();
    const registerUser = new RegisterUser(mockUserRepository);

    const existingUser = User.create(
      "1",
      Name.create("Existing User"),
      Email.create("exists@example.com"),
      Password.create("hashed_password")
    );
    await mockUserRepository.save(existingUser);

    const userData = {
      name: "New User",
      email: "exists@example.com",
      password: "new_password",
      latitude: 3,
      longitude: 4,
    };

    await expect(registerUser.execute(userData)).rejects.toThrow("User already exists");
  });
});
