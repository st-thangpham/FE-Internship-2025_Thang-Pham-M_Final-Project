import { apiService } from './api.service';

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

export const registerAccount = (data: RegisterPayload) => {
  return apiService.post('/users/register', data);
};
