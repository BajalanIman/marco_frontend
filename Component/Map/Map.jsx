import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Marker, Polygon, Popup } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import tree from "../../assets/tree-svgrepo-com.svg";
import L from "leaflet";
import sampleData from "../Data/Data";
import MarkerClusterGroup from "react-leaflet-cluster";

function Map() {
  const [plots, setPlots] = useState([]);
  const position = [52.93754351, 13.12866669];

  const treeIcon = new L.Icon({
    iconUrl: tree,
    iconSize: [32, 32],
    iconAnchor: [16, 32],
    popupAnchor: [0, -32],
  });

  useEffect(() => {
    const fetchPlots = async () => {
      try {
        const res = await fetch("http://localhost:8800/api/plots");
        const data = await res.json();
        console.log("Fetched plots:", data); // <-- Add this
        setPlots(data);
      } catch (err) {
        console.error("Failed to fetch plot data", err);
      }
    };

    fetchPlots();
  }, []);

  return (
    <MapContainer
      center={position}
      zoom={14}
      maxZoom={22}
      minZoom={4}
      scrollWheelZoom={false}
      className="h-[400px] w-[50%]"
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Render tree markers */}
      <MarkerClusterGroup chunkedLoading>
        {sampleData.map((i) => (
          <Marker key={i.Tree_No} position={[i.North, i.East]} icon={treeIcon}>
            <Popup>
              Tree {i.Tree_No} <br /> {i.Tree_Spec}
            </Popup>
          </Marker>
        ))}
      </MarkerClusterGroup>
      {/* Render plot polygons */}
      {plots.map(
        (plot) =>
          plot.coordinates &&
          plot.coordinates.length > 0 && (
            <Polygon
              key={plot.plot_id}
              positions={plot.coordinates.map(([lng, lat]) => [lat, lng])}
              pathOptions={{ color: "green", weight: 1 }}
            >
              <Popup>{plot.plot_name}</Popup>
            </Polygon>
          )
      )}
    </MapContainer>
  );
}

export default Map;
