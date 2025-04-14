from langchain_core.prompts import ChatPromptTemplate
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_groq import ChatGroq
import os

llm = ChatGroq(groq_api_key=os.getenv("GROQ_API_KEY"), model_name="Llama3-8b-8192")

def build_rag_chain(retriever):
    prompt_template = """
    You are an AI assistant that helps users by answering questions based on the content of the PDF document they uploaded.

    Use the following context from the document to answer the question.

    Only use the provided context. If the answer is not found in the context, respond by saying "No context found." Then, provide an answer based on your own knowledge, clearly stating that it is not from the document.
    CONTEXT:
    {context}

    QUESTION: {question}

    ANSWER:"""

    prompt = ChatPromptTemplate.from_template(prompt_template)

    return (
        {"context": retriever, "question": RunnablePassthrough()}
        | prompt
        | llm
        | StrOutputParser()
    )
