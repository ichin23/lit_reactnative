import { IUserRepository } from "../../repositories/IUserRepository";

export class LogoutUser {
  constructor(private readonly repository: IUserRepository) {}

  async execute(params: { userId: string }): Promise<void> {
    // In a real-world scenario, this would invalidate a token or session.
    // For this example, we don't have a session to invalidate.
    this.repository.signOut()
    console.log(`User ${params.userId} logged out.`);
  }
}