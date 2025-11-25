import { User } from "../../entities/User";
import { IUserRepository } from "../../repositories/IUserRepository";

export class SearchUsers {
    constructor(private userRepository: IUserRepository) { }

    async execute(query: string): Promise<User[]> {
        if (!query || query.trim().length === 0) {
            return [];
        }
        return await this.userRepository.searchByUsername(query);
    }
}
