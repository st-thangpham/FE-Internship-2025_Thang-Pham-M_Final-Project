import { ApiService } from '@core/services/api.service';
import { PostResponse } from '@shared/models/post';

const api = new ApiService();

export const getPublicPosts = (size = 5): Promise<PostResponse> => {
  return api.get(['posts', 'public'], { size });
};

export const getPrivatePosts = (params = {}): Promise<PostResponse> => {
  return api.get(['posts'], params);
};
