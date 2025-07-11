import { useEffect, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import AreaDetails from "./AreaDetails";
import PlotForm from "./PlotForm";
import { ChevronsDown, ChevronsUp, CircleX } from "lucide-react";
import TreeForm from "./TreeForm";
import PlotsList from "./PlotsList";
import TreeViewForm from "./TreeViewForm";
import VideoForm from "./VideoForm";

const Setting = () => {
  const [assignedArea, setAssignedArea] = useState(null);
  const [user, setUser] = useState(null);
  const [showPlotMaker, setShowPlotMaker] = useState(false);
  const [showTreeMaker, setShowTreeMaker] = useState(false);

  const [selectedPlotIndex, setSelectedPlotIndex] = useState(null);
  const [selectedPlot, setSelectedPlot] = useState(null);

  useEffect(() => {
    const storedUser = JSON.parse(localStorage.getItem("marco_user"));
    setUser(storedUser);

    if (storedUser && storedUser.role === "admin") {
      axios
        .get(`/api/area-admins/${storedUser.user_id}`)
        .then((res) => {
          const areaId =
            res.data.areaId ||
            res.data.area_id ||
            res.data.areas?.[0] ||
            res.data[0]?.areaId;

          setAssignedArea(areaId);
        })
        .catch((err) => console.error("Failed to fetch area:", err));
    }
  }, []);

  if (!user) return <p>Loading...</p>;

  return (
    <div className="w-full flex justify-center">
      <div className="pl-2 pr-2 lg:w-[800px] h-[100%]">
        <h2 className="text-xl text-center py-5 font-bold">
          Welcome, {user.full_name}
        </h2>
        {user.role === "admin" && assignedArea && (
          <div className="flex flex-col gap-3">
            <p className="pl-2">You are responsible for this area:</p>

            <AreaDetails areaId={assignedArea} />

            {/* new plots */}
            <div className="bg-gray-100 rounded-xl shadow-sm">
              <div
                className="flex justify-between py-3 px-5 "
                onClick={() => {
                  setShowPlotMaker(!showPlotMaker);
                }}
              >
                <p>Adding new plot</p>
                {!showPlotMaker && <ChevronsDown />}
                {showPlotMaker && <ChevronsUp />}
              </div>
              {showPlotMaker && <PlotForm areaId={assignedArea} />}
            </div>
            {/* Plots list */}
            <div>
              <p className="pl-4">Please select Your plot!</p>
              <PlotsList
                areaId={assignedArea}
                selectedPlotIndex={selectedPlotIndex}
                setSelectedPlotIndex={setSelectedPlotIndex}
                selectedPlot={selectedPlot}
                setSelectedPlot={setSelectedPlot}
              />
            </div>
            {/* New trees */}
            {selectedPlot && (
              <div className="bg-gray-100 rounded-xl shadow-sm">
                <div
                  className="flex justify-between py-3 px-5 "
                  onClick={() => {
                    setShowTreeMaker(!showTreeMaker);
                  }}
                >
                  <span className="flex">
                    <p>Adding new trees </p>
                    {selectedPlot && (
                      <p className="pl-1">to {selectedPlot.plot_name}</p>
                    )}
                  </span>
                  {!showTreeMaker && <ChevronsDown />}
                  {showTreeMaker && <ChevronsUp />}
                </div>
                {showTreeMaker && (
                  <TreeForm
                    areaId={assignedArea}
                    plotId={selectedPlot.plot_id}
                  />
                )}
              </div>
            )}
            {selectedPlot && <VideoForm />}
            {selectedPlot && <TreeViewForm />}
          </div>
        )}
      </div>
      <div className=" fixed top-3 left-3  rounded-full p-1 ">
        <Link to="/">
          <CircleX
            fill="black"
            color="white"
            style={{ width: "32px", height: "32px" }}
          />
        </Link>
      </div>
    </div>
  );
};

export default Setting;
