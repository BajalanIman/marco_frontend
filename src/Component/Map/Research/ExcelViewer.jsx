export default function ExcelViewer() {
  return (
    <div className="w-full h-screen p-4">
      <h1 className="text-xl font-bold mb-4">📊 Sheet Viewer</h1>
      <div className="w-full h-[90vh] border rounded-lg overflow-hidden shadow-lg">
        <iframe
          className="w-full h-full border-0 justify-center"
          src="https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ_3iG30Yoouy_hm2KPhF8m_Nqp5dTRbDSUObqjdksROajCiQUf6U2INFLCz0wUA/pubhtml?widget=true&amp;headers=false"
        ></iframe>
      </div>
    </div>
  );
}
