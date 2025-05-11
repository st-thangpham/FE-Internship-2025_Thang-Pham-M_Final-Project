import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface CalendarInputProps {
  label?: string;
  name: string;
  value: Date | null;
  onChange: (date: Date | null) => void;
  onBlur?: () => void;
  errorMsg?: string;
  isRequired?: boolean;
  placeHolder?: string;
}

export const CalendarInput: React.FC<CalendarInputProps> = ({
  label,
  name,
  value,
  onChange,
  onBlur,
  errorMsg,
  isRequired = false,
  placeHolder,
}) => {
  const [isFocused, setIsFocused] = useState(false);

  const isShowError = !!errorMsg;

  const CustomInput = React.forwardRef<HTMLInputElement, any>(
    ({ value, onClick, onChange, onBlur, onFocus }, ref) => (
      <div className="form-control-wrapper">
        <input
          ref={ref}
          onClick={onClick}
          onChange={onChange}
          onBlur={onBlur}
          onFocus={onFocus}
          value={value || ''}
          name={name}
          placeholder={placeHolder || label}
          className={`form-control form-select ${
            isShowError ? 'is-invalid' : ''
          }`}
          readOnly
        />
        {label && (
          <label htmlFor={name} className="form-label">
            {label}
            {isRequired && <span className="txt-danger">*</span>}
          </label>
        )}
      </div>
    )
  );

  CustomInput.displayName = 'CustomInput';

  return (
    <div className="form-group">
      <div className={`input-group ${value || isFocused ? 'is-filled' : ''}`}>
        <DatePicker
          selected={value}
          onChange={onChange}
          onBlur={() => {
            setIsFocused(false);
            onBlur?.();
          }}
          onFocus={() => setIsFocused(true)}
          dateFormat="dd/MM/yyyy"
          maxDate={new Date()}
          showMonthDropdown
          showYearDropdown
          dropdownMode="select"
          customInput={<CustomInput />}
        />
      </div>
      {isShowError && <span className="msg-error">{errorMsg}</span>}
    </div>
  );
};
