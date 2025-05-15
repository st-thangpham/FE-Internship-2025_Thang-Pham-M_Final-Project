import React, { useContext, useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { AuthService } from '@app/core/services/auth.service';
import { Button, Input } from '@app/shared/components/partials';
import { AuthContext } from '@app/shared/contexts/auth.context';

const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),
});

type LoginFormData = z.infer<typeof schema>;

const Login = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { setUserSession } = useContext(AuthContext);
  const authService = new AuthService();
  const navigate = useNavigate();
  const location = useLocation();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsLoading(true);
      const res = await authService.signIn({
        email: data.email,
        password: data.password,
      });

      const { accessToken, userInfo } = res;

      if (!accessToken || !userInfo) {
        throw new Error('Invalid login response');
      }

      setUserSession(userInfo, accessToken);
      toast.success('Login successful!');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    } catch (error: any) {
      toast.error(
        error?.response?.data?.errors[0] || 'Invalid email or password.'
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h1 className="page-title">Sign In</h1>
      </div>
      <div className="page-content">
        <form className="form" onSubmit={handleSubmit(onSubmit)}>
          <Input
            type="text"
            name="email"
            label="Email"
            register={register('email')}
            errorMsg={errors.email?.message}
          />
          <Input
            type="password"
            name="password"
            label="Password"
            register={register('password')}
            errorMsg={errors.password?.message}
          />
          <div className="form-group">
            <Button
              type="submit"
              className="btn btn-primary btn-block"
              isLoading={isLoading}
              isDisabled={isLoading || !isValid}
              title="Login"
            />
          </div>
        </form>

        <div className="tips txt-center">
          <p>
            Don't have an account?
            <Link to="/auth/register" className="txt-link ml-1">
              Sign Up
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
