import { useState, useRef, useEffect, type ReactNode } from "react";

interface DropdownProps {
  label?: string;
  error?: string;
  required?: boolean;
  options: { label: string; value: any }[];
  value?: any;
  onChange?: (value: any) => void;
  icon?: ReactNode;
  iconDirection?: "left" | "right";
  placeholder?: string;
}

const Dropdown = ({
  label,
  error,
  required,
  options,
  value,
  onChange,
  icon,
  iconDirection = "right",
  placeholder = "Select an option",
}: DropdownProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const dropdownRef = useRef<HTMLDivElement>(null);

  const filteredOptions = options.filter((option) =>
    option.label.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const selectedOption = options.find((option) => option.value === value);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <div ref={dropdownRef} className=" text-white">
      {label && (
        <label className="block mb-1">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}

      <div className="relative">
        <div
          className="w-full p-2 border border-gray-300 rounded-md cursor-pointer flex justify-between items-center"
          onClick={() => setIsOpen(!isOpen)}
        >
          <span>{selectedOption ? selectedOption.label : placeholder}</span>
          {icon && (
            <span
              className={`absolute ${
                iconDirection === "left" ? "left-2" : "right-2"
              } top-1/2 transform -translate-y-1/2`}
            >
              {icon}
            </span>
          )}
        </div>

        {isOpen && (
          <div className="absolute z-10 p-2 w-full mt-1 text-zinc-800 bg-white bg-opacity-20 border border-gray-300 rounded-md shadow-lg">
            <input
              type="text"
              className="w-full p-2 border-b border-gray-300"
              placeholder="Search..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onClick={(e) => e.stopPropagation()}
            />
            <div className="max-h-48 overflow-y-auto">
              {filteredOptions.map((option) => (
                <div
                  key={option.value}
                  className={`p-2 cursor-pointer hover:bg-gray-100 ${
                    option.value === value ? "bg-gray-50" : ""
                  }`}
                  onClick={() => {
                    onChange?.(option.value);
                    setIsOpen(false);
                    setSearchTerm("");
                  }}
                >
                  {option.label}
                </div>
              ))}
              {filteredOptions.length === 0 && (
                <div className="p-2 text-gray-500">No options found</div>
              )}
            </div>
          </div>
        )}
      </div>

      {error && <span className="text-red-500 text-sm mt-1">{error}</span>}
    </div>
  );
};

export default Dropdown;
