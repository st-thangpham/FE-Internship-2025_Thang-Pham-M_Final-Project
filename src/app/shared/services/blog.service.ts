import { ApiService } from '@core/services/api.service';
import { Post, PostResponse } from '@shared/models/post';

const api = new ApiService();

export const getPublicPosts = (
  page: number,
  size: number,
  tags?: string
): Promise<PostResponse> => {
  const params: Record<string, any> = { page, size };
  if (tags) {
    params.tags = tags;
  }
  return api.get(['posts', 'public'], params);
};

export const createPost = (params = {}): Promise<PostResponse> => {
  return api.post(['posts'], params);
};

export const getPostById = (id: string): Promise<Post> => {
  return api.get(['posts', id]);
};
