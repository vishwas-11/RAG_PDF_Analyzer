import { Link } from "react-router-dom";
import DotGrid from "./DotGrid";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#05010d] text-white overflow-hidden">
      {/* Background stays on all pages via App.jsx or here */}
      <div className="fixed inset-0 z-0 opacity-30">
        <DotGrid dotSize={2} gap={35} baseColor="#2e1065" activeColor="#a855f7" />
      </div>
      
      <nav className="relative z-20 flex justify-between items-center px-8 py-6 backdrop-blur-md border-b border-violet-500/10">
        <div className="text-2xl font-black bg-linear-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
          PDF Insight
        </div>
        <div className="space-x-6">
          <Link to="/auth" className="text-sm font-medium hover:text-violet-400 transition-colors">Sign In</Link>
          <Link to="/auth" className="bg-violet-600 hover:bg-violet-500 px-6 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-violet-500/20">
            Get Started
          </Link>
        </div>
      </nav>

      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 h-[80vh]">
        <div className="inline-block px-4 py-1.5 mb-8 text-[10px] font-black tracking-[0.3em] text-violet-400 uppercase bg-violet-500/10 border border-violet-500/20 rounded-full">
          Neural RAG Architecture
        </div>
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-none">
          TALK TO <br /> <span className="bg-linear-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">DATA.</span>
        </h1>
        <p className="max-w-xl text-slate-400 text-lg md:text-xl mb-12">
          Break the silence of your documents. Upload, store, and query your PDFs through a persistent neural link.
        </p>
        <Link to="/auth" className="bg-white text-black px-10 py-4 rounded-2xl font-black hover:scale-105 transition-transform shadow-[0_0_40px_rgba(139,92,246,0.3)]">
          INITIALIZE WORKSPACE
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;