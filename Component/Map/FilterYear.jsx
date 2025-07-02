import React, { useEffect } from "react";

const FilterYear = ({ trees, selectedYear, setSelectedSYear, yearOptions }) => {
  useEffect(() => {
    if (trees.length > 0 && selectedYear.length === 0) {
      setSelectedSYear(["ALL"]);
    }
  }, [trees]);

  return (
    <div className="mb-1 flex flex-col w-[400px]">
      <label htmlFor="year-select" className="pb-2">
        <strong>Select cultivation year:</strong>
      </label>
      <select
        id="year-select"
        multiple
        value={selectedYear}
        onChange={(e) => {
          const selected = Array.from(
            e.target.selectedOptions,
            (opt) => opt.value
          );
          if (selected.includes("ALL")) {
            // Only "All" should be selected
            setSelectedSYear(["ALL"]);
          } else {
            // Remove "ALL" if it was previously selected
            setSelectedSYear(selected.filter((v) => v !== "ALL"));
          }
        }}
        style={{ width: "90%", height: "60%" }}
      >
        <option value="ALL">All</option>
        {yearOptions.map((year_planted) => (
          <option key={year_planted} value={year_planted}>
            {year_planted}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterYear;
