import { createContext, ReactNode, useContext, useState } from "react";
import { User } from "../core/domain/entities/User";
import { makeUserUseCases } from "../core/factories/makeUserUseCases";

const userUseCases = makeUserUseCases();
export interface AuthContextData {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (user: {name:string, email: string, password: string}) => Promise<void>;
    logout: () => void;
    update: (user: {id:string, name:string, email:string}) => Promise<void>;
    deleteUser: (userId:string) => Promise<void>;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export interface IProvider {
  children: ReactNode
}

export const AuthProvider = ({ children }: IProvider) => {
    const [user, setUser] = useState<User | null>(null);

    const login = async (email: string, password: string) => {
        const user = await userUseCases.loginUser.execute({email, password})
        setUser(user);
    };

    const register = async (user: {name:string, email: string, password: string}) => {
        await userUseCases.registerUser.execute(user)
    };

    const logout = () => {
        userUseCases.logoutUser.execute({userId: user?.id!})
        setUser(null);
    };

    const update = async (user: {id:string, name:string, email:string})=>{
        let newUser = await userUseCases.updateUser.execute(user);
        setUser(newUser);
    }

    const deleteUser = async (userId:string)=>{
        await userUseCases.deleteUser.execute({id: userId});
        setUser(null);
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, update, deleteUser }}>
            {children}
        </AuthContext.Provider>
    );
};

export function useAuth() {
    const context = useContext(AuthContext);
    if (!context) {
        throw new Error("useAuth must be used within an AuthProvider");
    }
    return context;
}