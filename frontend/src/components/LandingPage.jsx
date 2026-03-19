import { Link } from "react-router-dom";
import DotGrid from "./DotGrid";

const LandingPage = () => {
  return (
    <div className="relative min-h-screen bg-[#05010d] text-white overflow-hidden">
      
      {/* DotGrid Background */}
      <div className="fixed inset-0 z-0 opacity-60 mask-[radial-gradient(ellipse_at_center,black_70%,transparent_100%)]">
        <DotGrid dotSize={2} gap={30} baseColor="#3b0764" activeColor="#c084fc" />
      </div>

      {/* Floating Pill Navbar */}
      <div className="fixed top-6 left-0 right-0 z-50 flex justify-center px-4">
        <nav className="flex items-center justify-between w-full max-w-4xl px-6 py-3 bg-[#0f051a]/40 backdrop-blur-xl border border-white/10 rounded-full shadow-[0_8px_32px_rgba(0,0,0,0.5)]">
          {/* Logo */}
          <div className="text-xl font-black bg-linear-to-r from-white to-violet-400 bg-clip-text text-transparent">
            PDF Insights
          </div>

          {/* Nav Links
          <div className="hidden md:flex items-center gap-8">
            <a href="#features" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Features</a>
            <a href="#security" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Security</a>
            <a href="#pricing" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">Pricing</a>
          </div> */}

          {/* Action Buttons */}
          <div className="flex items-center gap-4">
            <Link to="/auth" className="text-xs font-bold uppercase tracking-widest text-slate-400 hover:text-white transition-colors">
              Sign In
            </Link>
            <Link to="/auth" 
            state = {{isSignup : true}}
            className="bg-white text-black px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest hover:bg-violet-400 hover:text-white transition-all active:scale-95">
              Get Started
            </Link>
          </div>
        </nav>
      </div>

      {/* Hero Section */}
      <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-32 h-screen">
        {/* Glow Effects */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-violet-600/20 rounded-full blur-[120px] -z-10" />
        <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-fuchsia-600/10 rounded-full blur-[120px] -z-10" />

        <div className="inline-block px-4 py-1.5 mb-10 text-[10px] font-black tracking-[0.3em] text-violet-400 uppercase bg-violet-500/10 border border-violet-500/20 rounded-full">
          Neural RAG v2.0
        </div>
        
        <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.85] text-white">
          TALK TO <br /> 
          <span className="bg-linear-to-b from-white via-violet-400 to-violet-600 bg-clip-text text-transparent">
            YOUR DATA.
          </span>
        </h1>

        <p className="max-w-2xl text-slate-400 text-lg md:text-xl mb-14 leading-relaxed">
          The ultimate workspace for document intelligence. <br />
          Upload, store, and query through a persistent neural link.
        </p>

        <Link to="/auth" className="group relative bg-violet-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] hover:-translate-y-1">
          INITIALIZE WORKSPACE
        </Link>
      </section>
    </div>
  );
};

export default LandingPage;