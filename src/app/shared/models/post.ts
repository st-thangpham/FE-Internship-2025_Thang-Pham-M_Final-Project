import { User } from './user';

export interface Post {
  id: number;
  title: string;
  description: string;
  content: string;
  status: 'public' | 'private';
  tags: string[];
  userId: number;
  likes: number;
  comments: number;
  cover: string;
  recommend: boolean;
  deletedAt: string | null;
  createdAt: string;
  updatedAt: string;
  user: User;
}

export interface PostResponse {
  data: Post[];
  totalPage: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  loadMore: boolean;
}
