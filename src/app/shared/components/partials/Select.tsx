import React from 'react';
import ReactSelect from 'react-select';

interface OptionType {
  label: string;
  value: string;
}

interface SelectProps {
  name: string;
  label?: string;
  value?: string | string[];
  options: OptionType[];
  onChange?: (e: any) => void;
  onBlur?: () => void;
  isRequired?: boolean;
  isMulti?: boolean;
  errorMsg?: string;
}

export const Select: React.FC<SelectProps> = ({
  name,
  label,
  value,
  options,
  onChange,
  onBlur,
  isRequired = false,
  isMulti = false,
  errorMsg,
}) => {
  const isShowError = !!errorMsg;

  const selectedValue = isMulti
    ? options.filter((option) => (value as string[])?.includes(option.value))
    : options.find((option) => option.value === value);

  return (
    <div className="form-group">
      <div className="input-group">
        <ReactSelect
          inputId={name}
          options={options}
          isMulti={isMulti}
          value={selectedValue}
          onChange={(selected) => {
            if (isMulti) {
              onChange?.({
                target: {
                  name,
                  value: (selected as OptionType[]).map((opt) => opt.value),
                },
              });
            } else {
              onChange?.({
                target: {
                  name,
                  value: (selected as OptionType)?.value || '',
                },
              });
            }
          }}
          onBlur={onBlur}
          classNamePrefix="form-control"
        />
        {label && (
          <label htmlFor={name} className="form-label">
            {label} {isRequired && <span className="txt-danger">*</span>}
          </label>
        )}
      </div>
      {isShowError && <span className="msg-error">{errorMsg}</span>}
    </div>
  );
};
