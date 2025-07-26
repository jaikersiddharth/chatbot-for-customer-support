from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import psycopg2
from .chatbot import ChatBot
import os
from typing import List, Optional

app = FastAPI()

# Add CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Your React app's URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

DATABASE_URL = os.getenv("DATABASE_URL")
chatbot = ChatBot()

def get_db():
    conn = psycopg2.connect(DATABASE_URL)
    return conn

class MessageIn(BaseModel):
    session_id: Optional[int] = None
    sender: str  # 'user' or 'ai'
    content: str

class MessageOut(BaseModel):
    message_id: int
    session_id: int
    sender: str
    content: str
    timestamp: str

class ChatRequest(BaseModel):
    message: str
    conversation_id: Optional[int] = None

class ChatResponse(BaseModel):
    response: str
    session_id: Optional[int] = None

class SessionOut(BaseModel):
    session_id: int
    user_id: int
    started_at: str

class UserIn(BaseModel):
    username: str

class UserOut(BaseModel):
    user_id: int
    username: str

@app.post("/users", response_model=UserOut)
def create_user(user: UserIn):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO users (username) VALUES (%s) RETURNING user_id", (user.username,))
    user_id = cur.fetchone()[0]
    conn.commit()
    cur.close()
    conn.close()
    return {"user_id": user_id, "username": user.username}

@app.post("/sessions", response_model=SessionOut)
def create_session(user_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("INSERT INTO sessions (user_id) VALUES (%s) RETURNING session_id, started_at", (user_id,))
    session_id, started_at = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return {"session_id": session_id, "user_id": user_id, "started_at": str(started_at)}

@app.post("/messages", response_model=MessageOut)
def add_message(msg: MessageIn):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("""
        INSERT INTO messages (session_id, sender, content) VALUES (%s, %s, %s)
        RETURNING message_id, timestamp
    """, (msg.session_id, msg.sender, msg.content))
    message_id, timestamp = cur.fetchone()
    conn.commit()
    cur.close()
    conn.close()
    return {
        "message_id": message_id,
        "session_id": msg.session_id,
        "sender": msg.sender,
        "content": msg.content,
        "timestamp": str(timestamp)
    }

@app.get("/sessions/{session_id}/messages", response_model=List[MessageOut])
def get_session_messages(session_id: int):
    conn = get_db()
    cur = conn.cursor()
    cur.execute("SELECT message_id, session_id, sender, content, timestamp FROM messages WHERE session_id = %s ORDER BY timestamp ASC", (session_id,))
    rows = cur.fetchall()
    cur.close()
    conn.close()
    return [
        {
            "message_id": r[0],
            "session_id": r[1],
            "sender": r[2],
            "content": r[3],
            "timestamp": str(r[4])
        } for r in rows
    ]

@app.post("/api/chat", response_model=ChatResponse)
async def chat(request: ChatRequest):
    # Get or create session if conversation_id is provided
    session_id = request.conversation_id
    
    conn = get_db()
    cur = conn.cursor()
    
    try:
        # Store user message
        cur.execute("""
            INSERT INTO messages (session_id, sender, content)
            VALUES (%s, 'user', %s)
        """, (session_id, request.message))
        
        # Get AI response
        ai_response = await chatbot.get_response(request.message)
        
        # Store AI response
        cur.execute("""
            INSERT INTO messages (session_id, sender, content)
            VALUES (%s, 'ai', %s)
        """, (session_id, ai_response))
        
        conn.commit()
        return {"response": ai_response}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))
    finally:
        cur.close()
        conn.close()
