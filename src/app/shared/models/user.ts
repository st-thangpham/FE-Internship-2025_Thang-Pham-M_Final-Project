import { Post } from './post';
export interface User {
  picture: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  image: string;
  lastName: string;
  displayName: string;
  dob: string;
}
export interface UserWithPosts extends User {
  Posts: Post[];
}
