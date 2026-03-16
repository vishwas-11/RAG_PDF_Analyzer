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

      const response = await axios.post(
        "http://localhost:8000/ask",
        null,
        {
          params: { question }
        }
      );

      setAnswer(response.data.answer);

    } catch (error) {

      console.error(error);
      setAnswer("Error fetching answer");

    }

    setLoading(false);
  };

  return (

    <div className="bg-white shadow-md rounded-lg p-6">

      <h2 className="text-xl font-semibold mb-4">
        Ask Questions
      </h2>

      <input
        type="text"
        placeholder="Ask something about the PDF..."
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        className="border p-2 w-full rounded mb-3"
      />

      <button
        onClick={askQuestion}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Ask
      </button>

      {loading && (
        <p className="mt-3 text-gray-500">
          Generating answer...
        </p>
      )}

      {answer && (
        <div className="mt-4">
          <h3 className="font-semibold">Answer</h3>
          <p className="mt-2 text-gray-700">{answer}</p>
        </div>
      )}

    </div>
  );
}

export default ChatBox;