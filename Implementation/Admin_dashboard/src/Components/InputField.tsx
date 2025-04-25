import React from "react";

interface InputFieldProps {
  label?: string;
  name?: string;
  type?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  error?: boolean
}

function InputField({
  label,
  name,
  type = "text",
  value,
  onChange,
  placeholder,
  error = true
}: InputFieldProps) {
  return (
    <div className="flex flex-col gap-1 w-full">
      {label && (
        <label htmlFor={name} className="text-[#658F8D] text-lg font-medium">
          {error && "!"} {label}
        </label>
      )}
      <input
        id={name}
        name={name}
        type={type}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`w-full h-[48px] p-3 border border-[#C3B295] rounded-lg text-[#658F8D] text-base ${error ? "border-2 border-red-600" : "border border-[#C3B295]"} bg-[#F7F7F7] placeholder-[#658F8D] focus:outline-[#C3B295] disabled:opacity-60 disabled:cursor-not-allowed`}
      />
    </div>
  );
}

export default InputField;
