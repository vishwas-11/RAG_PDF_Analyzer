import { useState } from "react";
import axios from "axios";

function ChatBox() {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);

  const askQuestion = async () => {
    if (!question) return;
    setLoading(true);
    try {
      const response = await axios.post("http://localhost:8000/ask", null, {
        params: { question }
      });
      setAnswer(response.data.answer);
    } catch (error) {
      setAnswer("Error fetching answer");
    }
    setLoading(false);
  };

  return (
    <div className="bg-slate-900/50 border border-slate-800 backdrop-blur-xl rounded-2xl p-8 shadow-2xl">
      <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
        <span className="text-cyan-400">02.</span> Ask Intelligence
      </h2>

      <div className="flex gap-2">
        <input
          type="text"
          placeholder="Ask a question..."
          value={question}
          onChange={(e) => setQuestion(e.target.value)}
          className="flex-1 bg-slate-950 border border-slate-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all text-slate-200"
        />
        <button
          onClick={askQuestion}
          disabled={loading}
          className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold px-6 py-3 rounded-lg transition-all disabled:opacity-50 active:scale-95"
        >
          {loading ? "..." : "Ask"}
        </button>
      </div>

      {(loading || answer) && (
        <div className="mt-6 animate-in fade-in slide-in-from-top-2 duration-500">
          <div className="bg-slate-950/80 border border-indigo-500/20 rounded-xl p-5">
            <h3 className="text-xs font-bold uppercase tracking-widest text-indigo-400 mb-2">AI Response</h3>
            {loading ? (
              <div className="flex gap-2 items-center text-slate-400">
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.3s]" />
                <div className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce [animation-delay:-.5s]" />
              </div>
            ) : (
              <p className="text-slate-300 leading-relaxed">{answer}</p>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default ChatBox;