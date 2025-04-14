import sys
from utils.pdf_utils import extract_and_chunk_pdf
from utils.vectorstore_utils import get_vectorstore
import warnings
warnings.filterwarnings("ignore", category=UserWarning)

if len(sys.argv) != 4:
    print(" Usage: python ingest.py <file_path> <user_id> <file_id>")
    sys.exit(1)

file_path = sys.argv[1]
user_id = sys.argv[2]
file_id = sys.argv[3]

docs = extract_and_chunk_pdf(file_path, user_id, file_id)
vectorstore = get_vectorstore()
inserted_ids = vectorstore.add_documents(docs)

print(f"Successfully inserted {len(inserted_ids)} chunks for user {user_id}, file {file_id}")
