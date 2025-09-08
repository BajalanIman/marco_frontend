import { useState } from "react";
import axios from "axios";
import PopupModal from "./PopupModal";
import { BASE_URL } from "../../../constants/constants";

const PlotForm = ({ areaId }) => {
  const [plotName, setPlotName] = useState("");
  const [plotInfo, setPlotInfo] = useState("");
  const [plotBorder, setPlotBorder] = useState(""); // Raw GeoJSON
  const [geoJsonError, setGeoJsonError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  const handleGeoJsonUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    const reader = new FileReader();

    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target.result);

        let geometry = null;

        if (parsed.type === "FeatureCollection" && parsed.features?.length) {
          geometry = parsed.features[0].geometry;
        } else if (parsed.type === "Feature" && parsed.geometry) {
          geometry = parsed.geometry;
        } else if (
          parsed.type === "Polygon" ||
          parsed.type === "MultiPolygon"
        ) {
          geometry = parsed;
        } else {
          throw new Error("Unsupported GeoJSON format");
        }

        if (geometry.type !== "Polygon" && geometry.type !== "MultiPolygon") {
          throw new Error("Only Polygon or MultiPolygon allowed");
        }

        setPlotBorder(JSON.stringify(geometry)); // Send raw GeoJSON
        setGeoJsonError("");
      } catch (err) {
        console.error("Invalid GeoJSON:", err);
        setGeoJsonError("Invalid GeoJSON. Please upload a valid geometry.");
      }
    };

    reader.readAsText(file);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(`${BASE_URL}api/plots`, {
        area_id: areaId,
        plot_name: plotName,
        plot_information: plotInfo,
        plot_border: plotBorder,
      });

      // alert("Plot created successfully!");

      setPlotName("");
      setPlotInfo("");
      setPlotBorder("");
      setShowModal(true);
      setNewMessage("The plot created successfully");
    } catch (err) {
      setNewMessage("Failed to create plot.");
      console.error("Error uploading plot:", err);
      // alert("Failed to create plot.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="space-y-4 p-4 bg-gray-100 rounded-xl"
    >
      <div>
        <label className="block font-semibold">Plot Name</label>
        <input
          type="text"
          value={plotName}
          onChange={(e) => setPlotName(e.target.value)}
          className="border p-2 w-full"
          required
        />
      </div>

      <div>
        <label className="block font-semibold">Plot Information</label>
        <textarea
          value={plotInfo}
          onChange={(e) => setPlotInfo(e.target.value)}
          className="border p-2 w-full"
        />
      </div>

      <div>
        <label className="block font-semibold">
          Upload Plot Border (.geojson)
        </label>
        <input
          type="file"
          accept=".geojson,application/geo+json,application/json"
          onChange={handleGeoJsonUpload}
          className="border p-2 w-full"
          required
        />
        {geoJsonError && (
          <p className="text-red-600 mt-1 text-sm">{geoJsonError}</p>
        )}
      </div>

      {plotBorder && (
        <div>
          <label className="block font-semibold">Preview (GeoJSON)</label>
          <textarea
            value={plotBorder}
            readOnly
            className="border p-2 w-full bg-gray-200 text-sm"
          />
        </div>
      )}

      <button
        type="submit"
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Save Plot
      </button>
      {showModal && (
        <PopupModal
          message={`${newMessage} !`}
          onClose={() => (setShowModal(false), window.location.reload())}
        />
      )}
    </form>
  );
};

export default PlotForm;
