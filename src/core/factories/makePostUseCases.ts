import { IPostRepository } from "../domain/repositories/IPostRepository";
import { CreatePost } from "../domain/use-cases/post/CreatePost";
import { DeletePost } from "../domain/use-cases/post/DeletePost";
import { FindPostByGeoLocation } from "../domain/use-cases/post/FindPostByGeolocation";
import { FindPostByUserId } from "../domain/use-cases/post/FindPostByUserId";
import { FindPosts } from "../domain/use-cases/post/FindPosts";
import { UpdatePost } from "../domain/use-cases/post/UpdatePost";
import { MockPostRepository } from "../infra/repositories/MockPostRepository";


export function makePostUseCases(){
    const postRepository: IPostRepository = MockPostRepository.getInstance();
    
    const createPost = new CreatePost(postRepository);
    const updatePost = new UpdatePost(postRepository);
    const deletePost = new DeletePost(postRepository);
    const findPosts = new FindPosts(postRepository);
    const findPostByUserId = new FindPostByUserId(postRepository);
    const findPostByGeoLocation = new FindPostByGeoLocation(postRepository);

    return {
        createPost,
        updatePost,
        deletePost,
        findPosts,
        findPostByUserId,
        findPostByGeoLocation
    }
    
}