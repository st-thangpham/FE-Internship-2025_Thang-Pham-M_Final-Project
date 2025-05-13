export interface AuthStorage {
  setToken(data?: string): void;
  getToken(): void;
  removeToken(): void;
}

export class AuthStorageService implements AuthStorage {
  ACCESS_TOKEN = 'token';
  USER_INFO = 'userInfo';

  setToken(token?: string) {
    if (token) {
      localStorage.setItem(this.ACCESS_TOKEN, token);
    }
  }

  getToken() {
    return localStorage.getItem(this.ACCESS_TOKEN);
  }

  removeToken() {
    localStorage.removeItem(this.ACCESS_TOKEN);
  }

  setUserInfo(user: any) {
    localStorage.setItem(this.USER_INFO, JSON.stringify(user));
  }

  getUserInfo() {
    const user = localStorage.getItem(this.USER_INFO);
    return user ? JSON.parse(user) : null;
  }

  removeUserInfo() {
    localStorage.removeItem(this.USER_INFO);
  }
}
