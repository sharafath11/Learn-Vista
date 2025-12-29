import { FaEye, FaEyeSlash } from "react-icons/fa";

interface Props {
  label: string;
  id: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}

export function PasswordInputWithToggle({
  label,
  id,
  value,
  onChange,
  show,
  setShow,
}: Props) {
  return (
    <div>
      <label htmlFor={id} className="block text-sm font-medium text-gray-700">
        {label}
      </label>
      <div className="relative mt-1">
        <input
          id={id}
          name={id}
          type={show ? "text" : "password"}
          value={value}
          onChange={onChange}
          className="w-full rounded-lg border p-2 pr-10 text-sm focus:ring-2 focus:ring-purple-200"
          required
        />
        <button
          type="button"
          onClick={() => setShow((p) => !p)}
          className="absolute inset-y-0 right-3 text-gray-500"
        >
          {show ? <FaEyeSlash /> : <FaEye />}
        </button>
      </div>
    </div>
  );
}
