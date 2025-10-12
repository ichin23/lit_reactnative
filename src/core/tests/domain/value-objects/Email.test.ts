
import { Email } from "../../../domain/value-objects/Email";

describe("Email", () => {
  it("should create a valid email", () => {
    const emailValue = "test@example.com";
    const email = Email.create(emailValue);
    expect(email).toBeInstanceOf(Email);
    expect(email.value).toBe(emailValue);
  });

  it("should throw an error for an invalid email", () => {
    const invalidEmail = "invalid-email";
    expect(() => Email.create(invalidEmail)).toThrow("Invalid email");
  });
});
