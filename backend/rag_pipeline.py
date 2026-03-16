# import os
# from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
# from langchain_community.vectorstores import FAISS
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_classic.chains import RetrievalQA
# from dotenv import load_dotenv

# load_dotenv()

# def create_vector_store(pdf_path):

#     loader = PyPDFLoader(pdf_path)
#     documents = loader.load()

#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=1000,
#         chunk_overlap=200
#     )

#     docs = text_splitter.split_documents(documents)

#     embeddings = GoogleGenerativeAIEmbeddings(
#         model="gemini-embedding-001"
#     )

#     vector_store = FAISS.from_documents(docs, embeddings)

#     return vector_store


# def create_qa_chain(vector_store):

#     llm = ChatGoogleGenerativeAI(
#         model="gemini-2.5-flash",
#         temperature=0.3
#     )

#     retriever = vector_store.as_retriever()

#     qa_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         retriever=retriever
#     )

#     return qa_chain









# import os
# import io
# from langchain_google_genai import GoogleGenerativeAIEmbeddings, ChatGoogleGenerativeAI
# from langchain_mongodb import MongoDBAtlasVectorSearch
# from langchain_text_splitters import RecursiveCharacterTextSplitter
# from langchain_community.document_loaders import PyPDFLoader
# from langchain_classic.chains import RetrievalQA
# from pymongo import MongoClient
# from dotenv import load_dotenv
# import tempfile

# load_dotenv()

# MONGO_URI = os.getenv("MONGO_URI")
# DB_NAME = os.getenv("MONGO_DB_NAME", "rag_db")
# COLLECTION_NAME = os.getenv("MONGO_COLLECTION_NAME", "pdf_embeddings")
# VECTOR_INDEX_NAME = os.getenv("MONGO_VECTOR_INDEX_NAME", "vector_index")

# if not MONGO_URI:
#     raise EnvironmentError(
#         "Missing required environment variable MONGO_URI. "
#         "Set it in your .env file or in the environment before starting the server."
#     )

# # Use a short server-selection timeout so failures happen quickly instead of hanging.
# client = MongoClient(MONGO_URI, serverSelectionTimeoutMS=5000)
# collection = client[DB_NAME][COLLECTION_NAME]


# def get_embeddings():
#     return GoogleGenerativeAIEmbeddings(model="gemini-embedding-001")


# def create_vector_store(pdf_bytes: bytes, source_name: str = "uploaded_pdf"):
#     """
#     Parse PDF from raw bytes, chunk the text, embed it,
#     and store the vectors in MongoDB Atlas. Returns a
#     MongoDBAtlasVectorSearch instance scoped to this upload.
#     """
#     # Write bytes to a short-lived temp file so PyPDFLoader can open it.
#     # The file is deleted automatically when the `with` block exits.
#     with tempfile.NamedTemporaryFile(suffix=".pdf", delete=True) as tmp:
#         tmp.write(pdf_bytes)
#         tmp.flush()

#         loader = PyPDFLoader(tmp.name)
#         documents = loader.load()

#     # Tag every chunk with the original filename so you can filter later
#     for doc in documents:
#         doc.metadata["source"] = source_name

#     text_splitter = RecursiveCharacterTextSplitter(
#         chunk_size=1000,
#         chunk_overlap=200,
#     )
#     docs = text_splitter.split_documents(documents)

#     embeddings = get_embeddings()

#     # Upsert chunks + vectors into MongoDB Atlas
#     vector_store = MongoDBAtlasVectorSearch.from_documents(
#         documents=docs,
#         embedding=embeddings,
#         collection=collection,
#         index_name=VECTOR_INDEX_NAME,
#     )

#     return vector_store


# def create_qa_chain(vector_store):
#     llm = ChatGoogleGenerativeAI(
#         model="gemini-2.5-flash",
#         temperature=0.3,
#     )

#     retriever = vector_store.as_retriever(
#         search_type="similarity",
#         search_kwargs={"k": 5},
#     )

#     qa_chain = RetrievalQA.from_chain_type(
#         llm=llm,
#         retriever=retriever,
#     )

#     return qa_chain











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


def create_vector_store(pdf_bytes: bytes, source_name: str = "uploaded_pdf"):
    """
    Parse PDF from raw bytes, chunk the text, embed it,
    and store the vectors in MongoDB Atlas. Returns a
    MongoDBAtlasVectorSearch instance scoped to this upload.
    """
    # Write bytes to a short-lived temp file so PyPDFLoader can open it.
    # delete=False is required on Windows — the OS locks the file when it's
    # open, so PyPDFLoader can't read it if delete=True. We clean up manually.
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


def create_qa_chain(vector_store):
    llm = ChatGoogleGenerativeAI(
        model="gemini-2.5-flash",
        temperature=0.3,
    )

    retriever = vector_store.as_retriever(
        search_type="similarity",
        search_kwargs={"k": 5},
    )

    qa_chain = RetrievalQA.from_chain_type(
        llm=llm,
        retriever=retriever,
    )

    return qa_chain