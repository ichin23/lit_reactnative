import { createContext, ReactNode, useContext, useEffect, useState } from "react";
import { User } from "../core/domain/entities/User";
import { makeUserUseCases } from "../core/factories/makeUserUseCases";
import { supabase } from "../core/infra/supabase/client/supabaseClient";

const userUseCases = makeUserUseCases();

export interface AuthContextData {
    user: User | null;
    login: (email: string, pass: string) => Promise<void>;
    register: (user: { name: string, username: string, email: string, password: string }) => Promise<void>;
    logout: () => void;
    update: (user: { id: string, name: string, email: string, imgUrl?: string }) => Promise<void>;
    deleteUser: (userId: string) => Promise<void>;
    loading: boolean;
}

const AuthContext = createContext<AuthContextData | undefined>(undefined);

export interface IProvider {
    children: ReactNode
}

export const AuthProvider = ({ children }: IProvider) => {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);


    useEffect(() => {
        const loadSession = async () => {
            try {
                // Add timeout to prevent hanging on slow/no network (5 seconds)
                const sessionPromise = supabase.auth.getSession();
                const timeoutPromise = new Promise<any>((_, reject) =>
                    setTimeout(() => reject(new Error('Session check timeout')), 5000)
                );

                let session = null;

                try {
                    const result = await Promise.race([sessionPromise, timeoutPromise]);
                    session = result.data?.session;
                } catch (timeoutError) {
                    console.log('Session check timed out (possibly offline), checking AsyncStorage directly...');
                    // If timeout, try to get session from AsyncStorage directly
                    // Supabase stores it there, so we can access it even if the network is slow
                    try {
                        const result = await sessionPromise; // Give it one more chance
                        session = result.data?.session;
                    } catch {
                        console.log('Could not retrieve session - user will need to login');
                    }
                }

                if (session?.user) {
                    try {
                        // Try to fetch user profile from database (will use cache if offline)
                        const userProfile = await userUseCases.findUserById.execute({ id: session.user.id });
                        if (userProfile) {
                            setUser(userProfile);
                            console.log('Session restored for user:', userProfile.email.value);
                        } else {
                            console.log('User profile not found in cache or database');
                        }
                    } catch (profileError) {
                        console.error('Error fetching user profile:', profileError);
                        // If we can't get the profile, log the user out
                        console.log('Logging out due to profile fetch failure');
                        await supabase.auth.signOut();
                    }
                } else {
                    console.log('No active session found');
                }
            } catch (error) {
                console.error('Error loading session:', error);
            } finally {
                setLoading(false);
            }
        };

        loadSession();

        // Listen for auth state changes
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            console.log('Auth state changed:', event);

            if (event === 'SIGNED_IN' && session?.user) {
                try {
                    const userProfile = await userUseCases.findUserById.execute({ id: session.user.id });
                    if (userProfile) {
                        setUser(userProfile);
                    }
                } catch (error) {
                    console.error('Error fetching user profile on sign in:', error);
                }
            } else if (event === 'SIGNED_OUT') {
                setUser(null);
            } else if (event === 'TOKEN_REFRESHED') {
                console.log('Token refreshed successfully');
            }
        });

        return () => {
            subscription.unsubscribe();
        };
    }, []);

    const login = async (email: string, password: string) => {
        console.log("Login: ", email);
        const user = await userUseCases.loginUser.execute({ email, password });
        console.log("User logged in:", user.email.value);
        setUser(user);
        // No need to save to SQLite - Supabase handles session persistence
    };

    const register = async (user: { name: string, username: string, email: string, password: string }) => {
        await userUseCases.registerUser.execute(user);
    };

    const logout = async () => {
        if (user) {
            await userUseCases.logoutUser.execute({ userId: user.id });
            setUser(null);
            // Supabase auth.signOut() is called in the use case, which clears the session
        }
    };

    const update = async (user: { id: string, name: string, email: string, imgUrl?: string }) => {
        let newUser = await userUseCases.updateUser.execute(user);
        setUser(newUser);
        // No need to save to SQLite - user data is in Supabase database
    }

    const deleteUser = async (userId: string) => {
        await userUseCases.deleteUser.execute({ id: userId });
        setUser(null);
        // Supabase session will be cleared
    }

    return (
        <AuthContext.Provider value={{ user, login, register, logout, update, deleteUser, loading }}>
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