from PyPDF2 import PdfReader
from langchain_text_splitters import RecursiveCharacterTextSplitter
from langchain_core.documents import Document

def extract_and_chunk_pdf(file_path, user_id, file_id, chunk_size=1000, chunk_overlap=200):
    reader = PdfReader(file_path)
    raw_text = ""
    for page in reader.pages:
        text = page.extract_text()
        if text:
            raw_text += text

    splitter = RecursiveCharacterTextSplitter(chunk_size=chunk_size, chunk_overlap=chunk_overlap)
    chunks = splitter.split_text(raw_text)

    return [
        Document(
            page_content=chunk,
            metadata={"user_id": user_id, "file_id": file_id, "source": file_path}
        )
        for chunk in chunks
    ]
