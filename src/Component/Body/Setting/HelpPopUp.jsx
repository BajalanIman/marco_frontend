import React from "react";

export default function HelpPopUp({ isOpen, onClose, helpMessage }) {
  if (!isOpen) return null; // don't render if popup is closed

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-[10000]">
      <div className="bg-white rounded-lg shadow-lg w-80 p-4 relative">
        {/* Close (X) button */}
        <button
          onClick={onClose}
          className="absolute top-2 right-2 text-gray-600 hover:text-black text-xl"
        >
          &times;
        </button>

        {/* Message */}
        <div className="mt-4 mb-6 text-center">
          <p className="text-gray-800 font-medium">{helpMessage}</p>
        </div>

        {/* OK button */}
        <div className="flex justify-center">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            OK
          </button>
        </div>
      </div>
    </div>
  );
}
