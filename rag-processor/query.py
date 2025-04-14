import sys
from utils.vectorstore_utils import get_vectorstore
from utils.ragchain import build_rag_chain

if len(sys.argv) != 4:
    print(" Usage: python query.py <user_id> <file_id> <question>")
    sys.exit(1)

user_id = sys.argv[1]
file_id = sys.argv[2]
question = sys.argv[3]

vectorstore = get_vectorstore()
retriever = vectorstore.as_retriever(
    search_kwargs={"k": 3, "filter": {"user_id": user_id, "file_id": file_id}}
)

rag_chain = build_rag_chain(retriever)
response = rag_chain.invoke(question)

print(response)
