// src/components/Soil/SoilSamplesTable.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE || "http://localhost:8800";

const SoilSamplesTable = ({ plotId, setSoilLocations, showSoilData }) => {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [count, setCount] = useState(0);
  const [raw, setRaw] = useState(null);

  const groupSamplesToLocations = (samples = []) => {
    // group by x/y string key (tolerant)
    const map = new Map();
    for (const s of samples) {
      const x = s.x_coord ?? s.x ?? s.longitude ?? null;
      const y = s.y_coord ?? s.y ?? s.latitude ?? null;
      const key = `${String(x ?? "")}::${String(y ?? "")}`;
      if (!map.has(key)) {
        map.set(key, {
          x: x === null || x === undefined ? null : Number(x),
          y: y === null || y === undefined ? null : Number(y),
          samples: [],
        });
      }
      // normalize variables array
      const vars = (s.variables ?? []).map((v) => ({
        variable_name: v.variable_name ?? v.name ?? v.variable ?? null,
        value: v.value ?? v.val ?? null,
      }));
      map.get(key).samples.push({
        id: s.id ?? null,
        depth: s.depth ?? null,
        repetition: s.repetition ?? null,
        location: s.location ?? null,
        variables: vars,
      });
    }
    return Array.from(map.values());
  };

  const fetchData = async () => {
    if (plotId === undefined || plotId === null) {
      setError("Missing plotId");
      setSoilLocations?.([]);
      setCount(0);
      return;
    }

    setLoading(true);
    setError(null);
    try {
      // try the grouped endpoint first (if you later add it)
      let resp;
      try {
        resp = await axios.get(`${API_BASE}/api/soil`, {
          params: { plot_id: plotId },
          timeout: 5000,
        });
        // OK if returned 200
      } catch (errLocations) {
        // fallback to /api/soil (samples)
        resp = await axios.get(`${API_BASE}/api/soil`, {
          params: { plot_id: plotId },
          timeout: 5000,
        });
      }

      // store raw data for debugging
      setRaw(resp.data);
      console.log("Soil API response:", resp.data);

      // If server returned locations already
      if (Array.isArray(resp.data?.locations)) {
        const cleaned = resp.data.locations.map((l) => ({
          x: l.x === null || l.x === undefined ? null : Number(l.x),
          y: l.y === null || l.y === undefined ? null : Number(l.y),
          samples: (l.samples ?? []).map((s) => ({
            id: s.id ?? null,
            depth: s.depth ?? null,
            repetition: s.repetition ?? null,
            location: s.location ?? null,
            variables: (s.variables ?? []).map((v) => ({
              variable_name: v.variable_name,
              value: v.value,
            })),
          })),
        }));
        setSoilLocations?.(cleaned);
        setCount(cleaned.length);
        setError(null);
      } else if (Array.isArray(resp.data?.samples)) {
        // server returned raw samples — group client-side
        const samples = resp.data.samples;
        const locations = groupSamplesToLocations(samples);
        setSoilLocations?.(locations);
        setCount(locations.length);
        setError(null);
      } else if (Array.isArray(resp.data)) {
        // In case server returns plain array (samples)
        const locations = groupSamplesToLocations(resp.data);
        setSoilLocations?.(locations);
        setCount(locations.length);
        setError(null);
      } else {
        // nothing useful
        setSoilLocations?.([]);
        setCount(0);
        setError("No location or sample data returned by API");
      }
    } catch (err) {
      console.error("Failed to fetch soil locations:", err);
      setError(
        err?.response?.data?.error ??
          err.message ??
          "Failed to fetch soil locations"
      );
      setSoilLocations?.([]);
      setCount(0);
      setRaw(err?.response?.data ?? null);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (showSoilData) {
      fetchData();
    } else {
      setSoilLocations?.([]);
      setCount(0);
    }
  }, [plotId, showSoilData]);

  return (
    <div className="p-2 text-sm bg-white rounded shadow-sm">
      <div className="flex items-center justify-between">
        <div>
          {loading ? (
            <div className="text-gray-600">Loading soil locations...</div>
          ) : error ? (
            <div className="text-red-600">Soil load error: {error}</div>
          ) : (
            <div className="text-gray-700">
              Boden-Daten wurden an verschiedenen Stellen der Parzelle erhoben.
              Durch Anklicken der einzelnen Bodenpunkte auf der Karte werden die
              erhobenen Informationen angezeigt.
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default SoilSamplesTable;
