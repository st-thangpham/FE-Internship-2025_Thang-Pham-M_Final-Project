import { User } from './user';

export class Post {
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
  user?: User;

  constructor(data: Partial<Post>) {
    this.id = data.id ?? 0;
    this.title = data.title ?? '';
    this.description = data.description ?? '';
    this.content = data.content ?? '';
    this.status = data.status ?? 'public';
    this.tags = data.tags ?? [];
    this.userId = data.userId ?? 0;
    this.likes = data.likes ?? 0;
    this.comments = data.comments ?? 0;
    this.cover = data.cover ?? '';
    this.recommend = data.recommend ?? false;
    this.deletedAt = data.deletedAt ?? null;
    this.createdAt = data.createdAt ?? '';
    this.updatedAt = data.updatedAt ?? '';
    this.user = data.user ? new User(data.user) : undefined;
  }
}

export class PostResponse {
  data: Post[];
  totalPage: number;
  totalItems: number;
  itemsPerPage: number;
  currentPage: number;
  loadMore: boolean;

  constructor(res: Partial<PostResponse>) {
    this.data = res.data?.map((p) => new Post(p)) ?? [];
    this.totalPage = res.totalPage ?? 0;
    this.totalItems = res.totalItems ?? 0;
    this.itemsPerPage = res.itemsPerPage ?? 0;
    this.currentPage = res.currentPage ?? 1;
    this.loadMore = res.loadMore ?? false;
  }
}
