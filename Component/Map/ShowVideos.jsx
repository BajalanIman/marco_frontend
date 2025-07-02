import React, { useEffect, useState } from "react";
import axios from "axios";

const ShowVideos = ({ treeId }) => {
  const [treeVideos, setTreeVideos] = useState([]);

  useEffect(() => {
    if (!treeId) return;

    const fetchTreeVideos = async () => {
      try {
        const res = await axios.get(`/api/tree/${treeId}/videos`);
        setTreeVideos(res.data);
      } catch (err) {
        console.error("Error fetching tree videos:", err);
        setTreeVideos([]);
      }
    };

    fetchTreeVideos();
  }, [treeId]);

  return (
    <div
      style={{
        fontFamily: "Arial, sans-serif",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        width: 400,
      }}
    >
      <h3>Tree ID: {treeId}</h3>

      {treeVideos.length === 0 ? (
        <p>No videos found for this tree.</p>
      ) : (
        // <p>No videos found for this tree.</p>
        <>
          {/* <p>{treeVideos.length} video(s) found for this tree:</p> */}
          <div style={{ display: "flex", flexDirection: "column" }}>
            {treeVideos.map((tv) => (
              <div
                key={tv.tree_view_id}
                style={{
                  border: "1px solid #ccc",
                  borderRadius: "8px",
                  boxShadow: "0 2px 5px rgba(0, 0, 0, 0.05)",
                }}
              >
                {/* <h4 style={{ marginBottom: "0.5rem" }}>
                  {tv.video?.video_name || "Untitled Video"}
                </h4> */}
                <iframe
                  width="350px"
                  height="200"
                  src={`${tv.video.video_url_id}?start=${tv.start_seconds}`}
                  title={`Tree Video ${tv.tree_view_id}`}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  style={{ borderRadius: "6px" }}
                ></iframe>
                <p style={{ marginTop: "0.5rem", color: "#555" }}>
                  ▶ Start Time: {tv.start_seconds}s
                </p>
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default ShowVideos;
