import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function UploadPDF({ onUploadSuccess }) {
  
  // 1. Separate API logic function
  const executeUpload = async (fileToUpload) => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      alert("Session expired. Please login.");
      return;
    }

    const formData = new FormData();
    formData.append("file", fileToUpload);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        // Crucial for cross-origin requests with cookies/auth
        withCredentials: true, 
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      
      alert("Neural indexing complete.");
      if (onUploadSuccess) onUploadSuccess();
    } catch (error) {
      console.error("API Error:", error);
      throw error; // Let the caller handle the UI alert if needed
    }
  };

  // 2. User action handler
  const handleFileChange = async (event) => {
    const file = event.target.files[0];
    if (!file) return;

    try {
      await executeUpload(file);
    } catch (err) {
      alert(err.response?.data?.detail || "Upload failed");
    }
  };

  return (
    <div className="group relative bg-[#0f051a]/60 border border-violet-500/10 backdrop-blur-2xl rounded-3xl p-6 transition-all hover:border-violet-500/30">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-lg font-bold text-white">Upload Core</h2>
          <p className="text-violet-400/50 text-xs">PDF format only</p>
        </div>
        <div className="p-2 bg-violet-600/20 rounded-xl border border-violet-500/20">
          <svg className="w-5 h-5 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
          </svg>
        </div>
      </div>
      
      <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-dashed border-violet-900/40 rounded-2xl cursor-pointer hover:bg-violet-600/5 transition-all">
        <p className="text-xs text-slate-400 font-bold tracking-widest uppercase">Select File</p>
        <input type="file" accept="application/pdf" onChange={handleFileChange} className="hidden" />
      </label>
    </div>
  );
}

export default UploadPDF;