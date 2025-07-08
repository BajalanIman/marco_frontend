import React from "react";
import Map from "../Map/Map";
import { Link } from "react-router-dom";

import NavBar from "../NavigationBar/NavBar";

function Mainbody() {
  // const areaName = "Area: Großmutz";

  return (
    <>
      <div className=" w-[full] lg:w-[100%] h-screen flex justify-center items-center">
        <div className=" px-2 lg:w-[1200px] h-[100%]">
          <NavBar />
          {/* {areaName && (
            <h1 className="w-[100%] pl-5 py-5 font-bold  text-center">
              {areaName}
            </h1>
          )} */}
          <div className="flex justify-center items-center gap-5 mt-6">
            <Map />
            {/* <div className="w-[45%] border border-gray-500 p-3 h-[400px]">
              <p>information</p>
              <p>langitude:</p>
              <p>Latitude: </p>
            </div> */}
          </div>
        </div>
      </div>
    </>
  );
}

export default Mainbody;
