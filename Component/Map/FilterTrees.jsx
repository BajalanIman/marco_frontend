import React, { useEffect } from "react";

const FilterTrees = ({
  trees,
  selectedSpecies,
  setSelectedSpecies,
  speciesOptions,
}) => {
  useEffect(() => {
    if (trees.length > 0 && selectedSpecies.length === 0) {
      setSelectedSpecies(["ALL"]);
    }
  }, [trees]);

  return (
    <div className="mb-1 flex flex-col w-[100%] lg:w-[400px]">
      <label htmlFor="species-select" className="pb-2">
        <strong>Select species:</strong>
      </label>
      <select
        id="species-select"
        multiple
        value={selectedSpecies}
        onChange={(e) => {
          const selected = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value
          );
          if (selected.includes("ALL")) {
            // Only "All" should be selected
            setSelectedSpecies(["ALL"]);
          } else {
            // Remove "ALL" if it was previously selected
            setSelectedSpecies(selected.filter((v) => v !== "ALL"));
          }
        }}
        className="w-[100%] lg:w-[90%] h-[100%] lg:h-[70%]"
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
