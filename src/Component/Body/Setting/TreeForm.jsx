import React, { useState } from "react";
import ReactFileReader from "react-file-reader";
import PopupModal from "./PopupModal";
import { BASE_URL } from "../../../constants/constants";

const TreeForm = ({ areaId, plotId }) => {
  const [dataFromCSV, setDataFromCSV] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [newMessage, setNewMessage] = useState("");

  // console.log(plotId);

  const handleFiles = (files) => {
    let reader = new FileReader();
    reader.onload = function (e) {
      const csvData = reader.result;
      const lines = csvData.split(/\r\n|\n/);
      const headers = lines[0].split(",").map((h) => h.trim());
      const data = [];

      for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(",");
        if (values.length === headers.length) {
          const entry = {};
          for (let j = 0; j < headers.length; j++) {
            const header = headers[j];
            const value = values[j];

            // Map CSV headers to Prisma-compatible keys
            switch (header) {
              case "ODMF_Name":
                entry.odmf_name = value;
                break;
              case "Tree_No.":
                entry.tree_no = value;
                break;
              case "Tree_Spec.":
                entry.species = value;
                break;
              case "species_code":
                entry.species_code = value;
                break;
              case "Row_ID":
                entry.row_id = value;
                break;
              case "Latitude":
                entry.latitude = value;
                break;
              case "Longitude":
                entry.longitude = value;
                break;
              case "Elevation":
                entry.elevation = value;
                break;
              case "Height":
                entry.height = value;
                break;
              case "year of pl":
                entry.year_planted = value;
                break;
              case "Comment":
                entry.comment = value;
                break;
              case "ODMF_ID":
                entry.odmf_id = value;
                break;
              case "Tree_Plot":
                entry.tree_plot = value;
                break;
              case "Tree_letter":
                entry.tree_letter = value;
                break;
              default:
                break;
            }
          }
          data.push(entry);
        }
      }

      setDataFromCSV(data);
    };
    reader.readAsText(files[0]);
  };

  console.log(dataFromCSV);

  const submitDataHandler = async () => {
    try {
      const response = await fetch(`${BASE_URL}api/trees`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          trees: dataFromCSV,
          plotId: plotId,
        }),
      });
      const result = await response.json();
      console.log(plotId);
      if (result.message) {
        setShowModal(true);
        setNewMessage(result.message);
      } else if (result.error) {
        setShowModal(true);
        setNewMessage(result.error);
      }

      console.log("Server response:", result);
    } catch (error) {
      console.error("Error sending data:", error);
    }
  };

  return (
    <div className="space-y-4 py-4 px-2 bg-gray-100 rounded-xl">
      <p>Area Id: {areaId}</p>
      <ReactFileReader handleFiles={handleFiles} fileTypes={[".csv"]}>
        <button className="btn bg-blue-600 text-white py-2  w-28 rounded">
          Upload
        </button>
      </ReactFileReader>
      <button
        className="btn bg-green-600 text-white py-2  w-28 rounded"
        onClick={submitDataHandler}
        // onClick={async () => {
        //   try {
        //     const response = await fetch(`${BASE_URL}api/trees`, {
        //       method: "POST",
        //       headers: {
        //         "Content-Type": "application/json",
        //       },
        //       body: JSON.stringify({
        //         trees: dataFromCSV,
        //         plotId: plotId, // Pass plotId with it
        //       }),
        //     });

        //     const result = await response.json();
        //     console.log("test 1");
        //     console.log("Server response:", result);
        //   } catch (error) {
        //     console.log(12345);
        //     console.error("Error sending data:", error);
        //   }
        // }}
      >
        Send data
      </button>
      {/* Display table if dataFromCSV has items */}
      {dataFromCSV.length > 0 && (
        <div className="flex justify-center items-center h-96 overflow-auto w-[400px] sm:w-[600px] md:w-[750px] lg:w-[750px]">
          <table>
            <thead>
              <tr>
                {Object.keys(dataFromCSV[0]).map((key, index) => (
                  <th
                    key={index}
                    className="bg-green-200 font-serif text-xs p-1 py-2"
                  >
                    {key}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {dataFromCSV.map((row, rowIndex) => (
                <tr key={rowIndex}>
                  {Object.values(row).map((value, columnIndex) => (
                    <td
                      className="bg-green-100 font-serif text-xs p-1 py-2"
                      key={columnIndex}
                    >
                      {value}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
      {showModal && (
        <PopupModal
          message={`${newMessage} !`}
          onClose={() => (setShowModal(false), window.location.reload())}
        />
      )}
    </div>
  );
};

export default TreeForm;
