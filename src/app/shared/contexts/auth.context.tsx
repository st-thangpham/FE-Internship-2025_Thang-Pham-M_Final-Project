import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models/user';
import { AuthStorageService } from '@core/services/auth-storage.service';
import { AuthService } from '@core/services/auth.service';
import AuthHelper from '@app/core/helpers/auth.helper';

const authStorage = new AuthStorageService();
const authService = new AuthService();

export interface AuthContextType {
  user: User | null;
  // userId: Number;
  isAuthenticated: boolean;
  setUserSession: (token: string) => Promise<void>;
  clearUserSession: () => void;
  setUser: (user: User | null) => void;
}

export const AuthContext = createContext<AuthContextType | undefined>(
  undefined
);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Load user info on app reload if token exists
  useEffect(() => {
    const initializeUser = async () => {
      const token = authStorage.getToken();
      if (token) {
        try {
          const userInfo = await authService.getCurrentUser();
          const decoded = new AuthHelper().getUserInfo();
          const updatedUser = {
            ...userInfo,
            id: +decoded?.userId,
            fullName: `${userInfo.firstName} ${userInfo.lastName}`,
            avatar: userInfo.picture,
          };
          setUser(updatedUser);
          setIsAuthenticated(true);
        } catch (err) {
          authStorage.removeToken();
          setIsAuthenticated(false);
        }
      }
    };

    initializeUser();
  }, []);

  const setUserSession = async (token: string) => {
    authStorage.setToken(token);
    const userInfo = await authService.getCurrentUser();
    const decoded = new AuthHelper().getUserInfo();
    const updatedUser = {
      ...userInfo,
      id: +decoded?.userId,
      fullName: `${userInfo.firstName} ${userInfo.lastName}`,
      avatar: userInfo.picture,
    };
    setUser(updatedUser);
    setIsAuthenticated(true);
  };

  const clearUserSession = () => {
    setUser(null);
    setIsAuthenticated(false);
    authStorage.removeToken();
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        // userId,
        isAuthenticated,
        setUserSession,
        clearUserSession,
        setUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
