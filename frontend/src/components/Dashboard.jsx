import { useState, useEffect } from "react";
import axios from "axios";
import UploadPDF from "./UploadPDF";
import ChatBox from "./ChatBox";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const Dashboard = () => {
  const [files, setFiles] = useState([]);
  const [selectedFile, setSelectedFile] = useState("");
  const [chatHistory, setChatHistory] = useState([]);
  const userEmail = localStorage.getItem("userEmail");
  const token = localStorage.getItem("token")
  const navigate = useNavigate()

  const fetchData = async (forceSelect = false) => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers : {Authorization: `Bearer ${token}`}
      });
      setFiles(res.data.files);
      setChatHistory(res.data.chats);
      if (res.data.files.length > 0) {
        setSelectedFile(prev => (forceSelect || !prev) ? res.data.files[0] : prev);
      }
    } catch (err) {
      if(err.response?.status === 401) navigate("/auth")
    }
  };

  useEffect(() => { fetchData(); }, [userEmail]);

  // Filter chats for the currently selected file
  const activeChats = chatHistory.filter(chat => chat.fileName === selectedFile);

  return (
    <div className="flex h-screen">
      {/* Sidebar */}
      <aside className="w-72 border-r border-white/5 bg-[#0f051a]/60 backdrop-blur-3xl p-6 flex flex-col">
        <h2 className="text-xs font-black text-violet-500 uppercase tracking-widest mb-6">Documents</h2>
        <div className="flex-1 overflow-y-auto space-y-2 pr-2 custom-scrollbar">
          {files.map((file) => (
            <button
              key={file}
              onClick={() => setSelectedFile(file)}
              className={`w-full text-left px-4 py-3 rounded-xl text-sm transition-all border ${
                setSelectedFile === file 
                ? 'bg-violet-600 border-violet-400 text-white shadow-lg shadow-violet-500/20' 
                : 'bg-transparent border-transparent text-slate-400 hover:bg-white/5'
              }`}
            >
              📄 {file.length > 20 ? file.substring(0, 18) + "..." : file}
            </button>
          ))}
        </div>
        <div className="mt-6 pt-6 border-t border-white/5">
            <p className="text-[10px] text-slate-500 mb-2 uppercase">{userEmail}</p>
            <button onClick={() => { localStorage.clear(); window.location.href='/'; }} className="text-xs text-red-400 hover:text-red-300">Sign Out</button>
        </div>
      </aside>

      {/* Workspace */}
      <main className="flex-1 flex flex-col items-center overflow-y-auto p-8">
        <div className="w-full max-w-3xl space-y-10">
          <div className="flex justify-between items-center">
            <h1 className="text-3xl font-bold tracking-tight">Workspace</h1>
            <UploadPDF onUploadSuccess={() => fetchData(true)} />
          </div>

          <div className="h-px bg-linear-to-r from-transparent via-violet-500/20 to-transparent" />

          {setSelectedFile ? (
            <ChatBox 
              activeFile={setSelectedFile} 
              userEmail={userEmail} 
              previousChats={activeChats}
              onNewMessage={fetchData}
            />
          ) : (
            <div className="text-center py-40 border-2 border-dashed border-white/5 rounded-3xl text-slate-600 font-mono text-sm uppercase tracking-widest">
              Upload a PDF to initialize neural link
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Dashboard;