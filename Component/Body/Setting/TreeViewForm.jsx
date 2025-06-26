import React, { useState } from "react";
import Papa from "papaparse";

const TreeViewForm = () => {
  const [csvFile, setCsvFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [result, setResult] = useState("");

  const handleFileChange = (e) => {
    setCsvFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!csvFile) return;

    setUploading(true);

    Papa.parse(csvFile, {
      header: true,
      complete: async (results) => {
        const parsedData = results.data;

        try {
          const res = await fetch("http://localhost:8800/tree-view/import", {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({ data: parsedData }),
          });

          const json = await res.json();
          setResult(json.message || "Import completed.");
        } catch (err) {
          console.error(err);
          setResult("Error uploading file.");
        } finally {
          setUploading(false);
        }
      },
      error: (err) => {
        console.error("CSV Parse Error:", err);
        setUploading(false);
      },
    });
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-xl shadow">
      <h1 className="text-xl font-bold mb-4">Upload Tree View CSV</h1>
      <input
        type="file"
        accept=".csv"
        onChange={handleFileChange}
        className="mb-4"
      />
      <button
        onClick={handleUpload}
        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
        disabled={uploading}
      >
        {uploading ? "Uploading..." : "Upload"}
      </button>
      {result && <p className="mt-4 text-green-600">{result}</p>}
    </div>
  );
};

export default TreeViewForm;
