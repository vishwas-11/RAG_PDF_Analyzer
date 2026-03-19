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
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  const fetchData = async (forceSelect = false) => {
    if (!userEmail) return;
    try {
      const res = await axios.get(`${API_URL}/history`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      setFiles(res.data.files);
      setChatHistory(res.data.chats);
      if (res.data.files.length > 0) {
        setSelectedFile(prev => forceSelect || !prev ? res.data.files[0] : prev);
      }
    } catch (err) {
      if (err.response?.status === 401) navigate("/auth");
    }
  };

  useEffect(() => { fetchData(); }, [userEmail]);

  const activeChats = chatHistory.filter(chat => chat.fileName === selectedFile);

  return (
    <div className="relative flex h-screen text-slate-200 overflow-hidden">
      {/* Background Glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[600px] h-[600px] bg-violet-600/10 rounded-full blur-[120px] pointer-events-none" />
      
      {/* Sidebar */}
      <aside className="relative z-10 w-80 border-r border-white/5  backdrop-blur-3xl flex flex-col">
        <div className="p-8">
          <div className="text-xl font-black bg-gradient-to-r from-white to-violet-400 bg-clip-text text-transparent mb-8">
            PDF Insight
          </div>
          <h2 className="text-[10px] font-black text-violet-500 uppercase tracking-[0.3em] mb-4">
            Neural Library
          </h2>
          <div className="space-y-2 overflow-y-auto max-h-[60vh] pr-2 custom-scrollbar">
            {files.map((file) => (
              <button
                key={file}
                onClick={() => setSelectedFile(file)}
                className={`w-full text-left px-4 py-3 rounded-2xl text-xs font-bold transition-all border ${
                  selectedFile === file
                    ? "bg-white text-black border-white shadow-xl"
                    : "bg-white/5 border-white/5 text-slate-400 hover:bg-white/10"
                }`}
              >
                {file.length > 22 ? file.substring(0, 20) + "..." : file}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-auto p-8 border-t border-white/5 bg-black/20">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-violet-500 to-fuchsia-500 flex items-center justify-center text-[10px] font-black text-white">
              {userEmail?.charAt(0).toUpperCase()}
            </div>
            <div className="overflow-hidden">
              <p className="text-[10px] text-slate-400 truncate font-bold uppercase tracking-tight">{userEmail}</p>
              <button onClick={() => { localStorage.clear(); navigate("/"); }} className="text-[10px] text-red-500/70 hover:text-red-400 font-black uppercase tracking-widest transition-colors">
                Disconnect
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <main className="relative z-10 flex-1 flex flex-col min-w-0">
        <header className="flex justify-between items-center px-10 py-6 border-b border-white/5 backdrop-blur-md">
          <h1 className="text-sm font-black uppercase tracking-[0.4em] text-slate-500">
            Current Node: <span className="text-white">{selectedFile || "None"}</span>
          </h1>
          <div className="w-64">
             <UploadPDF onUploadSuccess={() => fetchData(true)} />
          </div>
        </header>

        <div className="flex-1 overflow-y-auto px-10 pt-10 pb-4">
          <div className="max-w-4xl mx-auto w-full">
            {selectedFile ? (
              <ChatBox
                key={selectedFile}
                activeFile={selectedFile}
                previousChats={activeChats}
                onNewMessage={fetchData}
              />
            ) : (
              <div className="flex flex-col items-center justify-center h-[60vh] border-2 border-dashed border-white/5 rounded-[3rem] text-slate-600">
                 <p className="text-xs font-black uppercase tracking-[0.5em]">Initialize Link by Uploading</p>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;