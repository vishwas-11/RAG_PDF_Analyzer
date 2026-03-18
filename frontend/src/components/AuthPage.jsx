import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const API_URL = import.meta.env.VITE_API_URL;

const AuthPage = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleAuth = async (e) => {
    e.preventDefault();
    setLoading(true);

    // We use /login for both to match the OAuth2 standard in the backend, 
    // but you can point signup to /signup as we defined in main.py
    const endpoint = isLogin ? "/login" : "/signup";
    
    try {
      const res = await axios.post(`${API_URL}${endpoint}`, { email, password });
      
      if (isLogin) {
        // Store JWT Token and User Identity
        localStorage.setItem("token", res.data.access_token);
        localStorage.setItem("userEmail", res.data.email);
        
        // Redirect to protected dashboard
        navigate("/dashboard");
      } else {
        // If signup was successful, switch to login mode
        alert("Neural account created! Please log in.");
        setIsLogin(true);
      }
    } catch (err) {
      alert(err.response?.data?.detail || "Authentication failed. Check your link.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center p-6">
      {/* The DotGrid is already rendered by App.jsx, so we just build the glass card */}
      <div className="w-full max-w-md animate-in fade-in zoom-in duration-500">
        <form 
          onSubmit={handleAuth}
          className="bg-[#0f051a]/80 border border-violet-500/20 backdrop-blur-3xl rounded-[2.5rem] p-10 shadow-[0_0_50px_rgba(0,0,0,0.5)]"
        >
          {/* Header */}
          <div className="mb-10 text-center">
            <h2 className="text-4xl font-black text-white tracking-tight mb-2">
              {isLogin ? "Welcome Back" : "Initialize Account"}
            </h2>
            <p className="text-violet-400/60 text-sm font-medium uppercase tracking-[0.2em]">
              {isLogin ? "Neural Link Required" : "Create Neural Signature"}
            </p>
          </div>

          {/* Inputs */}
          <div className="space-y-4">
            <div className="relative group">
              <input 
                type="email" 
                placeholder="Email Address" 
                className="w-full bg-[#160a24]/50 border border-violet-500/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-transparent transition-all placeholder:text-violet-900/40"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="relative group">
              <input 
                type="password" 
                placeholder="Secure Password" 
                className="w-full bg-[#160a24]/50 border border-violet-500/10 rounded-2xl px-6 py-4 text-white focus:outline-none focus:ring-2 focus:ring-violet-500/40 focus:border-transparent transition-all placeholder:text-violet-900/40"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>

          {/* Submit Button */}
          <button 
            type="submit" 
            disabled={loading}
            className="w-full mt-8 bg-violet-600 hover:bg-violet-500 text-white font-black py-4 rounded-2xl transition-all active:scale-95 shadow-[0_0_25px_rgba(139,92,246,0.4)] disabled:opacity-50"
          >
            {loading ? "SYNCING..." : isLogin ? "LOG IN" : "CREATE SIGNATURE"}
          </button>

          {/* Toggle Switch */}
          <p className="mt-8 text-center text-slate-500 text-sm font-medium">
            {isLogin ? "New to the engine?" : "Signature already exists?"} 
            <button 
              type="button"
              onClick={() => setIsLogin(!isLogin)} 
              className="text-violet-400 ml-2 font-bold hover:text-violet-300 transition-colors underline underline-offset-4"
            >
              {isLogin ? "Sign Up" : "Log In"}
            </button>
          </p>
        </form>

        {/* Branding Footer */}
        <div className="mt-8 text-center">
            <button 
                onClick={() => navigate('/')} 
                className="text-violet-500/40 hover:text-violet-500 text-[10px] font-black uppercase tracking-[0.5em] transition-colors"
            >
                Return to Surface
            </button>
        </div>
      </div>
    </div>
  );
};

export default AuthPage;