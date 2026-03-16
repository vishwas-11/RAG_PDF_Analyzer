import streamlit as st
import tempfile
from rag_pipeline import create_vector_store, create_qa_chain

st.title("📄 PDF Insight AI")

st.write("Upload a PDF and ask questions about it.")

uploaded_file = st.file_uploader("Upload PDF", type="pdf")

if uploaded_file:

    with tempfile.NamedTemporaryFile(delete=False) as tmp:
        tmp.write(uploaded_file.read())
        pdf_path = tmp.name

    st.success("PDF uploaded successfully!")

    with st.spinner("Processing PDF..."):
        vector_store = create_vector_store(pdf_path)
        qa_chain = create_qa_chain(vector_store)

    st.session_state.qa_chain = qa_chain


if "qa_chain" in st.session_state:

    query = st.text_input("Ask something about the PDF")

    if query:

        with st.spinner("Thinking..."):
            response = st.session_state.qa_chain.run(query)

        st.write("### Answer")
        st.write(response)