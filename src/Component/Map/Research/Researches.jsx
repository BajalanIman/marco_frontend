import React, { useEffect, useState } from "react";
import ExcelViewer from "./ExcelViewer";
import PdfViewer from "./PdfViewer";

const Researches = () => {
  const [defineYear, setDefineYear] = useState(null);
  const [defineSubject, setDefineSubject] = useState("");
  const [defineTitle, setDefineTitle] = useState("");
  const [message, setMessage] = useState("");

  const years = [
    { year: 2016 },
    { year: 2017 },
    { year: 2018 },
    { year: 2019 },
    { year: 2020 },
    { year: 2021 },
    { year: 2022 },
    { year: 2023 },
    { year: 2024 },
    { year: 2025 },
  ];

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

  const studyTitles = [
    { title: "Schmetterlinge nach AFS Monitoring Münster" },
    {
      title: "Hummeln und Wildbienen in der Agroforst",
    },
  ];

  useEffect(() => {
    if (defineYear !== 2025 && defineYear !== null) {
      setMessage("No data is available for this year!");
      setTimeout(() => {
        setMessage("");
      }, 5000);
    } else if (
      defineYear === 2025 &&
      defineSubject !== "" && // only run if subject is selected
      defineSubject !== "Agroforestry"
    ) {
      setMessage("This subject doesn't have any item!");
      setTimeout(() => {
        setMessage();
      }, 5000);
    } else {
      setMessage("");
    }
  }, [defineYear, defineSubject]);

  const [showReport, setShowReport] = useState(true);
  const [showData, setShowData] = useState(false);

  const showReportHandler = () => {
    setShowReport(true);
    setShowData(false);
  };

  const showDataHandler = () => {
    setShowReport(false);
    setShowData(true);
  };

  return (
    <div className="w-full  p-4">
      <hr className="mt-5 mb-3" />
      <div
        className={` border border-gray-300 shadow-lg bg-blue-200 rounded-md mb-3 p-3${
          defineYear === 2025 ? " lg:flex gap-2" : ""
        }`}
      >
        {/* Year dropdown */}
        <div className=" lg:w-full">
          <p className="font-bold mb-2 pl-2">Please select a year!</p>
          <select
            value={defineYear || ""}
            onChange={(e) => setDefineYear(Number(e.target.value))}
            className="w-full p-2 border border-gray-400 rounded"
          >
            <option value="" disabled>
              -- Select Year --
            </option>
            {years.map((i) => (
              <option key={i.year} value={i.year}>
                {i.year}
              </option>
            ))}
          </select>
        </div>

        {/* Subject dropdown */}
        {defineYear === 2025 ? (
          <div className="lg:w-full ">
            <p className="font-bold mb-2 pl-2">
              Please select a study subject!
            </p>
            <select
              value={defineSubject || ""}
              onChange={(e) => setDefineSubject(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded"
            >
              <option value="" disabled>
                -- Select Subject --
              </option>
              {studySubjects.map((i) => (
                <option key={i.subject} value={i.subject}>
                  {i.subject}
                </option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )}
        {/* Title dropdown */}
        {defineSubject === "Agroforestry" && defineYear === 2025 ? (
          <div className="lg:w-full ">
            <p className="font-bold mb-2 pl-2">Please select a title!</p>
            <select
              value={defineTitle || ""}
              onChange={(e) => setDefineTitle(e.target.value)}
              className="w-full p-2 border border-gray-400 rounded"
            >
              <option value="" disabled>
                -- Select title --
              </option>
              {studyTitles.map((i) => (
                <option key={i.title} value={i.title}>
                  {i.title}
                </option>
              ))}
            </select>
          </div>
        ) : (
          ""
        )}
      </div>
      {message && (
        <div className="border border-gray-300 shadow-lg bg-blue-200 rounded-md mb-3 p-3 flex justify-center font-bold">
          <p className="text-red-600">{message}</p>
        </div>
      )}
      {/* Action buttons */}
      {defineSubject === "Agroforestry" &&
      defineYear === 2025 &&
      defineTitle === "Schmetterlinge nach AFS Monitoring Münster" ? (
        <div className="flex mt-5 gap-3 justify-center">
          <button
            onClick={showReportHandler}
            className="w-[70px] py-2 rounded bg-slate-200 text-black shadow-lg border border-slate-400"
          >
            Report
          </button>
          <button
            onClick={showDataHandler}
            className="w-[70px] py-2 rounded bg-slate-200 text-black shadow-lg border border-slate-400"
          >
            Data
          </button>
        </div>
      ) : (
        ""
      )}
      {/* Viewers */}
      {showReport &&
        defineSubject === "Agroforestry" &&
        defineYear === 2025 &&
        defineTitle === "Schmetterlinge nach AFS Monitoring Münster" && (
          <div className="border border-gray-200 mt-5 rounded-lg overflow-hidden shadow-lg">
            <PdfViewer />
          </div>
        )}
      {showData &&
        defineSubject === "Agroforestry" &&
        defineYear === 2025 &&
        defineTitle === "Schmetterlinge nach AFS Monitoring Münster" && (
          <ExcelViewer />
        )}
    </div>
  );
};

export default Researches;
