import React, { useState } from "react";
import Papa from "papaparse";
import axios from "axios";

const SoilUploaderForm = ({ plotId }) => {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState(null); // { text, type }

  const showMessage = (text, type = "info", seconds = 5) => {
    setMessage({ text, type });
    setTimeout(() => setMessage(null), seconds * 1000);
  };

  const handleFileChange = (e) => {
    setFile(e.target.files?.[0] ?? null);
  };

  const detectDelimiter = (file) =>
    new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => {
        const text = String(reader.result || "");
        const lines = text.split(/\r\n|\n/).filter(Boolean);
        const header = (lines[0] || "").replace(/^\uFEFF/, "");
        const counts = {
          "\t": (header.match(/\t/g) || []).length,
          ",": (header.match(/,/g) || []).length,
          ";": (header.match(/;/g) || []).length,
          "|": (header.match(/\|/g) || []).length,
        };
        const best = Object.entries(counts).sort((a, b) => b[1] - a[1])[0][0];
        resolve(best || ",");
      };
      const blob = file.slice(0, 32768);
      reader.readAsText(blob);
    });

  const normalizeKey = (k = "") =>
    String(k || "")
      .replace(/^\uFEFF/, "")
      .trim()
      .toLowerCase()
      .replace(/\s+/g, "_")
      .replace(/[^\w_]/g, "")
      .replace(/__+/g, "_")
      .replace(/^_+|_+$/g, "");

  const parseNumber = (raw) => {
    if (raw === "" || raw == null) return null;
    const n = parseFloat(String(raw).replace(",", ".").trim());
    return Number.isFinite(n) ? n : null;
  };

  const handleUpload = async () => {
    if (!file) {
      showMessage("Please select a CSV/TSV file first.", "error", 4);
      return;
    }
    // require plotId
    if (!plotId && plotId !== 0) {
      showMessage(
        "Missing plotId. Provide a valid plotId prop from parent.",
        "error",
        6
      );
      return;
    }

    setLoading(true);
    try {
      const delimiter = await detectDelimiter(file);

      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        delimiter,
        transformHeader: (h) => (h ? h.replace(/^\uFEFF/, "").trim() : h),
        complete: async (results) => {
          try {
            const rows = results.data;
            const canonicalRows = rows.map((row) => {
              const c = {};
              Object.keys(row || {}).forEach(
                (k) => (c[normalizeKey(k)] = row[k])
              );
              return c;
            });

            // map to samples, but DO NOT rely on place_ID to find plot
            const samples = canonicalRows.map((c) => {
              const depth = c.depth ?? c.depth_cm ?? null;
              const repetition = c.repetition ?? c.repeat ?? null;

              const x = c.x ?? c.x_coord ?? c.longitude ?? c.easting ?? null;
              const y = c.y ?? c.y_coord ?? c.latitude ?? c.northing ?? null;

              const metaKeys = new Set([
                "place_id",
                "placeid",
                "place",
                "plot",
                "plot_name",
                "plotname",
                "depth",
                "depth_cm",
                "repetition",
                "repeat",
                "x",
                "x_coord",
                "longitude",
                "easting",
                "y",
                "y_coord",
                "latitude",
                "northing",
                "location",
              ]);

              const variables = Object.keys(c)
                .filter((k) => k && !metaKeys.has(k))
                .map((k) => {
                  const val = parseNumber(c[k]);
                  return { variable_name: k, value: val };
                })
                .filter((v) => v.value !== null);

              return {
                // include plot_id so backend uses it directly
                plot_id: plotId,
                // keep original place_ID too (optional, for traceability)
                place_ID: c.place_id ?? c.plot_name ?? null,
                depth:
                  depth === "" || depth == null
                    ? null
                    : parseInt(String(depth).replace(",", "."), 10),
                location: c.location ?? null,
                repetition:
                  repetition === "" || repetition == null
                    ? null
                    : parseInt(String(repetition).replace(",", "."), 10),
                x_coord: x === "" || x == null ? null : parseNumber(x),
                y_coord: y === "" || y == null ? null : parseNumber(y),
                variables,
              };
            });

            console.log("Detected delimiter:", delimiter);
            console.log("Prepared samples (first 10):", samples.slice(0, 10));

            // minimal validation: ensure samples are not empty and variables exist
            const missingPlotIdRows = samples.filter((s) => !s.plot_id);
            if (missingPlotIdRows.length > 0) {
              showMessage(
                "Some rows are missing plot_id. Aborting.",
                "error",
                6
              );
              setLoading(false);
              return;
            }

            const resp = await axios.post("localhost:8800/api/soil", {
              samples,
              plot_id: plotId, // helpful to pass top-level too
            });

            showMessage(resp.data.message ?? "Upload finished", "success", 6);
            if (resp.data.errors && resp.data.errors.length > 0) {
              showMessage(
                `Inserted ${resp.data.insertedCount}. ${resp.data.errors.length} row(s) had issues (see console).`,
                "info",
                8
              );
              console.warn("Upload errors:", resp.data.errors);
            }
          } catch (err) {
            console.error("Full error:", err?.response?.data ?? err);
            const serverMsg =
              err?.response?.data?.error || err?.message || "Upload failed";
            showMessage(serverMsg, "error", 8);
          } finally {
            setLoading(false);
          }
        },
        error: (err) => {
          console.error("PapaParse error:", err);
          showMessage(
            "CSV parsing error: " + (err?.message ?? String(err)),
            "error",
            6
          );
          setLoading(false);
        },
      });
    } catch (err) {
      console.error("Delimiter detection / parse failure:", err);
      showMessage(
        "Failed to read file: " + (err?.message ?? String(err)),
        "error",
        6
      );
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-xl shadow-sm mb-5 border border-gray-300">
      <h3 className="text-xl font-bold mb-4">Upload Soil CSV file</h3>
      <div className="flex justify-between items-center">
        <input
          type="file"
          accept=".csv,text/csv,.tsv,text/tab-separated-values"
          onChange={handleFileChange}
        />

        <button
          className="bg-blue-500 text-white px-2 py-2 rounded hover:bg-blue-600"
          onClick={handleUpload}
          disabled={loading}
        >
          {loading ? "Uploading..." : "Upload CSV"}
        </button>
      </div>

      {message && (
        <div
          style={{
            marginTop: 12,
            padding: 10,
            borderRadius: 6,
            background:
              message.type === "error"
                ? "#ffe6e6"
                : message.type === "success"
                ? "#e6ffec"
                : "#eef6ff",
            color: message.type === "error" ? "#990000" : "#033",
          }}
        >
          {message.text}
        </div>
      )}
    </div>
  );
};

export default SoilUploaderForm;
