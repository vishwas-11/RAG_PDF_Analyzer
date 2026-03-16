import UploadPDF from "./components/UploadPDF";
import ChatBox from "./components/ChatBox";

function App() {
  return (
    <div className="min-h-screen bg-[#0f172a] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-black text-slate-200 flex flex-col items-center p-6 md:p-10">
      
      {/* Header Section */}
      <header className="mb-12 text-center">
        <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 to-cyan-400 bg-clip-text text-transparent mb-3">
          PDF Insight AI
        </h1>
        <p className="text-slate-400 text-lg">Upload, analyze, and chat with your documents in seconds.</p>
      </header>

      <main className="w-full max-w-2xl space-y-8">
        <UploadPDF />
        <div className="h-px bg-gradient-to-r from-transparent via-slate-700 to-transparent w-full" />
        <ChatBox />
      </main>
      
      <footer className="mt-auto pt-10 text-slate-500 text-sm">
        Powered by RAG Pipeline • 2026
      </footer>
    </div>
  );
}

export default App;