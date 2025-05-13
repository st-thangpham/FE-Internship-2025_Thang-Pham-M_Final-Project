import { ApiService } from '@core/services/api.service';
import { PostResponse } from '@shared/models/post';

const api = new ApiService();

export const getPublicPosts = (page, size): Promise<PostResponse> => {
  return api.get(['posts', 'public'], { page, size });
};

export const createPost = (params = {}): Promise<PostResponse> => {
  return api.post(['posts'], params);
};
