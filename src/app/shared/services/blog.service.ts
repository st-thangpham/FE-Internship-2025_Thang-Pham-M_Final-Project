import { ApiService } from '@core/services/api.service';
import { Post, PostResponse } from '@shared/models/post';

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

    return this.http.get(['posts', 'public'], params);
  }

  createPost(params: Partial<Post> = {}): Promise<PostResponse> {
    return this.http.post(['posts'], params);
  }

  getPostById(id: string): Promise<Post> {
    return this.http.get(['posts', id]);
  }
}
