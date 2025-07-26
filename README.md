# Chatbot for Customer Support

A full-stack customer support chatbot application built with FastAPI, React, and OpenAI's GPT-3.5 model. The application provides real-time chat functionality with AI-powered responses and persistent message storage.

## Project Structure

```
├── backend/
│   ├── chat_api.py      # FastAPI application
│   ├── chatbot.py       # OpenAI integration
│   ├── schema.sql       # Database schema
│   ├── requirements.txt # Python dependencies
│   └── Dockerfile       # Backend container configuration
├── frontend/
│   ├── src/            # React application source
│   ├── package.json    # Frontend dependencies
│   ├── Dockerfile      # Frontend container configuration
│   └── nginx.conf      # Nginx configuration
└── docker-compose.yml  # Container orchestration
```

## Prerequisites

- Docker and Docker Compose
- OpenAI API key
- Node.js 16+ (for local development)
- Python 3.9+ (for local development)

## Environment Setup

1. Clone the repository:
```bash
git clone https://github.com/jaikersiddharth/chatbot-for-customer-support.git
cd chatbot-for-customer-support
```

2. Create a .env file in the backend directory:
```bash
cd backend
echo "OPENAI_API_KEY=your_openai_api_key_here" > .env
```

Replace `your_openai_api_key_here` with your actual OpenAI API key.

## Running with Docker

1. Make sure Docker Desktop is running on your system.

2. Build and start the containers:
```bash
docker-compose up --build
```

The application will be available at:
- Frontend: http://localhost:80
- Backend API: http://localhost:8000
- Database: localhost:5432

## Local Development

### Backend Setup

1. Create a virtual environment and install dependencies:
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

2. Start the FastAPI server:
```bash
uvicorn chat_api:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Setup

1. Install dependencies:
```bash
cd frontend
npm install
```

2. Start the development server:
```bash
npm start
```

The frontend will be available at http://localhost:3000

## API Endpoints

- `POST /users` - Create a new user
- `POST /sessions` - Create a new chat session
- `POST /messages` - Add a message to a session
- `GET /sessions/{session_id}/messages` - Get all messages in a session
- `POST /api/chat` - Send a message to the chatbot

## Features

- Real-time chat interface
- AI-powered responses using GPT-3.5
- Message persistence in PostgreSQL database
- User session management
- Docker containerization
- CORS support for frontend integration

## Technical Stack

- **Backend:**
  - FastAPI (Python web framework)
  - PostgreSQL (Database)
  - OpenAI API (GPT-3.5 model)
  - psycopg2 (PostgreSQL adapter)

- **Frontend:**
  - React with TypeScript
  - Axios for API calls
  - Node.js development server

- **Infrastructure:**
  - Docker & Docker Compose
  - Nginx (Frontend server)
  - uvicorn (ASGI server)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Create a Pull Request

## License

This project is licensed under the MIT License.
