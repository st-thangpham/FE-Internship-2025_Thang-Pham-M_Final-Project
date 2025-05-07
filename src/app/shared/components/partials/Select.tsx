import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface SelectProps {
  name: string;
  label?: string;
  errorMsg?: string;
  options: { label: string; value: string }[];
  register?: UseFormRegisterReturn;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  errorMsg,
  options,
  register,
}) => {
  const isShowError = !!errorMsg;

  return (
    <div className="form-group">
      <div className="input-group">
        <select
          id={name}
          className={`form-control ${isShowError ? 'is-invalid' : ''}`}
          {...register}
        >
          <option value="">Select {label?.toLowerCase()}</option>
          {options.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
        {label && (
          <label className="form-label" htmlFor={name}>
            {label}
          </label>
        )}
      </div>
      {isShowError && <span className="msg-error">{errorMsg}</span>}
    </div>
  );
};
