import React from "react";

const FilterTrees = ({
  selectedSpecies,
  setSelectedSpecies,
  speciesOptions,
}) => {
  return (
    <div className="mb-1 flex flex-col w-[100%] lg:w-[400px]">
      <label htmlFor="species-select" className="pb-2">
        <strong>Select species:</strong>
      </label>
      <select
        id="species-select"
        multiple
        size="10"
        value={selectedSpecies}
        onChange={(e) => {
          const options = e.target.options;
          const selected = [];
          for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
              selected.push(options[i].value);
            }
          }

          if (selected.includes("ALL")) {
            setSelectedSpecies(["ALL"]);
          } else {
            setSelectedSpecies(selected);
          }
        }}
        className="w-[100%] lg:w-[90%] h-28 border border-gray-300 rounded p-2"
      >
        <option value="ALL">All</option>
        {speciesOptions.map((species) => (
          <option key={species} value={species}>
            {species}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterTrees;
