// import UploadPDF from "./UploadPDF";
// import ChatBox from "./ChatBox";
// import DotGrid from "./DotGrid"; // Assuming it's in the same folder

// const LandingPage = () => {
//   return (
//     <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      
//       {/* Interactive Background Layer */}
//       <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
//         <DotGrid 
//           dotSize={3} 
//           gap={35} 
//           baseColor="#334155"    // Slate-700
//           activeColor="#6366f1"  // Indigo-500
//           proximity={180}
//           speedTrigger={15}
//           returnDuration={2}
//         />
//       </div>

//       {/* Main Content Layer */}
//       <div className="relative z-10 flex flex-col items-center p-6 md:p-10">
        
//         {/* Hero Section */}
//         <section className="mt-16 mb-20 text-center max-w-3xl animate-in fade-in zoom-in duration-1000">
//           <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-md">
//             Next-Gen Document Analysis
//           </div>
//           <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent mb-8">
//             PDF Insight
//           </h1>
//           <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
//             Interact with your documents using advanced AI. Upload once, ask anything, and get instant verified answers.
//           </p>
//         </section>

//         {/* Components Container */}
//         <main className="w-full max-w-3xl space-y-12 mb-20">
//           <UploadPDF />
          
//           <div className="flex items-center gap-4 px-4 opacity-50">
//             <div className="h-px bg-slate-700 flex-1" />
//             <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
//             <div className="h-px bg-slate-700 flex-1" />
//           </div>

//           <ChatBox />
//         </main>

//         <footer className="mt-auto py-10 text-slate-600 text-xs font-mono tracking-widest uppercase">
//           System Status: Operational • v2.0.4
//         </footer>
//       </div>
//     </div>
//   );
// };

// export default LandingPage;






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
        <div className="text-2xl font-black bg-gradient-to-r from-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
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
          TALK TO <br /> <span className="bg-gradient-to-r from-violet-500 to-fuchsia-500 bg-clip-text text-transparent">DATA.</span>
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