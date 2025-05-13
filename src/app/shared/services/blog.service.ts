import { ApiService } from '@core/services/api.service';
import { Post, PostResponse } from '@shared/models/post';

const api = new ApiService();

export const getPublicPosts = (page, size): Promise<PostResponse> => {
  return api.get(['posts', 'public'], { page, size });
};

export const createPost = (params = {}): Promise<PostResponse> => {
  return api.post(['posts'], params);
};

export const getPostById = (id: string): Promise<Post> => {
  return api.get(['posts', id]);
};
