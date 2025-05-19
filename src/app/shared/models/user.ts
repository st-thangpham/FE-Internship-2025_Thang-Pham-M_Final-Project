import { Post } from './post';

import defaultAvatar from '/imgs/avatar.jpg';

export class User {
  picture: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  phone: string;
  lastName: string;
  displayName: string;
  dob: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get avatar(): string {
    return this.picture || defaultAvatar;
  }

  get isMale(): boolean {
    return this.gender?.toLowerCase() === 'male';
  }

  constructor(data: Partial<User>) {
    Object.assign(this, data);
  }
}

export class UserWithPosts extends User {
  Posts: Post[];

  constructor(data: Partial<UserWithPosts>) {
    super(data);
    this.Posts = data.Posts || [];
  }
}
