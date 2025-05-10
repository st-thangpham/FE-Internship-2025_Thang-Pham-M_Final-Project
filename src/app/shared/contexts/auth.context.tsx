import React, { createContext, useState, useEffect, ReactNode } from 'react';
import { User } from '../models/user';
import { AuthStorageService } from '@core/services/auth-storage.service';

const authStorage = new AuthStorageService();

export interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  setUserSession: (user: User, token: string) => void;
  clearUserSession: () => void;
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

  useEffect(() => {
    const token = authStorage.getToken();
    const storedUser = authStorage.getUserInfo();

    if (token && storedUser) {
      setIsAuthenticated(true);
      setUser(storedUser);
    }
  }, []);

  const setUserSession = (user: User, token: string) => {
    setUser(user);
    setIsAuthenticated(true);
    authStorage.setToken(token);
    authStorage.setUserInfo(user);
  };

  const clearUserSession = () => {
    setUser(null);
    setIsAuthenticated(false);
    authStorage.removeToken();
    authStorage.removeUserInfo();
  };

  return (
    <AuthContext.Provider
      value={{ user, isAuthenticated, setUserSession, clearUserSession }}
    >
      {children}
    </AuthContext.Provider>
  );
};
