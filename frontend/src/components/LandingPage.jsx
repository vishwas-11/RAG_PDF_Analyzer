import UploadPDF from "./UploadPDF";
import ChatBox from "./ChatBox";
import DotGrid from "./DotGrid"; // Assuming it's in the same folder

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#020617] text-slate-200 overflow-x-hidden">
      
      {/* Interactive Background Layer */}
      <div className="fixed inset-0 z-0 opacity-40 pointer-events-none">
        <DotGrid 
          dotSize={3} 
          gap={35} 
          baseColor="#334155"    // Slate-700
          activeColor="#6366f1"  // Indigo-500
          proximity={180}
          speedTrigger={15}
          returnDuration={2}
        />
      </div>

      {/* Main Content Layer */}
      <div className="relative z-10 flex flex-col items-center p-6 md:p-10">
        
        {/* Hero Section */}
        <section className="mt-16 mb-20 text-center max-w-3xl animate-in fade-in zoom-in duration-1000">
          <div className="inline-block px-4 py-1.5 mb-6 text-sm font-semibold tracking-wider text-indigo-400 uppercase bg-indigo-500/10 border border-indigo-500/20 rounded-full backdrop-blur-md">
            Next-Gen Document Analysis
          </div>
          <h1 className="text-6xl md:text-8xl font-black tracking-tighter bg-linear-to-b from-white to-slate-500 bg-clip-text text-transparent mb-8">
            PDF Insight
          </h1>
          <p className="text-slate-400 text-lg md:text-xl leading-relaxed max-w-xl mx-auto">
            Interact with your documents using advanced AI. Upload once, ask anything, and get instant verified answers.
          </p>
        </section>

        {/* Components Container */}
        <main className="w-full max-w-3xl space-y-12 mb-20">
          <UploadPDF />
          
          <div className="flex items-center gap-4 px-4 opacity-50">
            <div className="h-px bg-slate-700 flex-1" />
            <div className="w-2 h-2 rounded-full bg-indigo-500 shadow-[0_0_10px_#6366f1]" />
            <div className="h-px bg-slate-700 flex-1" />
          </div>

          <ChatBox />
        </main>

        <footer className="mt-auto py-10 text-slate-600 text-xs font-mono tracking-widest uppercase">
          System Status: Operational • v2.0.4
        </footer>
      </div>
    </div>
  );
};

export default LandingPage;