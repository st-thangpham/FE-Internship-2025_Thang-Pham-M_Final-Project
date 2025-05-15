import { ApiService } from '@core/services/api.service';
import { Post, PostResponse } from '@shared/models/post';
import { UserWithPosts } from '../models/user';
import { ENDPOINT } from '@config/endpoint';

export class PostService {
  private http = new ApiService();

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

  createPost(params: Partial<Post> = {}): Promise<PostResponse> {
    return this.http.post([ENDPOINT.blogs.blogsList], params);
  }

  getPostById(id: string): Promise<Post> {
    return this.http.get([ENDPOINT.blogs.blogsList, id]);
  }

  getUserWithPosts(userId: string | number): Promise<UserWithPosts> {
    return this.http.get([ENDPOINT.auth.index, String(userId), 'posts']);
  }
}
