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

  async getPublicPosts(
    page: number,
    size: number,
    tags?: string
  ): Promise<PostResponse> {
    const params: Record<string, any> = { page, size };
    if (tags) {
      params.tags = tags;
    }

    const res = await this.http.get(
      [ENDPOINT.blogs.blogsList, 'public'],
      params
    );
    return new PostResponse(res);
  }

  async createPost(data: PostPayload): Promise<Post> {
    const res = await this.http.post([ENDPOINT.blogs.blogsList], data);
    return new Post(res);
  }

  async deletePost(id: string): Promise<Post> {
    const res = await this.http.delete([ENDPOINT.blogs.blogsList, id]);
    return new Post(res);
  }

  async getPostById(id: string): Promise<Post> {
    const res = await this.http.get([ENDPOINT.blogs.blogsList, id]);
    return new Post(res);
  }

  async updatePostById(id: string, data: PostPayload): Promise<Post> {
    const res = await this.http.put([ENDPOINT.blogs.blogsList, id], data);
    return new Post(res);
  }

  async getUserWithPosts(userId: string | number): Promise<UserWithPosts> {
    const res = await this.http.get([
      ENDPOINT.auth.index,
      String(userId),
      'posts',
    ]);
    return new UserWithPosts(res);
  }
}
