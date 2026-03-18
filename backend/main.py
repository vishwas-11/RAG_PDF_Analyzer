# from fastapi import FastAPI, UploadFile, File, HTTPException
# from fastapi.middleware.cors import CORSMiddleware
# from rag_pipeline import create_vector_store, create_qa_chain

# app = FastAPI()

# app.add_middleware(
#     CORSMiddleware,
#     allow_origins=["*", "http://localhost:5173"],
#     allow_credentials=True,
#     allow_methods=["*"],
#     allow_headers=["*"],
# )

# vector_store = None
# qa_chain = None


# @app.post("/upload")
# async def upload_pdf(file: UploadFile = File(...)):
#     global vector_store, qa_chain

#     if not file.filename.endswith(".pdf"):
#         raise HTTPException(status_code=400, detail="Only PDF files are supported.")

#     # Read the file entirely into memory — no disk writes
#     pdf_bytes = await file.read()

#     vector_store = create_vector_store(pdf_bytes, source_name=file.filename)
#     qa_chain = create_qa_chain(vector_store)

#     return {"message": f"'{file.filename}' processed and stored in MongoDB Atlas."}


# @app.post("/ask")
# async def ask_question(question: str):
#     global qa_chain

#     if qa_chain is None:
#         raise HTTPException(
#             status_code=400,
#             detail="No PDF has been uploaded yet. Please upload a PDF first.",
#         )

#     response = qa_chain.run(question)
#     return {"answer": response}



from fastapi import FastAPI, UploadFile, File, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import OAuth2PasswordBearer, OAuth2PasswordRequestForm
from pydantic import BaseModel
import jwt
import bcrypt
from datetime import datetime, timedelta
from rag_pipeline import create_vector_store, get_embeddings, create_qa_chain, collection, client, DB_NAME, VECTOR_INDEX_NAME
from langchain_mongodb import MongoDBAtlasVectorSearch
from dotenv import load_dotenv
import os

# --- AUTH CONFIG ---
SECRET_KEY = os.getenv("JWT_SECRET_KEY") 
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60 * 24 # 24 hours

app = FastAPI()
db = client[DB_NAME]
users_collection = db["users"]
chats_collection = db["chats"]
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="login")

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# --- UTILS ---
def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    return jwt.encode(to_encode, "SECRET_KEY", algorithm=ALGORITHM)

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, "SECRET_KEY", algorithms=[ALGORITHM])
        email: str = payload.get("sub")
        if email is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        return email
    except jwt.PyJWTError:
        raise HTTPException(status_code=401, detail="Could not validate credentials")

# --- AUTH ENDPOINTS ---
class AuthModel(BaseModel):
    email: str
    password: str

@app.post("/signup")
async def signup(user: AuthModel):
    if users_collection.find_one({"email": user.email}):
        raise HTTPException(status_code=400, detail="User already exists")
    hashed = bcrypt.hashpw(user.password.encode('utf-8'), bcrypt.gensalt())
    users_collection.insert_one({"email": user.email, "password": hashed})
    return {"message": "Success"}

@app.post("/login")
async def login(user: AuthModel):
    db_user = users_collection.find_one({"email": user.email})
    if not db_user or not bcrypt.checkpw(user.password.encode('utf-8'), db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials")
    
    token = create_access_token(data={"sub": user.email})
    return {"access_token": token, "token_type": "bearer", "email": user.email}

# --- PROTECTED APP ENDPOINTS ---
@app.post("/upload")
async def upload_pdf(file: UploadFile = File(...), email: str = Depends(get_current_user)):
    pdf_bytes = await file.read()
    create_vector_store(pdf_bytes, source_name=file.filename, user_email=email)
    return {"message": "Processed"}

@app.get("/history")
async def get_history(email: str = Depends(get_current_user)):
    files = collection.distinct("source", {"user_email": email})
    chats = list(chats_collection.find({"userEmail": email}, {"_id": 0}))
    return {"files": files, "chats": chats}

@app.post("/ask")
async def ask_question(question: str, fileName: str, email: str = Depends(get_current_user), history : str = ""):


    import json
    
    # Build context from previous conversations
    history_context = ""
    if history:
        try:
            past = json.loads(history)
            history_context = "\n".join([
                f"User: {h['question']}\nAssistant: {h['answer']}" 
                for h in past
            ])
        except:
            history_context = ""

    # Augment the question with conversation history
    full_query = question
    if history_context:
        full_query = f"""Previous conversation:
{history_context}

Current question: {question}

Answer the current question, taking into account the conversation history above."""

    vector_store = MongoDBAtlasVectorSearch(collection=collection, embedding=get_embeddings(), index_name=VECTOR_INDEX_NAME)
    qa_chain = create_qa_chain(vector_store, fileName, email)
    response = qa_chain.invoke({"query": question})
    answer = response["result"]

    chats_collection.insert_one({
        "userEmail": email,
        "fileName": fileName,
        "question": question,
        "answer": answer,
        "timestamp": datetime.utcnow()
    })
    return {"answer": answer}