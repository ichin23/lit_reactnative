import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Name } from '../../value-objects/Name';
import { Email } from '../../value-objects/Email';
import { Password } from '../../value-objects/Password';
import { GeoCoordinates } from '../../value-objects/GeoCoordinates';
import { Username } from '../../value-objects/Username';

export class RegisterUser {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(params: {
    name: string;
    username: string,
    email: string;
    password: string;
  }): Promise<User> {
    const { name, username, email, password } = params;

    const userExists = await this.userRepository.findByEmail(email);

    if (userExists) {
      if(userExists.email.value==email) throw new Error('Email already in use');
      throw new Error("User already exist")
    }

    const user = User.create(
      Math.random().toString(),
      Name.create(name),
      Username.create(username),
      Email.create(email),
      Password.create(password)
    );

    await this.userRepository.signUpUser(user);

    return user;
  }
}