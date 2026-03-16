import axios from "axios";

function UploadPDF() {
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post("http://localhost:8000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("PDF uploaded successfully");
    } catch (error) {
      console.error(error);
      alert("Error uploading PDF");
    }
  };

  return (
    <div className="group relative bg-slate-900/50 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 transition-all hover:border-indigo-500/50 shadow-2xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-indigo-400">01.</span> Upload Document
      </h2>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-slate-700 rounded-xl cursor-pointer hover:bg-slate-800/50 transition-colors">
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <svg className="w-8 h-8 mb-3 text-slate-400 group-hover:text-indigo-400 transition-colors" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
          <p className="text-sm text-slate-400">Click to upload or drag and drop</p>
        </div>
        <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
      </label>
    </div>
  );
}

export default UploadPDF;