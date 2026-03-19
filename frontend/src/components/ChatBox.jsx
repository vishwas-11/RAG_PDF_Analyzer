import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useTypewriter } from "../hooks/useTypewriter";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

function ChatBox({ activeFile, previousChats, onNewMessage }) {
  const [question, setQuestion] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);
  const scrollEndRef = useRef(null);

  const animatedAnswer = useTypewriter(rawAnswer, 30);
  const token = localStorage.getItem("token");

  // Auto-scroll to bottom when new messages arrive
  useEffect(() => {
    scrollEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [animatedAnswer, previousChats]);

  // Auto-resize textarea
  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [question]);

  const askQuestion = async () => {
    if (!question || loading || !activeFile) return;
    
    setLoading(true);
    setRawAnswer("");
    
    try {
      const res = await axios.post(`${API_URL}/ask`, null, {
        params: { question, fileName: activeFile, history: JSON.stringify(
          previousChats.slice(-3).map(c => ({
            question: c.question, 
            answer: c.answer
          }))
        ) },
        headers: { Authorization: `Bearer ${token}` }
      });
      setRawAnswer(res.data.answer);
      setQuestion("");
      onNewMessage(); // Triggers parent to fetch updated MongoDB history
    } catch (e) {
      setRawAnswer("Connection to neural core lost. Please check your session.");
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full space-y-6">
      {/* Scrollable History */}
      <div className="flex-1 space-y-8 pb-32">
        {previousChats.map((chat, idx) => (
          <div key={idx} className="animate-in fade-in slide-in-from-bottom-2">
            <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-violet-500" />
                <p className="text-slate-400 text-sm font-semibold">{chat.question}</p>
            </div>
            <div className="bg-violet-950/20 border-l-2 border-violet-500/40 p-5 rounded-r-2xl">
                <p className="text-slate-300 leading-relaxed text-md">{chat.answer}</p>
            </div>
          </div>
        ))}
        
        {/* Current Active Typewriter Answer */}
        {rawAnswer && (
          <div className="animate-in fade-in">
             <div className="flex items-center gap-3 mb-3">
                <div className="w-1.5 h-1.5 rounded-full bg-fuchsia-500 animate-pulse" />
                <p className="text-slate-400 text-sm font-semibold italic">Current Inference...</p>
            </div>
            <div className="bg-fuchsia-950/10 border-l-2 border-fuchsia-500 p-5 rounded-r-2xl">
                <p className="text-slate-200 leading-relaxed">
                    {animatedAnswer}
                    {(animatedAnswer || "") !== rawAnswer && <span className="inline-block w-2 h-5 ml-1 bg-violet-500 animate-pulse align-middle" />}
                </p>
            </div>
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      {/* Input Area (Pinned) */}
      <div className="sticky bottom-4 left-0 right-0 bg-[#0f051a]/90 border border-violet-500/20 backdrop-blur-3xl rounded-3xl p-4 shadow-2xl">
        <div className="relative">
          <textarea
            ref={textAreaRef}
            rows="1"
            placeholder={"Ask Query..."}
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && !e.shiftKey && (e.preventDefault(), askQuestion())}
            className="w-full bg-[#160a24]/50 border border-violet-500/10 rounded-2xl pl-5 pr-28 py-4 focus:outline-none focus:ring-2 focus:ring-violet-500/40 text-slate-200 placeholder:text-violet-900/40 resize-none overflow-hidden min-h-14.5 max-h-48 transition-all"
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="absolute right-2 top-2 bottom-2 bg-violet-600 hover:bg-violet-500 text-white px-6 rounded-xl font-black text-xs tracking-widest transition-all active:scale-95 disabled:opacity-30"
          >
            {loading ? "..." : "SEND"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;