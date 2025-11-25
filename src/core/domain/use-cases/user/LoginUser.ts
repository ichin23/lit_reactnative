import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Email } from '../../value-objects/Email';

export class LoginUser {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(params: {
    email: string;
    password: string;
  }): Promise<User> {
    const { email, password } = params;
    const user = await this.userRepository.signInUser({email, password});
    return user;
  }

  private async comparePassword(
    password: string,
    hashedPassword: string
  ): Promise<boolean> {
    return `hashed_${password}` === hashedPassword;
  }
}