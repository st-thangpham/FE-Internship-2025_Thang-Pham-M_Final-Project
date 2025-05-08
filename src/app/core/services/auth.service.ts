import { apiService } from './api.service';
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

export const registerAccount = (data: RegisterPayload) => {
  return apiService.post('/users/register', data);
};

export const loginAccount = (data: LoginPayload): Promise<LoginResponse> => {
  return apiService.post('/users/login', data);
};
