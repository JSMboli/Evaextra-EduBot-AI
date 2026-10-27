from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
from services import ChatService

app = FastAPI(title="Educational Chatbot API", version="1.0.0")

# Enable CORS to allow requests from your frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Restrict this to your frontend domain in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

chat_service = ChatService()

class Message(BaseModel):
    role: str
    content: str

class ChatRequest(BaseModel):
    message: str
    history: Optional[List[Message]] = []

class ChatResponse(BaseModel):
    reply: str

@app.get("/")
def read_root():
    return {"status": "online", "message": "Educational Chatbot API is running."}

@app.post("/api/chat", response_model=ChatResponse)
def chat(request: ChatRequest):
    try:
        history_dicts = [{"role": m.role, "content": m.content} for m in request.history]
        reply = chat_service.get_response(request.message, history_dicts)
        return ChatResponse(reply=reply)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))