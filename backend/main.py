from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from rag_pipeline import create_vector_store, create_qa_chain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://rag-pdf-analyzer.vercel.app"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = None
qa_chain = None


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global vector_store, qa_chain

    if not file.filename.endswith(".pdf"):
        raise HTTPException(status_code=400, detail="Only PDF files are supported.")

    # Read the file entirely into memory — no disk writes
    pdf_bytes = await file.read()

    vector_store = create_vector_store(pdf_bytes, source_name=file.filename)
    qa_chain = create_qa_chain(vector_store)

    return {"message": f"'{file.filename}' processed and stored in MongoDB Atlas."}


@app.post("/ask")
async def ask_question(question: str):
    global qa_chain

    if qa_chain is None:
        raise HTTPException(
            status_code=400,
            detail="No PDF has been uploaded yet. Please upload a PDF first.",
        )

    response = qa_chain.run(question)
    return {"answer": response}