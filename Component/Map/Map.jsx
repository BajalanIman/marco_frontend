import { useEffect, useState } from "react";
import FilterTrees from "./FilterTrees";
import LeafletContainer from "./LeafletContainer";

function Map() {
  const [plots, setPlots] = useState([]);
  const [trees, setTrees] = useState([]);
  const [zoomLevel, setZoomLevel] = useState(8);
  const [selectedSpecies, setSelectedSpecies] = useState([]);

  // Fetch data
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

  // Get unique species
  const speciesOptions = Array.from(
    new Set(trees.map((t) => t.species))
  ).sort();

  // Filtered trees
  const filteredTrees =
    selectedSpecies.length === 0 || selectedSpecies.includes("ALL")
      ? trees
      : trees.filter((tree) => selectedSpecies.includes(tree.species));

  return (
    <div className=" flex justify-start w-full">
      {/* Filter dropdown */}
      {zoomLevel > 14 ? (
        <FilterTrees
          trees={trees}
          selectedSpecies={selectedSpecies}
          setSelectedSpecies={setSelectedSpecies}
          speciesOptions={speciesOptions}
        />
      ) : (
        <div className="w-96 pr-16">
          <p className="text-justify pt-2">
            Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam
            nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam
            erat, sed diam voluptua. At vero eos et accusam et justo duo dolores
            et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est
            Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur
            sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore
            et dolore magna aliquyam erat, sed diam voluptua. At vero eos et
            accusam et justo duo dolores et ea rebum.
          </p>
        </div>
      )}
      <LeafletContainer
        zoomLevel={zoomLevel}
        setZoomLevel={setZoomLevel}
        plots={plots}
        filteredTrees={filteredTrees}
      />
    </div>
  );
}

export default Map;
