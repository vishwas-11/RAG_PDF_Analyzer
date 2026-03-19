// import { Link } from "react-router-dom";
// import DotGrid from "./DotGrid";

// const LandingPage = () => {
//   return (
//     <div className="relative min-h-screen bg-[#05010d] text-white overflow-hidden">
      
//       {/* 1. IMPROVED DOTGRID VISIBILITY */}
//       {/* We use a slightly higher opacity and a radial mask so it fades at the edges */}
//       <div className="fixed inset-0 z-0 opacity-60 [mask-image:radial-gradient(ellipse_at_center,black_70%,transparent_100%)]">
//         <DotGrid dotSize={2} gap={30} baseColor="#3b0764" activeColor="#c084fc" />
//       </div>

//       {/* 2. NEURAL GLOWS (Adding Depth) */}
//       {/* These colored "blobs" sit behind the text to make the UI feel alive and less dark */}
//       <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none" />
//       <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none" />

//       <nav className="relative z-20 flex justify-between items-center px-8 py-6 backdrop-blur-xl border-b border-white/5 shadow-2xl">
//         <div className="text-2xl font-black bg-gradient-to-r from-white via-violet-400 to-fuchsia-400 bg-clip-text text-transparent">
//           PDF Insight
//         </div>
//         <div className="flex items-center space-x-8">
//           <Link to="/auth" className="text-sm font-semibold text-slate-400 hover:text-white transition-colors">Sign In</Link>
//           <Link to="/auth" className="bg-white text-black hover:bg-violet-50 px-8 py-2.5 rounded-full text-sm font-black transition-all shadow-[0_0_20px_rgba(255,255,255,0.1)] hover:scale-105 active:scale-95">
//             Get Started
//           </Link>
//         </div>
//       </nav>

//       <section className="relative z-10 flex flex-col items-center justify-center text-center px-6 pt-20 h-[85vh]">
//         {/* Animated Badge */}
//         <div className="group cursor-default inline-flex items-center space-x-2 px-4 py-2 mb-10 text-[11px] font-black tracking-[0.2em] text-violet-300 uppercase bg-violet-500/5 border border-violet-500/20 rounded-full backdrop-blur-md hover:border-violet-500/50 transition-colors">
//           <span className="relative flex h-2 w-2">
//             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-violet-400 opacity-75"></span>
//             <span className="relative inline-flex rounded-full h-2 w-2 bg-violet-500"></span>
//           </span>
//           <span>Neural RAG v2.0 Live</span>
//         </div>

//         <h1 className="text-7xl md:text-9xl font-black tracking-tighter mb-8 leading-[0.9] text-white">
//           TALK TO <br /> 
//           <span className="bg-gradient-to-b from-white via-violet-400 to-violet-600 bg-clip-text text-transparent">
//             YOUR DATA.
//           </span>
//         </h1>

//         <p className="max-w-2xl text-slate-400 text-lg md:text-xl mb-14 leading-relaxed font-medium">
//           Transform static documents into interactive knowledge. <br className="hidden md:block"/>
//           Secure, persistent, and powered by advanced neural reasoning.
//         </p>

//         <div className="flex flex-col sm:flex-row items-center gap-6">
//           <Link to="/auth" className="group relative bg-violet-600 text-white px-12 py-5 rounded-2xl font-black text-lg transition-all hover:bg-violet-500 hover:shadow-[0_0_50px_rgba(139,92,246,0.4)] hover:-translate-y-1">
//             INITIALIZE WORKSPACE
//             <div className="absolute inset-0 rounded-2xl border-2 border-white/20 scale-105 opacity-0 group-hover:opacity-100 transition-all" />
//           </Link>
          
//           <button className="text-slate-500 hover:text-white font-bold text-sm tracking-widest uppercase transition-colors">
//             View Documentation
//           </button>
//         </div>
//       </section>

//       {/* Subtle bottom gradient to ground the page */}
//       <div className="absolute bottom-0 left-0 right-0 h-32 bg-gradient-to-t from-[#05010d] to-transparent pointer-events-none" />
//     </div>
//   );
// };

// export default LandingPage;






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