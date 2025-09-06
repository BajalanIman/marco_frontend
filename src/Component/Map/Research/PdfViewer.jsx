export default function PdfViewer() {
  const fileId = "1XikqvibXnFuz9GQ5A51Kyoq-JWGrF-nI"; // Replace with your file ID

  // For showing inside the page
  const previewUrl = `https://drive.google.com/file/d/${fileId}/preview`;

  // For downloading
  const downloadUrl = `https://drive.google.com/uc?export=download&id=${fileId}`;

  return (
    <div className="w-full h-screen flex flex-col pt-5 bg-[#1d1e1e]">
      {/* PDF Viewer */}
      <div className="flex-1 rounded-t-lg  overflow-hidden shadow-lg ">
        <iframe
          src={previewUrl}
          className="w-full h-full"
          allow="autoplay"
        ></iframe>
      </div>

      {/* Download button */}
      <div className="p-3 bg-[#1d1e1e] flex justify-center">
        <a
          href={downloadUrl}
          className="px-4 py-2 bg-blue-600 text-white rounded shadow hover:bg-blue-700"
        >
          Download PDF
        </a>
      </div>
    </div>
  );
}
