import React, { useState } from 'react';
import { Link } from 'react-router-dom';

import { useForm, Controller } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button, Select } from '@app/shared/components/partials';
import { isValidDDMMYYYY } from '@app/core/helpers/date-format.helper';

const schema = z.object({
  email: z
    .string()
    .email('Invalid email address')
    .nonempty('Email is required'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
  firstName: z.string().nonempty('First name is required'),
  lastName: z.string().nonempty('Last name is required'),
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
  phone: z.string().nonempty('Phone number is required'),
  displayName: z.string().nonempty('Display name is required'),
});

type RegisterFormData = z.infer<typeof schema>;

const Register = () => {
  const [isLoading, setIsLoading] = useState(false);

  const {
    register,
    control,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<RegisterFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const onSubmit = (data: RegisterFormData) => {
    console.log('Submitted:', data);
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
              <Select
                name="gender"
                label="Gender"
                register={register('gender')}
                errorMsg={errors.gender?.message}
                options={[
                  { label: 'Male', value: 'male' },
                  { label: 'Female', value: 'female' },
                ]}
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
              isDisabled={isLoading}
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
