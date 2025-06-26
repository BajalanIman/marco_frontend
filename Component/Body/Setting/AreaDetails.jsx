import { useEffect, useState } from "react";
import axios from "axios";

const AreaDetails = ({ areaId }) => {
  const [area, setArea] = useState(null);

  useEffect(() => {
    if (areaId) {
      axios
        .get(`/api/areas/${areaId}`)
        .then((res) => {
          //   console.log(res);
          setArea(res.data);
        })
        .catch((err) => {
          console.error("Failed to fetch area info:", err);
        });
    }
  }, [areaId]);

  if (!area) return <p>Loading area info...</p>;

  return (
    <div className="p-4 border rounded-xl shadow-sm">
      <h3 className="text-lg font-semibold">{area.area_name}</h3>
      <p className="text-sm text-gray-600">{area.area_information}</p>
    </div>
  );
};

export default AreaDetails;
