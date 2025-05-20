import React, { useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';

import { Button, Input } from '@app/shared/components/partials';
import { useAuth } from '@app/shared/hooks/useAuth';
import { login } from '@store/auth/auth.slice';

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
  const navigate = useNavigate();
  const location = useLocation();

  const { handleLogin, loading, error } = useAuth();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: LoginFormData) => {
    const resultAction = await handleLogin(data.email, data.password);
    if (login.fulfilled.match(resultAction)) {
      toast.success('Login successful!');
      navigate(location.state?.from?.pathname || '/', { replace: true });
    }
  };

  useEffect(() => {
    if (error) {
      toast.error(error);
    }
  }, [error]);

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
              isLoading={loading}
              isDisabled={loading || !isValid}
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
