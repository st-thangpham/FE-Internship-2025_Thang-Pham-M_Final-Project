import React, { useState } from 'react';
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
  maxSelect?: number;
  isDisabled?: boolean;
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
  maxSelect,
  isDisabled = false,
}) => {
  const [warning, setWarning] = useState('');

  const isShowError = !!errorMsg;

  const selectedValue = isMulti
    ? options.filter((option) => (value as string[])?.includes(option.value))
    : options.find((option) => option.value === value);

  const handleChange = (selected: any) => {
    if (isMulti) {
      const selectedArray = (selected as OptionType[]) || [];
      if (maxSelect && selectedArray.length > maxSelect) {
        setWarning(`You can only select up to ${maxSelect} options.`);
        return;
      }
      setWarning('');
      onChange?.({
        target: {
          name,
          value: selectedArray.map((opt) => opt.value),
        },
      });
    } else {
      setWarning('');
      onChange?.({
        target: {
          name,
          value: (selected as OptionType)?.value || '',
        },
      });
    }
  };

  return (
    <div className="form-group">
      <div className="input-group">
        <ReactSelect
          inputId={name}
          options={options}
          isMulti={isMulti}
          value={selectedValue}
          onChange={handleChange}
          onBlur={onBlur}
          isDisabled={isDisabled}
          className="form-control"
          classNamePrefix="form-control"
        />
        {label && (
          <label htmlFor={name} className="form-label">
            {label} {isRequired && <span className="txt-danger">*</span>}
          </label>
        )}
      </div>
      {isShowError && <span className="msg-error">{errorMsg}</span>}
      {warning && <span className="msg-error">{warning}</span>}
    </div>
  );
};
