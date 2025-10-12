import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Post } from '../core/domain/entities/Post';
import { makePostUseCases } from '../core/factories/makePostUseCases';

const { findPosts } = makePostUseCases();

interface PostContextData {
    posts: Post[];
    fetchPosts: () => Promise<void>;
}

export const PostContext = createContext<PostContextData>({} as PostContextData);

export const PostProvider = ({ children }: { children: ReactNode }) => {
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        const fetchedPosts = await findPosts.execute();
        setPosts(fetchedPosts)
        console.log(posts);
    };

    return (
        <PostContext.Provider value={{ posts, fetchPosts }}>
            {children}
        </PostContext.Provider>
    );
};

export function usePost() {
    const context = useContext(PostContext);
    if (!context) {
        throw new Error("usePost must be used within a PostProvider");
    }
    return context;
}
