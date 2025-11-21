import { Email } from '../value-objects/Email';
import { GeoCoordinates } from '../value-objects/GeoCoordinates';
import { Name } from '../value-objects/Name';
import { Password } from '../value-objects/Password';
import { Username } from '../value-objects/Username';

export class User {
  private constructor(
    readonly id: string,
    readonly name: Name,
    readonly username: Username,
    readonly email: Email,
    readonly password: Password,
    readonly imgUrl?: string
  ) { }

  static create(
    id: string,
    name: Name,
    username: Username,
    email: Email,
    password: Password,
    imgUrl?: string
  ): User {
    return new User(id, name, username, email, password, imgUrl);
  }
}