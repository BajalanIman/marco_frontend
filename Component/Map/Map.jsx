import { useEffect, useState } from "react";
import FilterTrees from "./FilterTrees";
import LeafletContainer from "./LeafletContainer";
import ShowVideos from "./ShowVideos";

function Map() {
  const [plots, setPlots] = useState([]);
  const [trees, setTrees] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [selectedSpecies, setSelectedSpecies] = useState([]);
  const [treeVideo, setTreeVideo] = useState({});
  const [showFilter, setShowFilter] = useState(true);
  const [showPanorama, setShowPanorama] = useState(false);
  const [showVideo, setShowVideo] = useState(false);

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

  // Filter trees
  const filteredTrees =
    selectedSpecies.length === 0 || selectedSpecies.includes("ALL")
      ? trees
      : trees.filter((tree) => selectedSpecies.includes(tree.species));

  return (
    <div className="flex justify-start w-full">
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
                }}
                className={`w-[70px] py-2 rounded ${
                  showPanorama && (!treeVideo.tree_id || !showVideo)
                    ? "bg-[#10bc98] text-white shadow-lg border border-slate-400"
                    : "bg-slate-200 text-black shadow-lg border border-slate-400"
                }`}
              >
                360°
              </button>

              {/* Video Button – only show if tree has video */}
              {treeVideo?.tree_id && !showFilter && !showPanorama && (
                <button
                  onClick={() => {
                    setShowFilter(false);
                    setShowPanorama(false);
                    setShowVideo(true);
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

            <hr className="w-[80%]" />

            {/* Panel content */}
            <div className="h-64 flex w-[400px]">
              {showFilter && !treeVideo.tree_id && (
                <FilterTrees
                  trees={trees}
                  selectedSpecies={selectedSpecies}
                  setSelectedSpecies={setSelectedSpecies}
                  speciesOptions={speciesOptions}
                />
              )}

              {showPanorama && !treeVideo.tree_id && (
                <iframe
                  src="https://vr-easy.com/27323/"
                  allowFullScreen
                  name="idIframe"
                  className="h-[250px] pr-5 pt-2"
                  width={!treeVideo.tree_id ? "400px" : "300px"}
                ></iframe>
              )}

              {treeVideo.tree_id && showVideo && (
                <ShowVideos treeId={treeVideo.tree_id} />
              )}
            </div>
          </div>
        </>
      ) : (
        <div className="w-[400px] pr-16">
          <p className="text-justify pt-2">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet.
          </p>
        </div>
      )}

      {/* Map container */}
      <LeafletContainer
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        plots={plots}
        filteredTrees={filteredTrees}
        setTreeVideo={setTreeVideo}
        setShowVideo={setShowVideo}
        setShowFilter={setShowFilter}
        setShowPanorama={setShowPanorama}
      />
    </div>
  );
}

export default Map;
