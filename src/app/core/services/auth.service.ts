import { ApiService } from './api.service';
import { User } from '@app/shared/models/user';

interface RegisterPayload {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dob: string;
  phone: string;
  displayName: string;
}

interface LoginPayload {
  email: string;
  password: string;
}

interface LoginResponse {
  accessToken: string;
  userInfo: User;
}

const api = new ApiService();

export const registerAccount = (data: RegisterPayload) => {
  return api.post(['users', 'register'], data);
};

export const loginAccount = (data: LoginPayload): Promise<LoginResponse> => {
  return api.post(['users', 'login'], data);
};
