import { Post } from './post';

export class User {
  picture: string;
  email: string;
  firstName: string;
  gender: string;
  id: number;
  image: string;
  lastName: string;
  displayName: string;
  dob: string;

  get fullName(): string {
    return `${this.firstName} ${this.lastName}`;
  }

  get avatar(): string {
    return this.image || this.picture || '/default-avatar.png';
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
