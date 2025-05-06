import { IMentorSingupFormInputProps } from "@/src/types/mentorTypes";
export const FormInput = ({
  label,
  type,
  id,
  onChange,
  value,
  placeholder,
  required = false
}: IMentorSingupFormInputProps) => {
  return (
    <div className="mb-2">
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          type={type}
          id={id}
          name={id}
          onChange={onChange}
          value={value}
          placeholder={placeholder}
          className="block w-full rounded-lg border border-gray-300 p-2 text-sm focus:border-purple-500 focus:outline-none focus:ring-2 focus:ring-purple-100 transition-colors"
          required={required}
        />
      </div>
    </div>
  );
};