import React, { useEffect, useContext } from 'react';
import ReactDOM from 'react-dom';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { format, parse } from 'date-fns';
import { toast } from 'react-toastify';

import {
  Input,
  CalendarInput,
  Select,
  Button,
} from '@app/shared/components/partials';
import { isValidDDMMYYYY } from '@app/core/helpers/date-format.helper';
import { User } from '@app/shared/models/user';
import { ImageService } from '@app/shared/services/image.service';
import { AuthService } from '@core/services/auth.service';
import { AuthContext } from '@shared/contexts/auth.context';

import defaultAvatar from '/imgs/avatar.jpg';

interface UpdateProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User;
}

const schema = z.object({
  picture: z.string().optional(),
  firstName: z.string().min(2, 'First name must be at least 2 characters'),
  lastName: z.string().min(2, 'Last name must be at least 2 characters'),
  gender: z.enum(['male', 'female']),
  dob: z
    .string()
    .refine((val) => /^\d{2}\/\d{2}\/\d{4}$/.test(val), {
      message: 'Date must be in dd/mm/yyyy format',
    })
    .refine(isValidDDMMYYYY, { message: 'Invalid date' }),
  phone: z.string().regex(/^\d{10}$/, 'Phone must be 10 digits'),
  displayName: z.string().min(3, 'Display name must be at least 3 characters'),
});

type UpdateProfileFormData = z.infer<typeof schema>;

const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  isOpen,
  onClose,
  user,
}) => {
  const {
    register,
    control,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isValid },
  } = useForm<UpdateProfileFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const { setUser } = useContext(AuthContext)!;
  const authService = new AuthService();

  useEffect(() => {
    if (user && isOpen) {
      reset({
        picture: user.picture || defaultAvatar,
        firstName: user.firstName,
        lastName: user.lastName,
        gender: user.gender as 'male' | 'female',
        dob: user.dob,
        phone: user.phone,
        displayName: user.displayName,
      });
    }
  }, [user, isOpen, reset]);

  const handleImageUpload = async (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = event.target.files?.[0];
    if (!file) return;

    try {
      const imageService = new ImageService();
      const { signedRequest, url: accessUrl } = await imageService.getSignedUrl(
        'avatar',
        file.name,
        file.type
      );
      await imageService.uploadToS3(signedRequest, file);
      setValue('picture', accessUrl, { shouldValidate: true });
    } catch (err) {
      console.error('Image upload failed', err);
    }
  };

  const onSubmit = async (data: UpdateProfileFormData) => {
    try {
      await authService.updateProfile(data);
      const updatedUser = await authService.getCurrentUser();
      setUser(updatedUser);
      toast.success('Update user profile successful!');
      onClose();
    } catch (err) {
      console.error('Update failed:', err);
      alert('Failed to update profile. Please try again.');
    }
  };

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (!isOpen) return null;

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal modal-form">
        <h2 className="modal-title">Update Profile</h2>
        <form className="form row" onSubmit={handleSubmit(onSubmit)}>
          <div className="col-12 col-wide-4">
            <div className="avatar-upload">
              <Controller
                control={control}
                name="picture"
                render={({ field }) => (
                  <div className="avatar-wrapper">
                    <img
                      src={field.value}
                      alt="Avatar"
                      className="avatar-preview"
                    />
                    <label
                      htmlFor="avatar-upload"
                      className="avatar-upload-label"
                    >
                      Edit
                    </label>
                    <input
                      id="avatar-upload"
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      className="avatar-input"
                    />
                  </div>
                )}
              />
            </div>
          </div>
          <div className="col-12 col-wide-8">
            <div className="row">
              <div className="col-6">
                <Input
                  label="First Name"
                  type="text"
                  name="firstName"
                  register={register('firstName')}
                  errorMsg={errors.firstName?.message}
                  isRequired
                />
              </div>
              <div className="col-6">
                <Input
                  label="Last Name"
                  type="text"
                  name="lastName"
                  register={register('lastName')}
                  errorMsg={errors.lastName?.message}
                  isRequired
                />
              </div>
            </div>
            <Input
              label="Display Name"
              type="text"
              name="displayName"
              register={register('displayName')}
              errorMsg={errors.displayName?.message}
              isRequired
            />
            <div className="row">
              <div className="col-6">
                <Controller
                  control={control}
                  name="gender"
                  render={({ field }) => (
                    <Select
                      label="Gender"
                      name="gender"
                      options={[
                        { label: 'Male', value: 'male' },
                        { label: 'Female', value: 'female' },
                      ]}
                      value={field.value}
                      onChange={field.onChange}
                      onBlur={field.onBlur}
                      errorMsg={errors.gender?.message}
                      isRequired
                    />
                  )}
                />
              </div>
              <div className="col-6">
                <Controller
                  control={control}
                  name="dob"
                  render={({ field }) => {
                    const parsedDate = field.value
                      ? parse(field.value, 'dd/MM/yyyy', new Date())
                      : null;
                    return (
                      <CalendarInput
                        label="Date of Birth"
                        name="dob"
                        value={parsedDate}
                        onChange={(date) =>
                          field.onChange(date ? format(date, 'dd/MM/yyyy') : '')
                        }
                        onBlur={field.onBlur}
                        errorMsg={errors.dob?.message}
                        isRequired
                      />
                    );
                  }}
                />
              </div>
            </div>
            <Input
              label="Phone"
              type="text"
              name="phone"
              register={register('phone')}
              errorMsg={errors.phone?.message}
              isRequired
            />
          </div>
          <div className="modal-actions col-12">
            <Button
              type="submit"
              title="Update"
              isDisabled={!isValid}
              className="btn modal-button btn-confirm"
            />
            <Button
              type="button"
              title="Cancel"
              onClick={onClose}
              className="btn modal-button btn-cancel"
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default UpdateProfileModal;
