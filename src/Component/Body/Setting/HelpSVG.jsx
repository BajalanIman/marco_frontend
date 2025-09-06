import React from "react";

const HelpSVG = ({ setIsPopupOpen, setHelpMessage, message, label }) => {
  return (
    <div className="flex gap-1">
      <label className="block font-medium mb-1">{label}</label>

      <button
        onClick={() => {
          setIsPopupOpen(true);
          setHelpMessage(message);
        }}
      >
        <svg
          class="w-4 h-4 text-blue-600 dark:text-white mb-1"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          fill="none"
          viewBox="0 0 24 24"
        >
          <path
            stroke="currentColor"
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 13V8m0 8h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
          />
        </svg>
      </button>
    </div>
  );
};

export default HelpSVG;
