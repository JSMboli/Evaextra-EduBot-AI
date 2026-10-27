# 🎓 Evaextra EduBot AI

An interactive, AI-powered educational tutor chatbot web application built with a **FastAPI** backend using the **Groq API** and a clean, responsive frontend styled with **Inter** typography and **KaTeX** math typesetting.

---

## 🚀 Features

- **AI-Powered Learning**: Driven by Groq's fast LLM inference with system prompts tailored for educational support for learners aged 20 and under.
- **Robust Math Rendering**: Native rendering of LaTeX equations (inline `$...$` and block `$$...$$`) using **KaTeX**.
- **Markdown Support**: Rich text formatting for lists, code snippets, tables, and blockquotes powered by **Marked.js**.
- **Conversation Context**: Remembers chat history for accurate, contextual follow-up answers.
- **FastAPI Backend**: Asynchronous Python web API server with CORS enabled.

---

## 📁 Project Structure

```text
.
├── index.html        # Main frontend HTML structure
├── script.js         # Frontend interactive logic & API requests
├── style.css          # User interface styles
├── main.py           # FastAPI application & API endpoints
├── services.py       # Groq API interaction & prompt configuration
├── config.py         # Environment variable loader
├── requirements.txt  # Python backend dependencies
└── .env              # Private API keys (not tracked in Git)
```

---

## 🛠️ Prerequisites

- **Python 3.8+**
- A **Groq API Key** (Get one at [console.groq.com](https://console.groq.com/))

---

## 📦 Setup & Installation

### 1. Clone the Repository
```bash
git clone https://github.com/your-username/evaextra-edubot.git
cd evaextra-edubot
```

### 2. Set Up Virtual Environment (Recommended)
```bash
# macOS/Linux
python3 -m venv venv
source venv/bin/activate

# Windows
python -m venv venv
venv\Scripts\activate
```

### 3. Install Backend Dependencies
```bash
pip install -r requirements.txt
```

### 4. Configure Environment Variables
Create a `.env` file in the root directory:
```env
GROQ_API_KEY=your_groq_api_key_here
GROQ_MODEL=openai/gpt-oss-120b
```

---

## 🏃 Running the Application

### 1. Start the Backend Server
Run the FastAPI application using Uvicorn:
```bash
uvicorn main:app --reload --port 8000
```
The API backend will be available at `http://localhost:8000`.

### 2. Launch the Frontend
You can open `index.html` directly in your browser or serve it using any HTTP server (e.g., Live Server extension in VS Code, or Python HTTP module):

```bash
# Optional: run standard python HTTP server for frontend
python -m http.server 3000
```
Then navigate to `http://localhost:3000` (or double-click `index.html`).

---

## 📡 API Endpoints

### `GET /`
Check API status.
- **Response**: `{"status": "online", "message": "Educational Chatbot API is running."}`

### `POST /api/chat`
Send user query and receive AI tutor response.
- **Request Body**:
  ```json
  {
    "message": "What is a quadratic equation?",
    "history": [
      {"role": "user", "content": "Hello"},
      {"role": "assistant", "content": "Hi! What topic would you like to explore today?"}
    ]
  }
  ```
- **Response**:
  ```json
  {
    "reply": "A quadratic equation is any equation that can be written in the form $ax^2 + bx + c = 0$..."
  }
  ```

---

## 🛡️ Security Note

Make sure your `.env` file is included in `.gitignore` to prevent leaking your Groq API keys to public repositories.
