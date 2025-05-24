import AuthHelper from '../helpers/auth.helper';
import { ENDPOINT } from '@config/endpoint';
import { ApiService } from './api.service';
import { User } from '@app/shared/models/user';

type RegisterPayload = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  gender: 'male' | 'female';
  dob: string;
  phone: string;
  displayName: string;
};

type LoginPayload = {
  email: string;
  password: string;
};

type LoginResponse = {
  accessToken: string;
  userInfo: User;
};

type ChangePasswordPayload = {
  oldPassword: string;
  newPassword: string;
};

export class AuthService extends AuthHelper {
  private http = new ApiService();

  constructor() {
    super();
  }

  async register(body: RegisterPayload): Promise<void> {
    await this.http.post([ENDPOINT.auth.register], body);
  }

  async signIn(body: LoginPayload): Promise<LoginResponse> {
    const response = await this.http.post<LoginResponse>(
      [ENDPOINT.auth.login],
      body
    );
    return response;
  }

  async getCurrentUser(): Promise<User> {
    return await this.http.get<User>([ENDPOINT.auth.userInfo]);
  }

  async updateProfile(body: Partial<User>): Promise<User> {
    return await this.http.put<User>([ENDPOINT.auth.userInfo], body);
  }

  async changePassword(body: ChangePasswordPayload): Promise<void> {
    const res = await this.http.put([ENDPOINT.auth.changePassword], body);
  }

  signOut() {
    this.removeToken();
  }
}
