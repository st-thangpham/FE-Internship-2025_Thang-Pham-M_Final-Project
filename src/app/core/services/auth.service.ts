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

  signOut() {
    this.removeToken();
  }
}
