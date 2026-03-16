import axios from "axios";


const API_URL = import.meta.env.VITE_API_URL;

function UploadPDF() {
  const handleUpload = async (event) => {
    const file = event.target.files[0];
    if (!file) return;
    const formData = new FormData();
    formData.append("file", file);

    try {
      await axios.post(`${API_URL}/upload`, formData, {
        headers: { "Content-Type": "multipart/form-data" }
      });
      alert("PDF Analyzed Successfully");
    } catch (error) {
      alert("Analysis Failed");
    }
  };

  return (
    <div className="group relative bg-[#0f051a]/60 border border-violet-500/10 backdrop-blur-2xl rounded-3xl p-8 transition-all hover:border-violet-500/40 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-2xl font-bold text-white tracking-tight">Upload Core</h2>
          <p className="text-violet-400/60 text-sm">Feed the engine your documents</p>
        </div>
        <div className="p-3 bg-violet-600/20 rounded-2xl border border-violet-500/20">
          <svg className="w-6 h-6 text-violet-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
          </svg>
        </div>
      </div>
      
      <label className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed border-violet-900/50 rounded-2xl cursor-pointer hover:bg-violet-600/5 hover:border-violet-500/50 transition-all group/label">
        <div className="text-center">
          <p className="text-slate-300 font-medium group-hover/label:text-violet-300 transition-colors">Select PDF Document</p>
          <p className="text-xs text-slate-500 mt-1 uppercase tracking-widest">CLICK HERE TO UPLOAD</p>
        </div>
        <input type="file" accept="application/pdf" onChange={handleUpload} className="hidden" />
      </label>
    </div>
  );
}

export default UploadPDF;