import React, { useState } from "react";
import HelpPopUp from "./HelpPopUp";
import HelpSVG from "./HelpSVG";

const studySubjects = [
  { subject: "Forestry" },
  { subject: "Agroforestry" },
  { subject: "Agriculture" },
  { subject: "Plant Pathology" },
  { subject: "Soil Science" },
  { subject: "Environmental Science" },
  { subject: "Ecology" },
  { subject: "Zoology" },
];

export default function ResearchUploaderForm({ plotId }) {
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [helpMessage, setHelpMessage] = useState("");

  const [formData, setFormData] = useState({
    plotId: plotId,
    fullName: "",
    year: "",
    subject: "",
    title: "",
    reportUrl: "",
    excelUrl: "",
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Form submitted:", formData);

    // Example: send data to backend API
    // fetch("/api/upload", {
    //   method: "POST",
    //   headers: { "Content-Type": "application/json" },
    //   body: JSON.stringify(formData),
    // });
  };

  return (
    <div className="w-full flex justify-center p-4">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-lg bg-white shadow-lg rounded-lg p-6 space-y-4"
      >
        <h2 className="text-xl font-bold text-gray-800 text-center">
          Studen Research Upload
        </h2>

        {/* Full Name */}
        <div>
          <label className="block font-medium mb-1">Student Name</label>
          <input
            type="text"
            name="fullName"
            placeholder="Your full name"
            value={formData.fullName}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Year of Study */}
        <div>
          <input
            type="number"
            name="year"
            placeholder="For example 2025"
            value={formData.year}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Study Subject */}
        <div>
          <HelpSVG
            label={"Study Subject"}
            setIsPopupOpen={setIsPopupOpen}
            setHelpMessage={() =>
              setHelpMessage("Please choose a study subject.")
            }
          />
          <select
            name="subject"
            value={formData.subject}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          >
            <option value="" disabled>
              -- Select Subject --
            </option>
            {studySubjects.map((s) => (
              <option key={s.subject} value={s.subject}>
                {s.subject}
              </option>
            ))}
          </select>
        </div>

        {/* Title */}
        <div>
          <HelpSVG
            label={"Title"}
            setIsPopupOpen={setIsPopupOpen}
            setHelpMessage={() =>
              setHelpMessage("Please enter a title for your work.")
            }
          />
          <input
            type="text"
            name="title"
            value={formData.title}
            onChange={handleChange}
            maxLength={300}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
          <p className="text-sm text-gray-500">
            {formData.title.length}/300 characters
          </p>
        </div>

        {/* Report PDF URL */}
        <div>
          <HelpSVG
            label={"Report PDF URL"}
            setIsPopupOpen={setIsPopupOpen}
            setHelpMessage={() =>
              setHelpMessage("Please provide the URL of your report.")
            }
          />
          <input
            type="url"
            name="reportUrl"
            placeholder="For example: https://drive.google.com/file/d/1XikqvibXn"
            value={formData.reportUrl}
            onChange={handleChange}
            required
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Excel Report URL (optional) */}
        <div>
          <HelpSVG
            label={"Report PDF URL"}
            setIsPopupOpen={setIsPopupOpen}
            setHelpMessage={() =>
              setHelpMessage(
                "Please provide the URL of your Excel file, if available."
              )
            }
          />
          <input
            type="url"
            name="excelUrl"
            placeholder="For example: https://docs.google.com/d/e/2PACX"
            value={formData.excelUrl}
            onChange={handleChange}
            className="w-full border border-gray-300 rounded p-2"
          />
        </div>

        {/* Submit */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
        >
          Submit
        </button>
      </form>
      <HelpPopUp
        isOpen={isPopupOpen}
        onClose={() => setIsPopupOpen(false)}
        helpMessage={helpMessage}
      />
    </div>
  );
}
