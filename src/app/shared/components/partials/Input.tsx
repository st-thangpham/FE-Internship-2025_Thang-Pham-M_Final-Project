import React, { forwardRef } from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface InputProps {
  type: string;
  name: string;
  label?: string;
  placeHolder?: string;
  className?: string;
  maxLength?: number;
  errorMsg?: string;
  minLength?: number;
  onInputBlur?: (value: string) => void;
  onInputChange?: (value: string) => void;
  isReadOnly?: boolean;
  hasApiErr?: boolean;
  isDisabled?: boolean;
  register?: UseFormRegisterReturn;
  value?: string;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      type,
      name,
      label,
      placeHolder,
      className = '',
      maxLength,
      errorMsg,
      onInputBlur,
      onInputChange,
      isReadOnly = false,
      hasApiErr = false,
      isDisabled = false,
      register,
      value,
    },
    ref
  ) => {
    const isShowError = !!errorMsg;

    const inputClassName = `form-control ${className} ${
      isShowError ? 'is-invalid' : ''
    }`;

    return (
      <div className="form-group">
        <div className="input-group">
          <input
            ref={ref}
            className={inputClassName}
            type={type}
            name={name}
            placeholder={label || placeHolder}
            maxLength={maxLength}
            onBlur={(e) => onInputBlur?.(e.target.value)}
            onChange={(e) => onInputChange?.(e.target.value)}
            readOnly={isReadOnly}
            disabled={isDisabled}
            value={value}
            {...register}
          />
          {label && (
            <label className="form-label" htmlFor={name}>
              {label}
            </label>
          )}
        </div>
        {isShowError && <span className="msg-error">{errorMsg}</span>}
      </div>
    );
  }
);
