import React, { JSX } from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { ACCESS_TOKEN_KEY } from '@app/core/constants/constant';

const isAuthenticated = (): boolean => {
  const token = localStorage.getItem(ACCESS_TOKEN_KEY);
  return !!token;
};

export const PrivateRoute = ({ children }: { children: JSX.Element }) => {
  const location = useLocation();

  return isAuthenticated() ? (
    children
  ) : (
    <Navigate to="/auth/login" replace state={{ from: location }} />
  );
};
