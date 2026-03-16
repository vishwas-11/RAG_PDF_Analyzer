import axios from "axios";

function UploadPDF() {

  const handleUpload = async (event) => {

    const file = event.target.files[0];

    if (!file) return;

    const formData = new FormData();
    formData.append("file", file);

    try {

      await axios.post(
        "http://localhost:8000/upload",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      alert("PDF uploaded successfully");

    } catch (error) {

      console.error(error);
      alert("Error uploading PDF");

    }
  };

  return (

    <div className="bg-white shadow-md rounded-lg p-6 mb-6">

      <h2 className="text-xl font-semibold mb-4">
        Upload PDF
      </h2>

      <input
        type="file"
        accept="application/pdf"
        onChange={handleUpload}
        className="border p-2 rounded w-full"
      />

    </div>
  );
}

export default UploadPDF;