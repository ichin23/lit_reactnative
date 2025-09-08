import { createContext, ReactNode, useContext, useState } from "react";

export interface AuthContextData {
    isAuthenticated: boolean;
    login: (username: string, password: string) => Promise<void>;
    logout: () => void;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export interface IProvider {
  children: ReactNode
}

export const AuthProvider = ({ children }: IProvider) => {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    const login = async (username: string, password: string) => {
        // Perform login logic here
        setIsAuthenticated(true);
    };

    const logout = () => {
        // Perform logout logic here
        setIsAuthenticated(false);
    };

    return (
        <AuthContext.Provider value={{ isAuthenticated, login, logout }}>
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