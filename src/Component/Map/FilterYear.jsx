import React from "react";

const FilterYear = ({ selectedYear, setSelectedSYear, yearOptions }) => {
  return (
    <div className="mb-1 flex flex-col w-[100%] lg:w-[400px]">
      <label htmlFor="year-select" className="pb-2">
        <strong>Select cultivation year:</strong>
      </label>
      <select
        id="year-select"
        multiple
        size="10"
        value={selectedYear}
        onChange={(e) => {
          const options = e.target.options;
          const selected = [];
          for (let i = 0; i < options.length; i++) {
            if (options[i].selected) {
              selected.push(options[i].value);
            }
          }

          if (selected.includes("ALL")) {
            setSelectedSYear(["ALL"]);
          } else {
            setSelectedSYear(selected);
          }
        }}
        className="w-[100%] lg:w-[90%] h-20 border border-gray-300 rounded p-2"
      >
        <option value="ALL">All</option>
        {yearOptions.map((year) => (
          <option key={year} value={year}>
            {year}
          </option>
        ))}
      </select>
    </div>
  );
};

export default FilterYear;
