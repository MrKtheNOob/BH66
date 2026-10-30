import { useState } from "react";
import { Eye, EyeOff } from "lucide-react";

type InputProps = {
  name?: string;
  type?: string;
  placeholder?: string;
  icon?: React.ReactNode;
  variant?: "dark" | "light";
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  autoComplete?: string;
};

export default function Input({
  name,
  type = "text",
  placeholder,
  icon,
  variant = "dark",
  value,
  onChange,
  autoComplete,
}: InputProps) {
  const [showPassword, setShowPassword] = useState(false);

  const isPassword = type === "password";
  const isDark = variant === "dark";

  return (
    <div
      className={`
        flex items-center border rounded-lg px-3 py-2
        ${
          isDark
            ? "bg-zinc-900 border-zinc-700 focus-within:border-yellow-500"
            : "bg-white border-gray-300 focus-within:border-black"
        }
      `}
    >
      {/* LEFT ICON */}
      {icon && (
        <div className={`mr-2 ${isDark ? "text-gray-400" : "text-gray-500"}`}>
          {icon}
        </div>
      )}

      {/* INPUT */}
      <input
        name={name}
        type={isPassword ? (showPassword ? "text" : "password") : type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        className={`
          w-full outline-none
          ${
            isDark
              ? "bg-transparent text-white placeholder-gray-500"
              : "bg-transparent text-black placeholder-gray-400"
          }
        `}
      />

      {/* TOGGLE PASSWORD */}
      {isPassword && (
        <button
          type="button"
          onClick={() => setShowPassword(!showPassword)}
          className="ml-2 text-gray-400 hover:text-gray-600"
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      )}
    </div>
  );
}
