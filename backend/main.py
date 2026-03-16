from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
import shutil
from rag_pipeline import create_vector_store, create_qa_chain

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

vector_store = None
qa_chain = None


@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...)):
    global vector_store, qa_chain

    file_path = f"temp_{file.filename}"

    with open(file_path, "wb") as buffer:
        shutil.copyfileobj(file.file, buffer)

    vector_store = create_vector_store(file_path)
    qa_chain = create_qa_chain(vector_store)

    return {"message": "PDF processed successfully"}


@app.post("/ask")
async def ask_question(question: str):
    global qa_chain

    response = qa_chain.run(question)

    return {"answer": response}