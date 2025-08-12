import { ChevronsDown, ChevronsUp } from "lucide-react";
import React, { useState } from "react";

const ShowComponent = ({ title, selectedPlot, children }) => {
  const [showTreeMaker, setShowTreeMaker] = useState(false);

  return (
    <div className="bg-gray-100 rounded-xl  shadow-sm border border-gray-300 ">
      <div
        className="flex justify-between py-3 px-5 mb-3 cursor-pointer"
        onClick={() => setShowTreeMaker((prev) => !prev)}
      >
        <span className="flex">
          <p>{title}</p>
          {selectedPlot && <p className="pl-1"> {selectedPlot.plot_name}</p>}
        </span>
        {showTreeMaker ? <ChevronsUp /> : <ChevronsDown />}
      </div>

      {showTreeMaker && children}
    </div>
  );
};

export default ShowComponent;
