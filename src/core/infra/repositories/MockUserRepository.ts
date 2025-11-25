import { IUserRepository } from '../../domain/repositories/IUserRepository';
import { User } from '../../domain/entities/User';
import { Name } from '../../domain/value-objects/Name';
import { Email } from '../../domain/value-objects/Email';
import { Password } from '../../domain/value-objects/Password';
import { Username } from '../../domain/value-objects/Username';

export class MockUserRepository implements IUserRepository {
  private static instance: MockUserRepository;

  private users: User[] = [
    User.create(
      '1',
      Name.create('John Doe'),
      Username.create('johndoe'),
      Email.create('test@test.com'),
      Password.create('hashed_password123')
    )
  ];

  public static getInstance(): MockUserRepository {
    if (!MockUserRepository.instance) {
      MockUserRepository.instance = new MockUserRepository();
    }
    return MockUserRepository.instance;
  }

  async save(user: User): Promise<void> {
    this.users.push(user);
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.users.find(user => user.email.value === email) || null;
  }

  async findById(id: string): Promise<User | null> {
    return this.users.find(user => user.id === id) || null;
  }

  async update(user: User): Promise<void> {
    const userIndex = this.users.findIndex(u => u.id === user.id);
    console.log('Updating user:', userIndex, user);
    if (userIndex !== -1) {
      this.users[userIndex] = user;
    }
  }

  async delete(id: string): Promise<void> {
    this.users = this.users.filter(user => user.id !== id);
  }

  public static reset() {
    this.getInstance().users = [];
  }

  async signUpUser(user: User): Promise<User> {
    await this.save(user);
    return user;
  }

  async signInUser(data: { email: string; password: string; }): Promise<User> {
    const user = await this.findByEmail(data.email);
    if (!user) {
      throw new Error('User not found');
    }
    return user;
  }

  async signOut(): Promise<void> {
    // Do nothing
  }
}