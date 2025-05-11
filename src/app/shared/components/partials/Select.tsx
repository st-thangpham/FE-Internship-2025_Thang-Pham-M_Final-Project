import React from 'react';
import { UseFormRegisterReturn } from 'react-hook-form';

interface SelectProps {
  name: string;
  label?: string;
  errorMsg?: string;
  options: { label: string; value: string }[];
  register?: UseFormRegisterReturn;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  onBlur?: () => void;
  isRequired?: boolean;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  errorMsg,
  options,
  register,
  value,
  onChange,
  onBlur,
  isRequired = false,
}) => {
  const isShowError = !!errorMsg;

  return (
    <div className="form-group">
      <div className="input-group">
        <select
          id={name}
          name={name}
          className={`form-control form-select ${
            isShowError ? 'is-invalid' : ''
          }`}
          value={value}
          onChange={onChange}
          onBlur={onBlur}
          {...register}
        >
          {options.map(({ value, label }) => (
            <option value={value} key={value}>
              {label}
            </option>
          ))}
        </select>
        {label && (
          <label className="form-label" htmlFor={name}>
            {label}
            {isRequired && <span className="txt-danger">*</span>}
          </label>
        )}
      </div>
      {isShowError && <span className="msg-error">{errorMsg}</span>}
    </div>
  );
};
