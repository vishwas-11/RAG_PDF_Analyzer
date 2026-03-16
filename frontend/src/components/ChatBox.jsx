import { useState, useRef, useEffect } from "react";
import axios from "axios";
import { useTypewriter } from "../hooks/useTypewriter"; // Adjust path as needed

function ChatBox() {
  const [question, setQuestion] = useState("");
  const [rawAnswer, setRawAnswer] = useState(""); // Holds the full response
  const [loading, setLoading] = useState(false);
  const textAreaRef = useRef(null);

  // Integrate the typewriter effect
  const animatedAnswer = useTypewriter(rawAnswer, 40); // 40ms per word

  useEffect(() => {
    if (textAreaRef.current) {
      textAreaRef.current.style.height = "auto";
      textAreaRef.current.style.height = `${textAreaRef.current.scrollHeight}px`;
    }
  }, [question]);

  const askQuestion = async () => {
    if (!question) return;
    setLoading(true);
    setRawAnswer(""); // Clear previous answer
    try {
      const response = await axios.post("http://localhost:8000/ask", null, { params: { question } });
      setRawAnswer(response.data.answer);
    } catch (error) {
      setRawAnswer("Core connection error. Please try again.");
    }
    setLoading(false);
  };

  return (
    <div className="bg-[#0f051a]/60 border border-violet-500/10 backdrop-blur-2xl rounded-3xl p-8 shadow-[0_0_40px_rgba(0,0,0,0.7)]">
      <h2 className="text-2xl font-bold text-white mb-6 flex items-center gap-3">
        Query Engine
        <span className="flex h-2 w-2 rounded-full bg-violet-500 animate-pulse shadow-[0_0_8px_#a855f7]" />
      </h2>

      <div className="relative flex flex-col">
        <textarea
          ref={textAreaRef}
          rows="1"
          placeholder="Query the document..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="w-full bg-[#160a24]/80 border border-violet-500/20 rounded-2xl pl-6 pr-32 py-5 focus:outline-none focus:ring-2 focus:ring-violet-500/40 transition-all text-slate-200 placeholder:text-violet-900/60 resize-none overflow-hidden min-h-[64px] max-h-[300px]"
        />
        
        <button
          onClick={askQuestion}
          disabled={loading}
          className="absolute right-3 top-3 bottom-3 bg-violet-600 hover:bg-violet-500 text-white px-6 rounded-xl font-bold transition-all active:scale-95 disabled:opacity-40 shadow-[0_0_15px_rgba(139,92,246,0.3)]"
        >
          {loading ? (
            <div className="flex gap-1">
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.3s]"></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce [animation-delay:-0.15s]"></span>
              <span className="w-1.5 h-1.5 bg-white rounded-full animate-bounce"></span>
            </div>
          ) : "SEND"}
        </button>
      </div>

      {(animatedAnswer || loading) && (
        <div className="mt-8 p-6 bg-violet-950/20 border-t border-violet-500/30 rounded-2xl animate-in slide-in-from-bottom-4 duration-500">
          <div className="flex items-center gap-2 mb-4">
            <div className="w-1.5 h-6 bg-violet-500 rounded-full" />
            <h3 className="text-xs font-black text-violet-400 uppercase tracking-widest">Inference Result</h3>
          </div>
          
          <p className="text-slate-300 leading-relaxed text-lg whitespace-pre-wrap">
            {animatedAnswer}
            {/* Blinking cursor while typing */}
            {animatedAnswer !== rawAnswer && (
              <span className="inline-block w-2 h-5 ml-1 bg-violet-500 animate-pulse align-middle" />
            )}
          </p>
        </div>
      )}
    </div>
  );
}

export default ChatBox;