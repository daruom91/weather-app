import { useState, type ReactNode } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";

interface InputProps {
  label?: string;
  error?: string;
  required?: boolean;
  onKeyDown?: () => void;
  disabled?: boolean;
  onChange?: (value: string) => void;
  icon?: ReactNode;
  iconDirection?: "left" | "right";
  [key: string]: any;
}

const Input = ({
  label,
  error,
  icon,
  required,
  disabled,
  onChange,
  onKeyDown,
  iconDirection,
  type = "text",
  ...props
}: InputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (onChange && !disabled) {
      onChange(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !disabled) {
      onKeyDown?.();
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const renderIcon = () => {
    if (type === "password") {
      return (
        <button
          type="button"
          onClick={togglePasswordVisibility}
          className={`absolute right-2 top-1/2 transform -translate-y-1/2 ${
            disabled ? "opacity-50 cursor-not-allowed" : "cursor-pointer"
          }`}
          disabled={disabled}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      );
    }

    if (icon) {
      return (
        <span
          className={`absolute ${
            iconDirection === "left" ? "left-2" : "right-2"
          } top-1/2 transform -translate-y-1/2 ${disabled ? "opacity-50" : ""}`}
        >
          {icon}
        </span>
      );
    }

    return null;
  };

  return (
    <div className={disabled ? "opacity-60" : ""}>
      {label && (
        <label className={disabled ? "cursor-not-allowed" : ""}>
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <input
          className={`w-full p-2 border border-gray-300 rounded-md ${
            disabled ? "bg-gray-100 cursor-not-allowed" : ""
          }`}
          type={type === "password" ? (showPassword ? "text" : "password") : type}
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          disabled={disabled}
          {...props}
        />

        {renderIcon()}
      </div>

      {error && <span className="text-red-500">{error}</span>}
    </div>
  );
};

export default Input;
