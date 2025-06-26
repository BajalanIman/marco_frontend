import axios from "axios";
import { useEffect, useState } from "react";

const PlotsList = ({
  areaId,
  selectedPlotIndex,
  setSelectedPlotIndex,
  setSelectedPlot,
}) => {
  const [plots, setPlots] = useState([]);

  useEffect(() => {
    axios
      .get("/api/plots")
      .then((res) => {
        const filteredPlots = res.data.filter(
          (plot) => plot.area_id === areaId
        );
        setPlots(filteredPlots);
      })
      .catch((err) => {
        console.error("Failed to fetch plot info:", err);
      });
  }, [areaId]);

  const handleChange = (e) => {
    const index = Number(e.target.value);
    setSelectedPlotIndex(index);
    setSelectedPlot(plots[index]); // 👈 Pass the full plot object
  };

  if (!areaId) return <p>It seems no plot is available</p>;
  if (plots.length === 0) return <p>No plots found for this area.</p>;

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <label htmlFor="plot-select" className="block mb-2 font-medium">
        Select a Plot:
      </label>
      <select
        id="plot-select"
        className="mb-4 p-2 border rounded w-full"
        value={selectedPlotIndex ?? ""}
        onChange={handleChange}
      >
        <option value="" disabled>
          Select a plot
        </option>
        {plots.map((plot, index) => (
          <option key={index} value={index}>
            {plot.plot_name}
          </option>
        ))}
      </select>

      {selectedPlotIndex !== null && (
        <div className="bg-gray-100 rounded-lg px-3 py-2">
          <h3 className="text-lg font-semibold">
            {plots[selectedPlotIndex].plot_name}
          </h3>
          <p className="text-sm text-gray-600">
            {plots[selectedPlotIndex].plot_information}
          </p>
        </div>
      )}
    </div>
  );
};
export default PlotsList;
