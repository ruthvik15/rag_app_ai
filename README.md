📚 RAG-based PDF QA Web App

This is a full-stack AI-powered application that allows users to upload PDFs, ask questions, and get answers based on the content using Retrieval-Augmented Generation (RAG). It includes:

🧠 LLaMA3 LLM via Groq API

🗃️ PDF Parsing and Chunking

📦 Embeddings with Hugging Face

🧠 Vector DB using AstraDB

🧾 User Auth with MongoDB

🌐 Frontend using EJS, Node.js, HTML/CSS

⚙️ Chat + File-specific Context Retrieval



🚀 Features


📂 Upload PDFs and store embeddings.

💬 Ask context-aware questions from your uploaded PDFs.

🔐 User authentication with MongoDB.

📜 Chat history saved per user per PDF.

📁 RAG system powered by Groq + LangChain + AstraDB.


⚙️ Installation Guide
1. Clone the Repository
   
        git clone https://github.com/ruthvik15/rag_app_ai.git
        cd rag_app_ai
2. Node.js Backend Setup
   
       npm install

3. Python RAG Processor Setup

       cd rag-processor
       conda create --name rag_env python=3.10
       conda activate rag_env
       pip install -r requirements.txt
4. Set Up .env File for Python (rag-processor)
   
       cd rag-processor
    
        ASTRA_DB_APPLICATION_TOKEN=your_astra_token_here
        ASTRA_DB_ID=your_astra_db_id_here
        ASTRA_DB_KEYSPACE=your_keyspace
        GROQ_API_KEY=your_groq_api_key_here
        ASTRA_DB_COLLECTION_NAME=your_collection_name
        ASTRA_DB_API_ENDPOINT=your_api_endpoint
5. Set Up .env File for Node.js

         MONGO_URI=your_mongo_uri

6 .gitignore (Recommended)

          node_modules/
          .env
          .env.*
          __pycache__/
          *.pyc
          rag-processor/.env
          rag-processor/__pycache__/
          rag-processor/*.pyc

