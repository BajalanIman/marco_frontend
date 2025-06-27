import React from "react";
import tree from "../../assets/tree-svgrepo-com.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

import {
  MapContainer,
  Marker,
  Polygon,
  Popup,
  TileLayer,
  useMapEvents,
  useMap,
  LayersControl, // ✅ Added for multiple base layers
} from "react-leaflet";
import MarkerClusterGroup from "react-leaflet-cluster";

// Helper to get centroid of a polygon
function getCentroid(coords) {
  let latSum = 0;
  let lngSum = 0;
  coords.forEach(([lng, lat]) => {
    latSum += lat;
    lngSum += lng;
  });
  return [latSum / coords.length, lngSum / coords.length];
}

// Zoom tracker to update zoom level in state
function ZoomTracker({ setZoomLevel }) {
  useMapEvents({
    zoomend: (e) => {
      setZoomLevel(e.target.getZoom());
    },
  });
  return null;
}

// Separate component to handle zoom interaction
function PlotMarker({ plot, centroid }) {
  const map = useMap();

  const handleZoomIn = () => {
    map.setView(centroid, 17); // or map.flyTo(centroid, 22)
  };

  return (
    <Marker position={centroid}>
      <Popup>
        <strong
          onClick={handleZoomIn}
          style={{ cursor: "pointer", color: "blue" }}
        >
          {plot.plot_name}
        </strong>
        <br />
        {plot.plot_information}
      </Popup>
    </Marker>
  );
}

const LeafletContainer = ({
  zoomLevel,
  setZoomLevel,
  plots,
  filteredTrees,
}) => {
  const center = [52.93754351, 13.12866669];

  const treeIcon = new L.Icon({
    iconUrl: tree,
    iconSize: [20, 20],
    iconAnchor: [14, 28],
    popupAnchor: [0, -28],
  });

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      maxZoom={22}
      minZoom={4}
      scrollWheelZoom={true}
      style={{ height: "350px", width: "800px" }}
    >
      {/* ✅ Add multiple base layers */}
      <LayersControl position="topright">
        <LayersControl.BaseLayer checked name="OpenStreetMap">
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>

        <LayersControl.BaseLayer name="OpenTopoMap">
          <TileLayer
            attribution='Map data: &copy; <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)'
            url="https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png"
          />
        </LayersControl.BaseLayer>
      </LayersControl>

      <ZoomTracker setZoomLevel={setZoomLevel} />

      {/* Plot Markers */}
      <MarkerClusterGroup chunkedLoading>
        {plots.map((plot) => {
          if (!plot.coordinates || plot.coordinates.length === 0) return null;
          const centroid = getCentroid(plot.coordinates);
          if (zoomLevel > 14) return null;

          return (
            <PlotMarker
              key={`marker-${plot.plot_id}`}
              plot={plot}
              centroid={centroid}
            />
          );
        })}
      </MarkerClusterGroup>

      {/* Polygons */}
      {plots.map((plot) =>
        plot.coordinates && plot.coordinates.length > 0 ? (
          <Polygon
            key={`poly-${plot.plot_id}`}
            positions={plot.coordinates.map(([lng, lat]) => [lat, lng])}
            pathOptions={{ color: "blue", weight: 1 }}
          />
        ) : null
      )}

      {/* Tree Markers */}
      {zoomLevel > 14 &&
        filteredTrees.map((tree) => {
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
              key={`tree-${tree.tree_id}`}
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
};

export default LeafletContainer;
