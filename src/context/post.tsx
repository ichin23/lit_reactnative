import React, { createContext, useState, ReactNode, useContext } from 'react';
import { Post } from '../core/domain/entities/Post';
import { makePostUseCases } from '../core/factories/makePostUseCases';

const { findFeedClusters } = makePostUseCases();

interface PostContextData {
    postClusters: Post[][];
    fetchPosts: () => Promise<void>;
}

export const PostContext = createContext<PostContextData>({} as PostContextData);

export const PostProvider = ({ children }: { children: ReactNode }) => {
    const [postClusters, setPostClusters] = useState<Post[][]>([]);

    const fetchPosts = async () => {
        const fetchedClusters = await findFeedClusters.execute();
        setPostClusters(fetchedClusters);
    };

    return (
        <PostContext.Provider value={{ postClusters, fetchPosts }}>
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
