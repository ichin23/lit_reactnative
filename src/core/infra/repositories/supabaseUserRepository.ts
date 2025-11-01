import { User } from "../../domain/entities/User";
import { IUserRepository } from "../../domain/repositories/IUserRepository";
import { Email } from "../../domain/value-objects/Email";
import { Name } from "../../domain/value-objects/Name";
import { Password } from "../../domain/value-objects/Password";
import { Username } from "../../domain/value-objects/Username";
import { supabase } from "../supabase/client/supabaseClient";

export class SupabaseUserRepository implements IUserRepository{
    private static instance: SupabaseUserRepository;

    private constructor() {}

    public static getInstance(): SupabaseUserRepository {
        if (!SupabaseUserRepository.instance) {
        SupabaseUserRepository.instance = new SupabaseUserRepository();
        }
        return SupabaseUserRepository.instance;
    }

    save(user: User): Promise<void> {
        throw new Error("Method not implemented.");
    }
    async findByEmail(email: string): Promise<User | null> {
        const { data: profileData, error: profileError } = await supabase
            .from('user')
            .select('*')
            .eq('email', email)
            .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
            throw new Error(profileError.message);
        }
        if (!profileData) {
            return null;
        }

        return User.create(
            profileData.id,
            Name.create(profileData.name),
            Username.create(profileData.username),
            Email.create(profileData.email),
            Password.create('hashed_123'), // Password is not stored in the entity
        );
    }
    async findById(id: string): Promise<User | null> {
        const { data: profileData, error: profileError } = await supabase
            .from('user')
            .select('*')
            .eq('id', id)
            .single();

        if (profileError && profileError.code !== 'PGRST116') { // PGRST116: "The result contains 0 rows"
            throw new Error(profileError.message);
        }
        if (!profileData) {
        return null;
        }

        return User.create(
            profileData.id,
            Name.create(profileData.name),
            Username.create(profileData.username),
            Email.create(profileData.email),
            Password.create('hashed_123'), // Password is not stored in the entity
        );
    }
    
    async update(user: User): Promise<void> {
        const { error } = await supabase
            .from('user')
            .update({
                name: user.name.value,
                username: user.username.value,
                email: user.email.value,
            })
            .eq('id', user.id);

        if (error) {
            throw new Error(error.message);
        }
        
        const { data: { user: authUser } } = await supabase.auth.getUser();
        if (authUser && authUser.email !== user.email.value) {
            const { error: authError } = await supabase.auth.updateUser({ email: user.email.value });
            if (authError) {
                throw new Error(`Profile updated, but failed to update auth email: ${authError.message}`);
            }
        }
    }

    async delete(id: string): Promise<void> {
        const { error } = await supabase.from('user').delete().eq('id', id);
        if (error) {
            throw new Error(error.message);
        }
        console.warn("User profile deleted, but the auth user was not. This requires an admin call.");
    }
    
    async signUpUser(user:User): Promise<User> {
        const {data:authData, error:authError} = await supabase.auth.signUp({
            email: user.email.value,
            password: user.password.value,
            options:{
                emailRedirectTo: "litapp://auth"
            }
        })
        if (authError) {
           throw new Error(authError.message);
        }
        if (!authData.user) {
            throw new Error('Could not create user');
        }

        const { error: profileError } = await supabase.from("user").insert({
            id: authData.user.id,
            name: user.name.value,
            username: user.username.value,
            email: user.email.value
        })

        if (profileError) {
            console.error("Failed to create user profile:", profileError.message);
            throw new Error('Failed to create user profile after authentication.');
        }
        
         return User.create(
            authData.user.id,
            user.name,
            user.username,
            user.email,
            Password.create('hashed_123'), // Password should not be held in the entity after registration    
        );
    }

    async signInUser(data: { email: string; password: string; }): Promise<User> {
        const { data: authData, error: authError } = await supabase.auth.signInWithPassword({
            email: data.email,
            password: data.password,
        });

        if (authError) {
            console.log(authError.code)
            console.log(authError.cause)
            console.log(authError.message)
            console.log(authError.stack)
            throw new Error(authError.message);
        }
        if (!authData.user) {
            throw new Error('User not found');
        }
        const user = await this.findById(authData.user.id);
        if (!user) {
            // This case means there's an auth user without a corresponding profile.
            throw new Error('User profile not found');
        }

        return user;
    }

    async signOut(): Promise<void> {
        const {error:authError} = await supabase.auth.signOut();

        if (authError) {
            throw new Error(authError.message);
        }
    }
}