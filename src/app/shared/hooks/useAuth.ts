// src/app/shared/hooks/useAuth.ts
import { useAppDispatch, useAppSelector } from '@store/hooks';
import { login, logout, register } from '@store/auth/auth.slice';

export const useAuth = () => {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleLogin = async (email: string, password: string) => {
    return dispatch(login({ email, password }));
  };

  const handleRegister = async (data: any) => {
    return dispatch(register(data));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  return {
    ...auth,
    handleLogin,
    handleRegister,
    handleLogout,
  };
};
