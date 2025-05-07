import React from 'react';

interface TextInputProps {
  label?: string;
  name: string;
  placeholder?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  type?: string;
  required?: boolean;
  className?: string;
}

const TextInput: React.FC<TextInputProps> = ({
  label,
  name,
  placeholder,
  value,
  onChange,
  type = 'text',
  required = false,
  className = '',
}) => {
  const id = `input-${name}`;

  return (
    <div className={className}>
      {label && (
        <label
          htmlFor={id}
          className="block text-sm font-medium text-foreground mb-1"
        >
          {label}
          {required && <span className="text-red-500 ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        id={id}
        name={name}
        className="w-full px-3 py-2 text-sm bg-background text-foreground border border-border rounded-lg shadow-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:border-ring transition-colors"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
      />
    </div>
  );
};

export default TextInput;
