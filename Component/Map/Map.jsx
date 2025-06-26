import { useEffect, useState } from "react";
import "leaflet/dist/leaflet.css";
import { Marker, Polygon, Popup, useMapEvents } from "react-leaflet";
import { MapContainer } from "react-leaflet/MapContainer";
import { TileLayer } from "react-leaflet/TileLayer";
import L from "leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";
import tree from "../../assets/tree-svgrepo-com.svg";

// Utility: Get center of polygon
function getCentroid(coords) {
  let latSum = 0;
  let lngSum = 0;
  coords.forEach(([lng, lat]) => {
    latSum += lat;
    lngSum += lng;
  });
  return [latSum / coords.length, lngSum / coords.length];
}

// Component to track zoom level and update parent state
function ZoomTracker({ setZoomLevel }) {
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    },
  });
  return null;
}

function Map() {
  const [plots, setPlots] = useState([]);
  const [trees, setTrees] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const center = [52.93754351, 13.12866669];

  const treeIcon = new L.Icon({
    iconUrl: tree, // your tree icon path
    iconSize: [20, 20],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plotsRes, treesRes] = await Promise.all([
          fetch("http://localhost:8800/api/plots"),
          fetch("http://localhost:8800/api/trees"),
        ]);
        const plotsData = await plotsRes.json();
        const treesData = await treesRes.json();

        console.log("Loaded trees:", treesData);

        setPlots(plotsData);
        setTrees(treesData);
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      maxZoom={22}
      minZoom={4}
      scrollWheelZoom={true}
      style={{ height: "400px", width: "50%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {/* Track zoom changes */}
      <ZoomTracker setZoomLevel={setZoomLevel} />

      {/* Clustered markers for plots */}
      <MarkerClusterGroup chunkedLoading>
        {plots.map((plot) => {
          if (!plot.coordinates || plot.coordinates.length === 0) return null;
          const centroid = getCentroid(plot.coordinates);
          return (
            <Marker key={plot.plot_id} position={centroid}>
              <Popup>
                <strong>{plot.plot_name}</strong>
                <br />
                {plot.plot_information}
              </Popup>
            </Marker>
          );
        })}
      </MarkerClusterGroup>

      {/* Plot polygons */}
      {plots.map((plot) =>
        plot.coordinates && plot.coordinates.length > 0 ? (
          <Polygon
            key={`poly-${plot.plot_id}`}
            positions={plot.coordinates.map(([lng, lat]) => [lat, lng])}
            pathOptions={{ color: "green", weight: 1 }}
          />
        ) : null
      )}

      {/* Tree markers - only show if zoom level > 14 */}
      {zoomLevel > 14 &&
        trees.map((tree) => {
          if (
            tree.lat === undefined ||
            tree.lng === undefined ||
            isNaN(tree.lat) ||
            isNaN(tree.lng)
          ) {
            console.warn("Skipping invalid tree:", tree);
            return null;
          }

          return (
            <Marker
              key={tree.tree_id}
              position={[tree.lat, tree.lng]}
              icon={treeIcon}
            >
              <Popup>
                <strong>Tree number: {tree.tree_no}</strong>
                <br />
                Species: {tree.species}
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
}

export default Map;
