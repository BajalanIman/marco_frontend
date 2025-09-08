import React, { useState } from "react";
import axios from "axios";
import { ChevronsDown, ChevronsUp } from "lucide-react";
import { BASE_URL } from "../../../constants/constants";

const VideoForm = () => {
  const [videoData, setVideoData] = useState({
    video_name: "",
    video_url_id: "",
    recorded_at: "",
  });

  const [message, setMessage] = useState("");
  const [showForm, setShowForm] = useState(false); // Toggle state
  const [showPreview, setShowPreview] = useState(false); // 👈 New state

  const handleChange = (e) => {
    setVideoData({ ...videoData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const payload = {
        ...videoData,
        video_url_id: `https://www.youtube.com/embed/${videoData.video_url_id}`,
      };

      const res = await axios.post(`${BASE_URL}video`, payload);
      setMessage("Video submitted successfully!");
      console.log("Video created:", res.data);
      setVideoData({
        video_name: "",
        video_url_id: "",
        recorded_at: "",
      });
      setShowPreview(false);
      setMessage("Video was submited!!!");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } catch (err) {
      console.error(err);
      setMessage("Failed to submit video.");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    }
  };

  const toggleForm = () => {
    setShowForm(!showForm);
    setMessage("");
  };

  const handlePreview = (e) => {
    e.preventDefault();
    setShowPreview(true);
  };

  return (
    <div
      style={{ padding: "1rem" }}
      className="bg-gray-100 p-4 border rounded-xl shadow-sm border-gray-300"
    >
      <div onClick={toggleForm} className="flex justify-between p-[1px]">
        <button>Add a New Video</button>
        {!showForm && <ChevronsDown />}
        {showForm && <ChevronsUp />}
      </div>
      <div className="lg:flex lg:justify-between ">
        <div className="lg:w-1/2">
          {showForm && (
            <form onSubmit={handleSubmit}>
              <div className=" flex flex-col gap-1 mt-4">
                <label>Video Name:</label>
                <input
                  className="lg:w-72 h-8 p-2 border-[1px] border-gray-200 rounded-sm"
                  placeholder="A name for video"
                  type="text"
                  name="video_name"
                  value={videoData.video_name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className=" flex flex-col gap-1 mt-4">
                <label>Video URL:</label>
                <input
                  className="lg:w-72 h-8 p-2 border-[1px] border-gray-200 rounded-sm"
                  placeholder="A video URL"
                  type="text"
                  name="video_url_id"
                  value={videoData.video_url_id}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className=" flex flex-col gap-1 mt-4">
                <label>Recorded At:</label>
                <input
                  className="lg:w-72 h-8 p-2 border-[1px] border-gray-200 rounded-sm"
                  type="datetime-local"
                  name="recorded_at"
                  value={videoData.recorded_at}
                  onChange={handleChange}
                />
              </div>
              <div className="flex gap-4 alin-center pl-2 my-4">
                <button
                  type="submit"
                  className="bg-green-600 text-white px-4 py-2 rounded"
                >
                  Submit Video
                </button>
                <button
                  className="bg-blue-600 text-white px-4 py-2 rounded"
                  onClick={handlePreview}
                >
                  Preview video
                </button>
              </div>
            </form>
          )}
        </div>
        <div className="lg:w-1/2">
          {showPreview && videoData.video_url_id && showForm && (
            <div className="mt-4">
              <iframe
                width="100%"
                height="315"
                src={`https://www.youtube.com/embed/${videoData.video_url_id}`}
                title="YouTube video preview"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              ></iframe>
            </div>
          )}
        </div>
      </div>
      {message && <p className="text-black pt-2">{message}</p>}
    </div>
  );
};

export default VideoForm;
