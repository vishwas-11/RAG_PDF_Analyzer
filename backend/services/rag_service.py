from rag_pipeline import (
    create_vector_store,
    get_embeddings,
    create_qa_chain,
    collection,
    VECTOR_INDEX_NAME
)
from langchain_mongodb import MongoDBAtlasVectorSearch


def process_pdf(pdf_bytes, filename, email):
    return create_vector_store(pdf_bytes, filename, email)


def get_vector_store():
    return MongoDBAtlasVectorSearch(
        collection=collection,
        embedding=get_embeddings(),
        index_name=VECTOR_INDEX_NAME
    )


def get_qa_chain(vector_store, fileName, email):
    return create_qa_chain(vector_store, fileName, email)