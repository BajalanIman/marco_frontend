import React from "react";

const StepDivider = ({ step }) => {
  return (
    <div className="w-full flex justify-center items-center mt-6">
      <p className="pr-2">------------</p>
      <div className="h-16 w-16 bg-gray-600 flex justify-center items-center rounded-full">
        <p className="font-bold font-sans text-yellow-50"> Step {step}</p>
      </div>
      <p className="pl-2">------------</p>
    </div>
  );
};

export default StepDivider;
