import React from "react";
import { ImageOverlay } from "react-leaflet";

const AerialImage = ({ aerialImagehandlerPass }) => {
  return (
    <>
      {aerialImagehandlerPass === 2019 ||
        ("All" && aerialImagehandlerPass !== "None" && (
          <ImageOverlay
            url="/tiles/Großmutz_2019_BGR.png"
            bounds={[
              [52.94235, 13.13531],
              [52.93329, 13.11779],
            ]}
            opacity={8}
          />
        ))}
      {aerialImagehandlerPass === 2020 ||
        ("All" && aerialImagehandlerPass !== "None" && (
          <ImageOverlay
            url="/tiles/Großmutz_2022_BGR.png"
            bounds={[
              [52.93904, 13.13048],
              [52.93407, 13.12338],
            ]}
            opacity={8}
          />
        ))}
    </>
  );
};

export default AerialImage;
