import { ApiService } from '@core/services/api.service';
import { Post, PostResponse } from '@shared/models/post';
import { UserWithPosts } from '../models/user';
import { ENDPOINT } from '@config/endpoint';

export interface UpdatePostPayload {
  title: string;
  content: string;
  status: string;
}

export interface PostPayload extends Partial<Post> {}

export class PostService {
  private http = new ApiService();

  constructor() {}

  getPublicPosts(
    page: number,
    size: number,
    tags?: string
  ): Promise<PostResponse> {
    const params: Record<string, any> = { page, size };
    if (tags) {
      params.tags = tags;
    }
    return this.http.get([ENDPOINT.blogs.blogsList, 'public'], params);
  }

  createPost(data: PostPayload): Promise<PostResponse> {
    return this.http.post([ENDPOINT.blogs.blogsList], data);
  }

  deletePost(id: string): Promise<Post> {
    return this.http.delete([ENDPOINT.blogs.blogsList, id]) as Promise<Post>;
  }

  getPostById(id: string): Promise<Post> {
    return this.http.get([ENDPOINT.blogs.blogsList, id]);
  }

  updatePostById(id: string, data: PostPayload): Promise<Post> {
    return this.http.put([ENDPOINT.blogs.blogsList, id], data);
  }

  getUserWithPosts(userId: string | number): Promise<UserWithPosts> {
    return this.http.get([ENDPOINT.auth.index, String(userId), 'posts']);
  }
}
