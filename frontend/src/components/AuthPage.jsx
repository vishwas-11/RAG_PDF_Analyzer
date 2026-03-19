import { useState } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import DotGrid from "./DotGrid";

const API_URL = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const location = useLocation();
  const [isLogin, setIsLogin] = useState(!location.state?.isSignup);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    const endpoint = isLogin ? "/login" : "/signup";
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      if (isLogin) {
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("userEmail", res.data.email);
        navigate("/dashboard");
      } else {
        alert("Neural account created! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Authentication failed.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex items-center justify-center p-6 bg-[#05010d] overflow-hidden">
      
      {/* 1. DOTGRID BACKGROUND */}
      {/* We set this to fixed/absolute so it sits behind everything */}
      <div className="absolute inset-0 z-0 opacity-40 pointer-events-none">
        <DotGrid 
          dotSize={2} 
          gap={35} 
          baseColor="#2e1065" 
          activeColor="#a855f7" 
          proximity={150} 
        />
      </div>

      {/* 2. NEURAL GLOWS */}
      <div className="absolute top-[-10%] left-[-10%] w-[500px] h-[500px] bg-violet-600/20 rounded-full blur-[120px] pointer-events-none z-1" />
      <div className="absolute bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-fuchsia-600/10 rounded-full blur-[120px] pointer-events-none z-1" />

      {/* 3. AUTH CARD */}
      <div className="relative z-10 w-full max-w-md animate-in fade-in zoom-in duration-700">
        <form 
          onSubmit={handleAuth}
          className="bg-[#0f051a]/70 border border-white/10 backdrop-blur-3xl rounded-[3rem] p-10 md:p-12 shadow-[0_20px_80px_rgba(0,0,0,0.6)]"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <div className="inline-block px-3 py-1 mb-4 text-[10px] font-black tracking-[0.2em] text-violet-400 uppercase bg-violet-500/10 border border-violet-500/20 rounded-full">
              {isLogin ? "Secure Access" : "New Link"}
            </div>
            <h2 className="text-4xl font-black text-white tracking-tighter mb-2">
              {isLogin ? "Welcome Back" : "Initialize"}
            </h2>
            <p className="text-slate-400 text-sm font-medium">
              {isLogin ? "Enter your neural signature." : "Create your document vault."}
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <input 
              type="email" 
              placeholder="Email Address" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-white/5 border border-white/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:bg-white/10 transition-all placeholder:text-slate-600"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-10 bg-white text-black hover:bg-violet-400 hover:text-white font-black py-4 rounded-full transition-all active:scale-95 shadow-xl disabled:opacity-50"
          >
            {loading ? "SYNCING..." : isLogin ? "LOG IN" : "CREATE ACCOUNT"}
          </button>

          {/* Toggle Switch */}
          <p className="mt-8 text-center text-slate-500 text-xs font-bold uppercase tracking-widest">
            {isLogin ? "New user?" : "Existing user?"} 
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="text-violet-400 ml-2 hover:text-white transition-colors underline underline-offset-4"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </form>

        {/* Branding Footer */}
        <div className="mt-8 text-center">
            <button 
                onClick={() => navigate('/')} 
                className="text-slate-600 hover:text-violet-400 text-[10px] font-black uppercase tracking-[0.4em] transition-colors"
            >
                ← Back to Surface
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;