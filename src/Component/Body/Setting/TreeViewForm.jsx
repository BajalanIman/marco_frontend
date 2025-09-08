import React, { useState } from "react";
import Papa from "papaparse";
import { BASE_URL } from "../../../constants/constants";

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
          const res = await fetch(`${BASE_URL}tree-view/import`, {
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
    <div className="max-w-md mx-auto mt-10 p-4 bg-white rounded-xl mb-5 shadow-sm border border-gray-300">
      <h1 className="text-xl font-bold mb-4">Upload Tree View CSV</h1>
      <div className="flex justify-between items-center">
        <input type="file" accept=".csv" onChange={handleFileChange} />
        <button
          onClick={handleUpload}
          className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          disabled={uploading}
        >
          {uploading ? "Uploading..." : "Upload"}
        </button>
      </div>
      {result && <p className="mt-4 text-green-600">{result}</p>}
    </div>
  );
};

export default TreeViewForm;
