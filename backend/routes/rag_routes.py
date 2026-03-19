from fastapi import APIRouter, UploadFile, File, Depends
from datetime import datetime
import json

from core.security import get_current_user
from db.mongo import chats_collection
from rag_pipeline import collection
from services.rag_service import process_pdf, get_vector_store, get_qa_chain

router = APIRouter()


@router.post("/upload")
async def upload_pdf(file: UploadFile = File(...), email: str = Depends(get_current_user)):
    pdf_bytes = await file.read()
    process_pdf(pdf_bytes, file.filename, email)
    return {"message": "Processed"}


@router.get("/history")
async def get_history(email: str = Depends(get_current_user)):
    files = collection.distinct("source", {"user_email": email})
    chats = list(chats_collection.find({"userEmail": email}, {"_id": 0}))
    return {"files": files, "chats": chats}


@router.post("/ask")
async def ask_question(
    question: str,
    fileName: str,
    email: str = Depends(get_current_user),
    history: str = ""
):
    history_context = ""

    if history:
        try:
            past = json.loads(history)
            past = past[-3:]

            history_context = "\n".join([
                f"User: {h['question']}\nAssistant: {h['answer']}"
                for h in past
            ])
        except:
            history_context = ""

    if history_context:
        final_query = f"""
You are a helpful assistant answering questions based on a PDF.

Previous conversation:
{history_context}

Now answer the following question using both context and retrieved knowledge:

Question: {question}
"""
    else:
        final_query = question

    vector_store = get_vector_store()
    qa_chain = get_qa_chain(vector_store, fileName, email)

    response = qa_chain.invoke({"query": final_query})
    answer = response["result"]

    chats_collection.insert_one({
        "userEmail": email,
        "fileName": fileName,
        "question": question,
        "answer": answer,
        "timestamp": datetime.utcnow()
    })

    return {"answer": answer}