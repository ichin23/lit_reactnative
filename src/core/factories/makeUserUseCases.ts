import { IUserRepository } from "../domain/repositories/IUserRepository";
import { DeleteUser } from "../domain/use-cases/user/DeleteUser";
import { FindUserByEmail } from "../domain/use-cases/user/FindUserByEmail";
import { FindUserById } from "../domain/use-cases/user/FindUserById";
import { LoginUser } from "../domain/use-cases/user/LoginUser";
import { LogoutUser } from "../domain/use-cases/user/LogoutUser";
import { RegisterUser } from "../domain/use-cases/user/RegisterUser";
import { UpdateUser } from "../domain/use-cases/user/UpdateUser";
import { MockUserRepository } from "../infra/repositories/MockUserRepository";


export function makeUserUseCases(){
    const userRepository: IUserRepository = MockUserRepository.getInstance();
    
    const registerUser = new RegisterUser(userRepository);
    const loginUser = new LoginUser(userRepository);
    const updateUser = new UpdateUser(userRepository);
    const deleteUser = new DeleteUser(userRepository);
    const findUserById = new FindUserById(userRepository);
    const findUserByEmail = new FindUserByEmail(userRepository);
    const logoutUser = new LogoutUser();

    return {
        registerUser,
        loginUser,
        updateUser,
        deleteUser,
        findUserById,
        findUserByEmail,
        logoutUser
    }

}