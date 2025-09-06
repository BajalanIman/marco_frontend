// src/components/Soil/SoilInformationOnMap.jsx
import React from "react";

const SoilInformationOnMap = ({ location, onClose }) => {
  if (!location) return null;

  // Group samples by depth
  const groupedByDepth = location.samples.reduce((acc, sample) => {
    const depth = sample.depth ?? "-";
    if (!acc[depth]) acc[depth] = [];
    acc[depth].push(sample);
    return acc;
  }, {});

  return (
    <div
      onClick={onClose}
      className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-[1000] "
    >
      <div className="bg-white w-full lg:w-[1200px] h-full p-6 mt-10 rounded-md overflow-y-auto relative ">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-600 hover:text-black text-xl"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold mb-4">Soil Information</h2>
        <p className="text-sm text-gray-600 mb-4">
          Coordinates: {Number(location.y).toFixed(6)},{" "}
          {Number(location.x).toFixed(6)}
        </p>

        {Object.entries(groupedByDepth).map(([depth, samples]) => (
          <div
            key={depth}
            className="border rounded p-4 bg-gray-50 shadow-sm mb-6"
          >
            <div className="text-gray-700 mb-2">
              <strong>Depth:</strong> {depth} cm
            </div>

            <table className="text-sm w-full border-collapse">
              <thead>
                <tr>
                  <th className="border-b pb-1 text-left">Variable</th>
                  {samples.map((s) => (
                    <th key={s.id} className="border-b pb-1 text-left">
                      Rep {s.repetition ?? "-"}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {samples[0]?.variables.map((v, idx) => (
                  <tr key={idx}>
                    <td className="pr-2 text-gray-800">
                      {v.variable_name.replace(/_/g, " ")}
                    </td>
                    {samples.map((s) => {
                      const variable = s.variables.find(
                        (varItem) => varItem.variable_name === v.variable_name
                      );
                      return (
                        <td key={s.id} className="text-gray-700">
                          {variable?.value ?? "-"}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SoilInformationOnMap;
