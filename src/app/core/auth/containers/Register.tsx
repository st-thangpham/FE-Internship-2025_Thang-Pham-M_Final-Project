import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

import { zodResolver } from '@hookform/resolvers/zod';
import { Controller, useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { z } from 'zod';

import { isValidDDMMYYYY } from '@app/core/helpers/date-format.helper';
import { registerAccount } from '@app/core/services/auth.service';
import { Button, Input, Select } from '@app/shared/components/partials';

const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),

  password: z
    .string()
    .min(6, 'Password must be at least 6 characters')
    .max(20, 'Password must not exceed 20 characters'),

  firstName: z
    .string()
    .nonempty('First name is required')
    .min(2, 'First name must be at least 2 characters'),

  lastName: z
    .string()
    .nonempty('Last name is required')
    .min(2, 'Last name must be at least 2 characters'),

  gender: z.enum(['male', 'female'], {
    errorMap: () => ({ message: 'Gender is required' }),
  }),

  dob: z
    .string()
    .nonempty('Date of birth is required')
    .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
      message: 'Date must be in dd/mm/yyyy format',
    })
    .refine(isValidDDMMYYYY, {
      message: 'Invalid date',
    }),

  phone: z
    .string()
    .nonempty('Phone number is required')
    .regex(/^\d{10}$/, 'Phone number must be 10 digits'),

  displayName: z
    .string()
    .nonempty('Display name is required')
    .min(3, 'Display name must be at least 3 characters'),
});

type RegisterFormData = z.infer<typeof schema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    console.log('Form Data:', data);
    try {
      setIsLoading(true);
      await registerAccount({
        email: data.email!,
        password: data.password!,
        firstName: data.firstName!,
        lastName: data.lastName!,
        gender: data.gender!,
        dob: data.dob!,
        phone: data.phone!,
        displayName: data.displayName!,
      });
      toast.success('Register successful!');
      setTimeout(() => {
        navigate('/auth/login');
      }, 500);
    } catch (error) {
      toast.error(error?.response?.data?.errors[0] || 'Registration failed!');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <>
      <div className="page-heading">
        <h1 className="page-title">Register</h1>
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

          {/* Row for First Name & Last Name */}
          <div className="row">
            <div className="col-6">
              <Input
                type="text"
                name="firstName"
                label="First Name"
                register={register('firstName')}
                errorMsg={errors.firstName?.message}
              />
            </div>
            <div className="col-6">
              <Input
                type="text"
                name="lastName"
                label="Last Name"
                register={register('lastName')}
                errorMsg={errors.lastName?.message}
              />
            </div>
          </div>

          {/* Row for Gender & Date of Birth */}
          <div className="row">
            <div className="col-6">
              <Controller
                control={control}
                name="gender"
                render={({ field }) => (
                  <Select
                    name="gender"
                    label="Gender"
                    value={field.value}
                    onChange={field.onChange}
                    onBlur={field.onBlur}
                    errorMsg={errors.gender?.message}
                    options={[
                      { label: 'Male', value: 'male' },
                      { label: 'Female', value: 'female' },
                    ]}
                  />
                )}
              />
            </div>
            <div className="col-6">
              <Controller
                control={control}
                name="dob"
                render={({ field }) => (
                  <Input
                    type="text"
                    name="dob"
                    label="Date of Birth"
                    placeHolder="dd/mm/yyyy"
                    value={field.value}
                    onInputChange={field.onChange}
                    onInputBlur={field.onBlur}
                    errorMsg={errors.dob?.message}
                  />
                )}
              />
            </div>
          </div>

          <Input
            type="text"
            name="phone"
            label="Phone Number"
            register={register('phone')}
            errorMsg={errors.phone?.message}
          />
          <Input
            type="text"
            name="displayName"
            label="Display Name"
            register={register('displayName')}
            errorMsg={errors.displayName?.message}
          />

          <div className="form-group">
            <Button
              type="submit"
              className="btn btn-primary btn-block"
              isLoading={isLoading}
              isDisabled={isLoading || !isValid}
              title="Register"
            />
          </div>
        </form>

        <div className="tips txt-center">
          <p>
            Already have an account?
            <Link to="/auth/login" className="txt-link ml-1">
              Log in
            </Link>
          </p>
        </div>
      </div>
    </>
  );
};

export default Register;
