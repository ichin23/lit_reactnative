import { User } from '../../entities/User';
import { IUserRepository } from '../../repositories/IUserRepository';
import { Name } from '../../value-objects/Name';
import { Email } from '../../value-objects/Email';
import { GeoCoordinates } from '../../value-objects/GeoCoordinates';
import { Username } from '../../value-objects/Username';

export class UpdateUser {
  constructor(private readonly userRepository: IUserRepository) { }

  async execute(params: {
    id: string;
    name?: string;
    username?: string,
    email?: string;
    imgUrl?: string;
  }): Promise<User> {
    const { id, name, username, email, imgUrl } = params;

    const user = await this.userRepository.findById(id);

    if (!user) {
      throw new Error('User not found');
    }

    const newName = name ? Name.create(name) : user.name;
    const newUsername = username ? Username.create(username) : user.username
    const newEmail = email ? Email.create(email) : user.email;
    const newImgUrl = imgUrl ? imgUrl : user.imgUrl;

    const updatedUser = User.create(
      user.id,
      newName,
      newUsername,
      newEmail,
      user.password, // Password is not updated here for security reasons
      newImgUrl
    );

    await this.userRepository.update(updatedUser);

    return updatedUser;
  }
}