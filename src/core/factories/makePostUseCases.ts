import { FindPostById } from "../domain/use-cases/post/FindPostById";
import { IPostRepository } from "../domain/repositories/IPostRepository";
import { CreatePost } from "../domain/use-cases/post/CreatePost";
import { DeletePost } from "../domain/use-cases/post/DeletePost";
import { FindClusteredPostByGeoLocation } from "../domain/use-cases/post/FindClusteredPostByGeoLocation";
import { FindPostByGeoLocation } from "../domain/use-cases/post/FindPostByGeolocation";
import { FindPostByUserId } from "../domain/use-cases/post/FindPostByUserId";
import { FindPosts } from "../domain/use-cases/post/FindPosts";
import { UpdatePost } from "../domain/use-cases/post/UpdatePost";
import { MockPostRepository } from "../infra/repositories/MockPostRepository";
import { HybridPostRepository } from "../infra/repositories/HybridPostRepository";
import { AddPartiu } from "../domain/use-cases/post/AddPartiu";
import { FindFeedClusters } from "../domain/use-cases/post/FindFeedClusters";
import { GetFriendsFeed } from "../domain/use-cases/post/GetFriendsFeed";

export function makePostUseCases() {
    const postRepository: IPostRepository = HybridPostRepository.getInstance();

    const createPost = new CreatePost(postRepository);
    const updatePost = new UpdatePost(postRepository);
    const deletePost = new DeletePost(postRepository);
    const findPosts = new FindPosts(postRepository);
    const findPostByUserId = new FindPostByUserId(postRepository);
    const findPostByGeoLocation = new FindPostByGeoLocation(postRepository);
    const findClusteredPostByGeoLocation = new FindClusteredPostByGeoLocation(postRepository);
    const findPostById = new FindPostById(postRepository);
    const addPartiu = new AddPartiu(postRepository);
    const findFeedClusters = new FindFeedClusters(postRepository);
    const getFriendsFeed = new GetFriendsFeed(postRepository);

    return {
        createPost,
        updatePost,
        deletePost,
        findPosts,
        findPostByUserId,
        findPostByGeoLocation,
        findClusteredPostByGeoLocation,
        findPostById,
        addPartiu,
        findFeedClusters,
        getFriendsFeed
    }

}