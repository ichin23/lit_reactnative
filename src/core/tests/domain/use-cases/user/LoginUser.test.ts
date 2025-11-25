
import { LoginUser } from "../../../../domain/use-cases/user/LoginUser";
import { MockUserRepository } from "../../../../infra/repositories/MockUserRepository";
import { User } from "../../../../domain/entities/User";
import { Name } from "../../../../domain/value-objects/Name";
import { Email } from "../../../../domain/value-objects/Email";
import { Password } from "../../../../domain/value-objects/Password";
import { GeoCoordinates } from "../../../../domain/value-objects/GeoCoordinates";
import { Username } from "../../../../domain/value-objects/Username";

describe("LoginUser", () => {
  const mockUserRepository = new MockUserRepository();
  const loginUser = new LoginUser(mockUserRepository);

  const password = "password123";
  const hashedPassword = `hashed_${password}`;
  const user = User.create(
    "1",
    Name.create("Test User"),
    Username.create("testuser"),
    Email.create("john@example.com"),
    Password.create("password123")
  );

  beforeAll(async () => {
    await mockUserRepository.save(user);
  });

  it("should login a user with valid credentials", async () => {
    const result = await loginUser.execute({ email: "test@example.com", password });
    expect(result).toEqual(user);
  });

  it("should throw an error with invalid password", async () => {
    await expect(loginUser.execute({ email: "test@example.com", password: "wrong_password" })).rejects.toThrow("Credenciais inválidas");
  });

  it("should throw an error with non-existent email", async () => {
    await expect(loginUser.execute({ email: "not-found@example.com", password })).rejects.toThrow("Credenciais inválidas");
  });
});
