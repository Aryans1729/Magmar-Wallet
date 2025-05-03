import { useState } from "react";

export const CustomDropdown = ({ value, onChange, options }) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleOptionClick = (optionValue) => {
    onChange({ target: { value: optionValue } });
    setIsOpen(false);
  };

  const selectedOption = options.find((option) => option.value === value);

  return (
    <div className="relative w-full">
      {/* Selected Item */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        className="bg-[#2B2B2B] rounded-xl py-3 px-4 h-[52px] flex items-center justify-between cursor-pointer shadow-md
                   text-white text-sm hover:bg-[#383838] transition-colors duration-200 ease-in-out"
      >
        <span>{selectedOption?.label || "Select an option"}</span>
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className={`h-5 w-5 text-gray-400 transform transition-transform ${
            isOpen ? "rotate-180" : ""
          }`}
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path
            fillRule="evenodd"
            d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 011.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Dropdown Options */}
      {isOpen && (
        <ul
          className="absolute z-10 mt-2 w-full bg-[#2B2B2B] rounded-xl shadow-lg overflow-hidden
                     text-sm text-white divide-y divide-gray-600"
        >
          {options.map((option) => (
            <li
              key={option.value}
              onClick={() => handleOptionClick(option.value)}
              className={`py-2 px-4 cursor-pointer hover:bg-[#383838] transition-colors ${
                value === option.value ? "bg-[#383838]" : ""
              }`}
            >
              {option.label}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};
