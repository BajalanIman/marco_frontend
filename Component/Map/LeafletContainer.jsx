import React, { useEffect, useState } from "react";
import tree from "../../assets/tree-svgrepo-com.svg";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import * as turf from "@turf/turf";
import AerialImage from "./AerialImage";

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
import { Link } from "react-router-dom";

function LogMapCenterOnZoom({ zoomLevel, plots, setMapCenter }) {
  const map = useMap();

  useEffect(() => {
    if (zoomLevel > 14) {
      const center = map.getCenter();
      const centerPoint = turf.point([center.lng, center.lat]);

      for (const plot of plots) {
        if (plot.coordinates && plot.coordinates.length > 2) {
          const polygon = turf.polygon([
            plot.coordinates.map(([lng, lat]) => [lng, lat]),
          ]);

          if (turf.booleanPointInPolygon(centerPoint, polygon)) {
            setMapCenter(plot.plot_id);
            // console.log(
            //   `✅ Screen center is inside Plot "${plot.plot_name}", ${plot.plot_id}`
            // );
            break; // Exit early after finding the first match
          }
        }
      }

      //   console.log("🗺️ Map screen center:", center.lat, center.lng);
    }
  }, [zoomLevel, map, plots, setMapCenter]);

  return null;
}

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
  setTreeVideo,
  setShowVideo,
  setShowFilter,
  setShowPanorama,
  setMapCenter,
  aerialImagehandlerPass,
  soilLocations,
  showSoilData,
  setSelectedLocation,
}) => {
  const center = [52.93754351, 13.12866669];

  useEffect(() => {
    if (zoomLevel > 14) {
      plots.forEach((plot) => {
        if (plot.coordinates && plot.coordinates.length > 2) {
          const geojsonPolygon = turf.polygon([
            plot.coordinates.map(([lng, lat]) => [lng, lat]),
          ]);
          const centroid = turf.centroid(geojsonPolygon);
          //   console.log(
          //     `Centroid for plot "${plot.plot_name}":`,
          //     centroid.geometry.coordinates
          //   );
        }
      });
    }
  }, [zoomLevel, plots]);

  const treeIcon = new L.Icon({
    iconUrl: tree,
    iconSize: [20, 20],
    iconAnchor: [10, 20],
    popupAnchor: [0, -20],
  });
  //   const [treeVideo, setTreeVideo] = useState([]);

  return (
    <MapContainer
      center={center}
      zoom={zoomLevel}
      maxZoom={22}
      minZoom={4}
      scrollWheelZoom={true}
      className="transition-all duration-300 h-[350px] w-[full] px-4 lg:w-[700px]"
    >
      <AerialImage aerialImagehandlerPass={aerialImagehandlerPass} />
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
      <LogMapCenterOnZoom
        zoomLevel={zoomLevel}
        plots={plots}
        setMapCenter={setMapCenter}
      />
      {/* Soil sample location markers (clustered) */}
      {zoomLevel > 14 &&
        showSoilData &&
        soilLocations &&
        soilLocations.length > 0 && (
          <MarkerClusterGroup chunkedLoading>
            {soilLocations.map((loc, idx) => {
              if (
                loc.x === null ||
                loc.y === null ||
                Number.isNaN(loc.x) ||
                Number.isNaN(loc.y)
              )
                return null;

              const position = [Number(loc.y), Number(loc.x)];

              return (
                <Marker
                  key={`soil-${idx}`}
                  position={position}
                  eventHandlers={{
                    click: () => setSelectedLocation(loc), // open modal
                  }}
                />
              );
            })}
          </MarkerClusterGroup>
        )}

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
                <p>Species: {tree.species}</p>

                <button
                  className="hover:text-blue-600"
                  onClick={() => {
                    setTreeVideo(tree);
                    setShowVideo(true);
                    setShowFilter(false);
                    setShowPanorama(false);
                  }}
                >
                  Video
                </button>
              </Popup>
            </Marker>
          );
        })}
    </MapContainer>
  );
};

export default LeafletContainer;
