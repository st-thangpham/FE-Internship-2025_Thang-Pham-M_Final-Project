import React, { useEffect, useState } from 'react';
import ReactDOM from 'react-dom';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';

import { Input, Button } from '@app/shared/components/partials';
import { toast } from 'react-toastify';
import { AuthService } from '@app/core/services/auth.service';

interface ChangePasswordModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const schema = z
  .object({
    oldPassword: z.string().min(6, 'Password must be at least 6 characters'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters'),
    confirmNewPassword: z
      .string()
      .min(6, 'Password must be at least 6 characters'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    path: ['confirmNewPassword'],
    message: 'Passwords do not match',
  });

type ChangePasswordFormData = z.infer<typeof schema>;

const ChangePasswordModal: React.FC<ChangePasswordModalProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    register,
    handleSubmit,
    reset,
    watch,
    formState: { errors, isValid },
    trigger,
  } = useForm<ChangePasswordFormData>({
    mode: 'onChange',
    resolver: zodResolver(schema),
  });

  const [isLoading, setIsLoading] = useState(false);

  const authService = new AuthService();

  useEffect(() => {
    const subscription = watch((value, { name }) => {
      const confirmValue = value.confirmNewPassword;
      if (name === 'newPassword' && confirmValue?.length > 0) {
        trigger('confirmNewPassword');
      }
    });
    return () => subscription.unsubscribe();
  }, [watch, trigger]);

  useEffect(() => {
    if (isOpen) {
      reset();
    }
  }, [isOpen, reset]);

  useEffect(() => {
    document.body.classList.toggle('overflow-hidden', isOpen);
    return () => document.body.classList.remove('overflow-hidden');
  }, [isOpen]);

  if (!isOpen) return null;

  const onSubmit = async (data: ChangePasswordFormData) => {
    try {
      setIsLoading(true);
      await authService.changePassword({
        oldPassword: data.oldPassword,
        newPassword: data.newPassword,
      });
      toast.success('Password updated successfully!');
      onClose();
    } catch (error: any) {
      if (error?.response?.status === 401) {
        toast.error(
          error?.response?.data?.errors?.[0] ||
            'Failed to change password. Please try again.'
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  return ReactDOM.createPortal(
    <div className="modal-overlay">
      <div className="modal modal-form">
        <h2 className="modal-title">Change Password</h2>
        <form
          className="form form-password row"
          onSubmit={handleSubmit(onSubmit)}
        >
          <div className="col-12">
            <Input
              label="Old Password"
              type="password"
              name="oldPassword"
              register={register('oldPassword')}
              errorMsg={errors.oldPassword?.message}
              isRequired
            />
            <Input
              label="New Password"
              type="password"
              name="newPassword"
              register={register('newPassword')}
              errorMsg={errors.newPassword?.message}
              isRequired
            />
            <Input
              label="Confirm New Password"
              type="password"
              name="confirmNewPassword"
              register={register('confirmNewPassword')}
              errorMsg={errors.confirmNewPassword?.message}
              isRequired
            />
          </div>
          <div className="modal-actions col-12">
            <Button
              type="submit"
              title="Change"
              isDisabled={!isValid || isLoading}
              className="btn modal-button btn-confirm"
            />
            <Button
              type="button"
              title="Cancel"
              onClick={onClose}
              isDisabled={isLoading}
              className="btn modal-button btn-cancel"
            />
          </div>
        </form>
      </div>
    </div>,
    document.body
  );
};

export default ChangePasswordModal;
