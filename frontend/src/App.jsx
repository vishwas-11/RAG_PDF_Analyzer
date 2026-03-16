import UploadPDF from "./components/UploadPDF";
import ChatBox from "./components/ChatBox";

function App() {

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-10">

      <h1 className="text-3xl font-bold mb-8">
        PDF Insight AI
      </h1>

      <div className="w-full max-w-xl">

        <UploadPDF />

        <ChatBox />

      </div>

    </div>
  );
}

export default App;