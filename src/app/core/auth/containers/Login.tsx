import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button, Input } from '@app/shared/components/partials';

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
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<LoginFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: LoginFormData) => {
    setIsLoading(true);
    console.log('Login form submitted:', data);
    setTimeout(() => {
      setIsLoading(false);
      navigate('/');
    }, 500);
  };

  return (
    <>
      <div className="page-heading">
        <h1 className="page-title">Login</h1>
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
              Register
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Login;
