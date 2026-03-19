import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

function UploadPDF({ onUploadSuccess }) {
  const executeUpload = async (fileToUpload) => {
    const token = localStorage.getItem("token");
    const formData = new FormData();
    formData.append("file", fileToUpload);
    try {
      await axios.post(`${API_URL}/upload`, formData, {
        withCredentials: true, 
        headers: { 
          "Content-Type": "multipart/form-data",
          "Authorization": `Bearer ${token}`
        }
      });
      onUploadSuccess();
    } catch (error) {
      alert("Upload failed.");
    }
  };

  return (
    <label className="flex items-center justify-center gap-3 bg-white/5 border border-white/10 hover:border-violet-500/50 hover:bg-white/10 px-4 py-2 rounded-full cursor-pointer transition-all group">
      <svg className="w-4 h-4 text-violet-400 group-hover:scale-110 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
      </svg>
      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">New PDF</span>
      <input type="file" accept="application/pdf" onChange={(e) => executeUpload(e.target.files[0])} className="hidden" />
    </label>
  );
}

export default UploadPDF;