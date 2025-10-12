
import { Password } from "../../../domain/value-objects/Password";

describe("Password", () => {
  it("should create a valid password", () => {
    const passwordValue = "password123";
    const password = Password.create(passwordValue);
    expect(password).toBeInstanceOf(Password);
    expect(password.value).toBe(passwordValue);
  });

  it("should throw an error for a password that is too short", () => {
    const invalidPassword = "12345";
    expect(() => Password.create(invalidPassword)).toThrow("Invalid password");
  });
});
