import { useEffect, useState } from "react";
import FilterTrees from "./FilterTrees";
import LeafletContainer from "./LeafletContainer";
import ShowVideos from "./ShowVideos";
import FilterYear from "./FilterYear";
import SoilSamplesTable from "./Soil/SoilSamplesTable";
import SoilInformationOnMap from "./Soil/SoilInformationOnMap";
import Researches from "./Research/Researches";

function Map() {
  const [plots, setPlots] = useState([]);
  const [trees, setTrees] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [selectedYear, setSelectedSYear] = useState([]);
  const [treeVideo, setTreeVideo] = useState({});
  const [showFilter, setShowFilter] = useState(true);
  const [showPanorama, setShowPanorama] = useState(false);
  const [showVideo, setShowVideo] = useState(false);
  const [mapCenter, setMapCenter] = useState(null);
  const [loading, setLoading] = useState(true);
  const [yearBtnColor, setYearBtnColor] = useState(null);
  const [soilLocations, setSoilLocations] = useState([]);
  const [showSoilData, setShowSoilData] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState(null);
  const [researchData, setResearchData] = useState(false);

  const [aerialImagesYear, setAerialImagesYear] = useState([
    { id: 0, year: "None" },
    { id: 1, year: 2019 },
    { id: 2, year: 2020 },
    { id: 3, year: "All" },
  ]);
  const [aerialImagehandlerPass, setAerialImagehandlerPass] = useState(null);

  // useEffect(() => {
  //   console.log("📍 mapCenter updated:", mapCenter);
  // }, [mapCenter]);

  // Fetch plots and trees
  useEffect(() => {
    const fetchData = async () => {
      try {
        const [plotsRes, treesRes] = await Promise.all([
          fetch("http://localhost:8800/api/plots"),
          fetch("http://localhost:8800/api/trees"),
        ]);
        const plotsData = await plotsRes.json();
        const treesData = await treesRes.json();

        setPlots(plotsData);
        setTrees(treesData);

        // Initialize selections after data loads
        if (treesData.length > 0) {
          setSelectedSpecies(["ALL"]);
          setSelectedSYear(["ALL"]);
        }
      } catch (err) {
        console.error("Failed to fetch data", err);
      }
    };
    fetchData();
  }, []);

  // Unique species
  const speciesOptions = Array.from(
    new Set(trees.map((t) => t.species))
  ).sort();

  const yearOptions = Array.from(
    new Set(trees.map((t) => t.year_planted))
  ).sort();

  // Filter trees
  // const filteredTrees =
  //   selectedSpecies.length === 0 || selectedSpecies.includes("ALL")
  //     ? trees
  //     : trees.filter((tree) => selectedSpecies.includes(tree.species));

  const filteredTrees =
    (selectedSpecies.length === 0 || selectedSpecies.includes("ALL")) &&
    (selectedYear.length === 0 || selectedYear.includes("ALL"))
      ? trees
      : trees.filter((tree) => {
          const speciesMatch =
            selectedSpecies.length === 0 || selectedSpecies.includes("ALL")
              ? true
              : selectedSpecies.includes(tree.species);

          const yearMatch =
            selectedYear.length === 0 || selectedYear.includes("ALL")
              ? true
              : selectedYear.includes(String(tree.year_planted)); // Assuming tree.year is the correct property

          return speciesMatch && yearMatch;
        });

  const aerialImagehandler = ({ year }) => {
    setAerialImagehandlerPass(year);
    setYearBtnColor(year);
  };

  return (
    <div className="flex flex-col">
      <div className="lg:flex px-4 lg:px-0 lg:justify-start w-full">
        {zoomLevel > 14 ? (
          <>
            <div className="flex flex-col">
              <div className="flex mb-4 gap-1">
                {/* Species Button */}
                <button
                  onClick={() => {
                    setShowPanorama(false);
                    setShowVideo(false);
                    setTreeVideo({});
                    setShowFilter(true);
                    setShowSoilData(false);
                    setResearchData(false);
                  }}
                  className={`w-[70px] py-2 rounded ${
                    showFilter && (!treeVideo.tree_id || !showVideo)
                      ? "bg-[#10bc98] text-white shadow-lg border border-slate-400"
                      : "bg-slate-200 text-black shadow-lg border border-slate-400"
                  }`}
                >
                  Species
                </button>

                {/* 360 Button */}
                <button
                  onClick={() => {
                    setShowFilter(false);
                    setShowVideo(false);
                    setTreeVideo({});
                    setShowPanorama(true);
                    setShowSoilData(false);
                    setResearchData(false);
                  }}
                  className={`w-[70px] py-2 rounded ${
                    showPanorama && (!treeVideo.tree_id || !showVideo)
                      ? "bg-[#10bc98] text-white shadow-lg border border-slate-400"
                      : "bg-slate-200 text-black shadow-lg border border-slate-400"
                  }`}
                >
                  Image
                </button>

                <button
                  onClick={() => {
                    setShowFilter(false);
                    setShowVideo(false);
                    setTreeVideo({});
                    setShowPanorama(false);
                    setShowSoilData(true);
                    setResearchData(false);
                  }}
                  className={`w-[70px] py-2 rounded ${
                    showSoilData && (!treeVideo.tree_id || !showVideo)
                      ? "bg-[#10bc98] text-white shadow-lg border border-slate-400"
                      : "bg-slate-200 text-black shadow-lg border border-slate-400"
                  }`}
                >
                  Soil
                </button>
                <button
                  onClick={() => {
                    setShowFilter(false);
                    setShowVideo(false);
                    setTreeVideo({});
                    setShowPanorama(false);
                    setShowSoilData(false);
                    setResearchData(true);
                  }}
                  className={`w-[70px] py-2 rounded ${
                    researchData && (!treeVideo.tree_id || !showVideo)
                      ? "bg-[#10bc98] text-white shadow-lg border border-slate-400"
                      : "bg-slate-200 text-black shadow-lg border border-slate-400"
                  }`}
                >
                  Research
                </button>

                {/* Video Button – only show if tree has video */}
                {treeVideo?.tree_id && !showFilter && !showPanorama && (
                  <button
                    onClick={() => {
                      setShowFilter(false);
                      setShowPanorama(false);
                      setShowVideo(true);
                      setShowSoilData(false);
                      setResearchData(false);
                    }}
                    className={`w-[70px] py-2 rounded ${
                      showVideo
                        ? "bg-[#10bc98] text-white shadow-lg border border-slate-400"
                        : "bg-slate-200 text-black shadow-lg border border-slate-400"
                    }`}
                  >
                    Video
                  </button>
                )}
              </div>

              <hr className="w-[95%] lg:w-[80%]" />

              {/* Panel content */}
              <div className="h-72 mb-3 lg:mb-0 lg:h-64 flex w-[400px]">
                {showFilter && !treeVideo.tree_id && (
                  <div className="flex flex-col gap-4 w-96">
                    {mapCenter && trees.some((t) => t.plot_id === mapCenter) ? (
                      <>
                        <FilterTrees
                          trees={trees}
                          selectedSpecies={selectedSpecies}
                          setSelectedSpecies={setSelectedSpecies}
                          speciesOptions={speciesOptions}
                        />
                        <hr className="w-[95%] lg:w-[80%]" />
                        <FilterYear
                          trees={trees}
                          selectedYear={selectedYear}
                          setSelectedSYear={setSelectedSYear}
                          yearOptions={yearOptions}
                        />
                      </>
                    ) : (
                      <div className="w-[400px] lg:w-64 h-full flex justify-center items-center">
                        <p>No data is available!!!</p>
                      </div>
                    )}
                  </div>
                )}

                {zoomLevel > 14 && showSoilData && !treeVideo.tree_id && (
                  <SoilSamplesTable
                    plotId={1}
                    setSoilLocations={setSoilLocations}
                    showSoilData={showSoilData}
                  />
                )}

                {showPanorama && !treeVideo.tree_id && (
                  <div className="flex gap-2 flex-col justify-center">
                    {mapCenter && trees.some((t) => t.plot_id === mapCenter) ? (
                      <div>
                        {aerialImagesYear.map((i) => (
                          <div className="w-[400px] lg:w-64 flex">
                            <button
                              className={`w-96 py-1 border 
                        ${
                          yearBtnColor === i.year
                            ? "bg-[#10bc98] text-white shadow-lg border border-slate-400 mt-3"
                            : "bg-slate-200 text-black shadow-lg border border-slate-400 mt-3"
                        } rounded-md`}
                              key={i.id}
                              onClick={() =>
                                aerialImagehandler({ year: i.year })
                              }
                            >
                              {i.year}
                            </button>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="w-[400px] lg:w-64 h-full flex justify-center items-center">
                        <p>"No image is available!!!"</p>
                      </div>
                    )}
                  </div>
                )}

                {treeVideo.tree_id && showVideo && (
                  <ShowVideos treeId={treeVideo.tree_id} />
                )}
              </div>
            </div>
          </>
        ) : (
          <div className="lg:pr-16 lg:w-[400px]">
            <p className="text-justify py-2">
              The primary objectives of this web tool are to centralize,
              organize, and present data collected from various agroforestry
              sites associated with Eberswalde University of Sustainable
              Development. All relevant information is stored in a structured
              database, allowing for efficient data management and
              accessibility. You can interact with the map interface to explore
              specific locations in greater detail. By zooming in and selecting
              individual plots, additional data and functionalities become
              available, offering a more comprehensive understanding of each
              site.
            </p>
          </div>
        )}

        {/* Map container */}
        <LeafletContainer
          zoomLevel={zoomLevel}
          setZoomLevel={setZoomLevel}
          plots={plots}
          filteredTrees={filteredTrees}
          // filteredYears={filteredYears}
          setTreeVideo={setTreeVideo}
          setShowVideo={setShowVideo}
          setShowFilter={setShowFilter}
          setShowPanorama={setShowPanorama}
          setMapCenter={setMapCenter}
          aerialImagehandlerPass={aerialImagehandlerPass}
          soilLocations={soilLocations}
          showSoilData={showSoilData}
          setSelectedLocation={setSelectedLocation}
        />
        {selectedLocation && (
          <SoilInformationOnMap
            location={selectedLocation}
            onClose={() => setSelectedLocation(null)}
          />
        )}
      </div>

      {zoomLevel > 14 && researchData && !treeVideo.tree_id && (
        <div className="mb-24 h-[100%]">
          <Researches />
        </div>
      )}
    </div>
  );
}

export default Map;
