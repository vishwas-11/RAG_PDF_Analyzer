import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useTypewriter } from "../hooks/useTypewriter";

const API_URL = import.meta.env.VITE_API_URL;

function ChatBox({ activeFile, previousChats, onNewMessage }) {
  const [question, setQuestion] = useState("");
  const [rawAnswer, setRawAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);
  const scrollEndRef = useRef(null);
  const animatedAnswer = useTypewriter(rawAnswer, 15);
  const token = localStorage.getItem("token");

  const formatText = (text) => {
    if (!text) return "";
    return text.replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>").replace(/\n/g, "<br/>");
  };

  useEffect(() => { scrollEndRef.current?.scrollIntoView({ behavior: "smooth" }); }, [animatedAnswer, previousChats]);

  const askQuestion = async () => {
    if (!question || loading || !activeFile) return;
    setLoading(true);
    setRawAnswer("");
    try {
      const res = await axios.post(`${API_URL}/ask`, null, {
        params: {
          question,
          fileName: activeFile,
          history: JSON.stringify(previousChats.slice(-3).map(c => ({ question: c.question, answer: c.answer })))
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      setRawAnswer(res.data.answer);
      setQuestion("");
      onNewMessage();
    } catch (e) {
      setRawAnswer("⚠️ Neural core timeout.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="space-y-8 pb-40">
        {previousChats.map((chat, idx) => (
          <div key={idx} className="space-y-4">
            <div className="flex items-center gap-4 px-2">
              <div className="h-px flex-1 bg-white/5" />
              <span className="text-[10px] font-black text-violet-500 uppercase tracking-widest">Query</span>
              <div className="h-px flex-1 bg-white/5" />
            </div>
            <p className="text-lg font-bold text-white px-4 leading-tight">{chat.question}</p>
            <div className="bg-white/5 border border-white/5 backdrop-blur-xl p-8 rounded-[2rem] text-slate-300 leading-relaxed shadow-2xl"
                 dangerouslySetInnerHTML={{ __html: formatText(chat.answer) }} />
          </div>
        ))}

        {rawAnswer && (
          <div className="animate-pulse space-y-4">
            <p className="text-xs font-black text-fuchsia-500 uppercase tracking-widest px-4">Inference...</p>
            <div className="bg-violet-600/10 border border-violet-500/20 backdrop-blur-xl p-8 rounded-[2rem] text-white leading-relaxed shadow-[0_0_40px_rgba(139,92,246,0.1)]"
                 dangerouslySetInnerHTML={{ __html: formatText(animatedAnswer) }} />
          </div>
        )}
        <div ref={scrollEndRef} />
      </div>

      {/* Console Style Input */}
      <div className="fixed bottom-10 left-1/2 -translate-x-1/2 w-full max-w-2xl px-6">
        <div className="relative bg-[#160a24]/80 border border-white/10 backdrop-blur-3xl rounded-full p-2 shadow-2xl flex items-center">
          <textarea
            ref={textAreaRef}
            rows="1"
            placeholder="Search neural index..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && !e.shiftKey && (e.preventDefault(), askQuestion())}
            className="flex-1 bg-transparent border-none pl-6 py-3 focus:outline-none text-sm text-white placeholder:text-slate-600 resize-none overflow-hidden"
          />
          <button
            onClick={askQuestion}
            disabled={loading}
            className="bg-white text-black h-10 px-6 rounded-full font-black text-[10px] uppercase tracking-tighter hover:bg-violet-400 hover:text-white transition-all disabled:opacity-20"
          >
            {loading ? "..." : "Execute"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ChatBox;