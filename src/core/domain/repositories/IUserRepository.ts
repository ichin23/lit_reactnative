import { User } from "../entities/User";
import { Email } from "../value-objects/Email";
import { Password } from "../value-objects/Password";

export interface IUserRepository {
    save(user: User): Promise<void>;
    findByEmail(email: string): Promise<User | null>;
    findById(id: string): Promise<User | null>;
    update(user: User): Promise<void>;
    delete(id: string): Promise<void>;
    signUpUser(user: User): Promise<User>;
    signInUser(data: { email: string, password: string }): Promise<User>
    signOut(): Promise<void>
    searchByUsername(query: string): Promise<User[]>
}