import os
import io
from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
from langchain_mongodb import MongoDBAtlasVectorSearch
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_community.document_loaders import PyPDFLoader
from langchain_classic.chains import RetrievalQA
from pymongo import MongoClient
from dotenv import load_dotenv
import tempfile

load_dotenv()

MONGO_URI = os.getenv("MONGO_URI")
DB_NAME = os.getenv("MONGO_DB_NAME", "rag_db")
COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "pdf_embeddings")
VECTOR_INDEX_NAME = os.getenv("MONGO_VECTOR_INDEX_NAME", "vector_index")

client = MongoClient(MONGO_URI)
collection = client[DB_NAME][COLLECTION_NAME]


def get_embeddings():
    return GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")


def create_vector_store(pdf_bytes: bytes, source_name: str = "uploaded_pdf", user_email : str = ""):
    """
    Parse PDF from raw bytes, chunk the text, embed it,
    and store the vectors in MongoDB Atlas. Returns a
    MongoDBAtlasVectorSearch instance scoped to this upload.
    """
    tmp = tempfile.NamedTemporaryFile(suffix=".pdf", delete=False)
    try:
        tmp.write(pdf_bytes)
        tmp.flush()
        tmp.close()  # Close before PyPDFLoader opens it (critical on Windows)

        loader = PyPDFLoader(tmp.name)
        documents = loader.load()
    finally:
        os.unlink(tmp.name)  # Always delete the temp file, even if an error occurs

    # Tag every chunk with the original filename so you can filter later
    for doc in documents:
        doc.metadata["source"] = source_name
        doc.metadata["user_email"] = user_email

    text_splitter = RecursiveCharacterTextSplitter(
        chunk_size=1000,
        chunk_overlap=200,
    )
    docs = text_splitter.split_documents(documents)

    embeddings = get_embeddings()

    # Upsert chunks + vectors into MongoDB Atlas
    vector_store = MongoDBAtlasVectorSearch.from_documents(
        documents=docs,
        embedding=embeddings,
        collection=collection,
        index_name=VECTOR_INDEX_NAME,
    )

    return vector_store


def create_qa_chain(vector_store, source_name: str, user_email: str):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.4,
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 4,
                       "pre-filter" : {
                           "$and": [
                               {"source" : {"$eq" : source_name}},
                               {"user_email" : {"$eq" : user_email}}
                           ]
                       }},
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
    )

    return qa_chain