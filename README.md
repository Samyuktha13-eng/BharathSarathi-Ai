# 🇮🇳 BharatSarthiAI

### Your AI-Powered Civic Companion

> Empowering every Indian citizen with AI-driven access to government services, schemes, and civic tools — in their own language.

🔗 **Live Demo:** [https://bharath-sarathi-ai.vercel.app](https://bharath-sarathi-ai.vercel.app)

---

## ✨ Features

| Feature | Description |
|---|---|
| 🤖 **AI Assistant** | Ask any government-related question in 8 Indian languages |
| 📋 **Scheme Finder** | Get personalized government scheme recommendations based on your profile |
| 📝 **File Complaint** | Speak or type your issue — AI converts it into a formal complaint letter |
| 🔍 **Track Complaint** | Track your complaint status with a visual timeline |
| 📂 **History** | View, search and delete all past queries, schemes and complaints |
| 🔐 **Auth** | Secure signup and login with input validation |
| 🎤 **Voice Input** | Speak your question or complaint in your language |
| 🌐 **Multilingual** | Supports English, Hindi, Tamil, Telugu, Bengali, Marathi, Gujarati, Kannada |

---

## 🛠 Tech Stack

| Layer | Technology |
|---|---|
| Frontend | React 19, Vite, React Router, React Icons |
| Backend | Vercel Serverless Functions (Node.js) |
| AI | LangChain + Groq (Llama 3.3 70B) |
| Database | MongoDB Atlas |
| Deployment | Vercel |

---

## 🏗 Project Architecture

```
BharatSarthiAI/
├── api/                  # Vercel Serverless Functions
│   ├── chat.js           → POST /api/chat
│   ├── schemes.js        → POST /api/schemes
│   ├── complaint.js      → POST /api/complaint
│   ├── track.js          → GET  /api/track?id=
│   ├── history.js        → GET/DELETE /api/history
│   ├── login.js          → POST /api/login
│   └── signup.js         → POST /api/signup
│
├── lib/                  # Shared backend logic
│   ├── langchain.js      # AI model initialization
│   ├── prompts.js        # All AI prompt templates
│   ├── mongoose.js       # MongoDB connection
│   ├── models.js         # Mongoose schemas
│   └── utils.js          # Helper functions
│
├── client/               # React Frontend
│   └── src/
│       ├── pages/        # Home, Assistant, Schemes, Complaint, Track, History, Login, Signup
│       ├── components/   # Navbar, Spinner, LangSelector, ProtectedRoute
│       ├── context/      # AuthContext (localStorage session)
│       └── hooks/        # useVoice (SpeechRecognition)
│
├── vercel.json           # Vercel deployment config
└── .env                  # Environment variables (not committed)
```

---

## 🚀 Getting Started Locally

### Prerequisites
- Node.js 18+
- MongoDB Atlas account
- Groq API key

### 1. Clone the repository
```bash
git clone https://github.com/Samyuktha13-eng/BharathSarathi-Ai.git
cd BharathSarathi-Ai/smart-bharat
```

### 2. Install dependencies
```bash
# Root (backend)
npm install

# Frontend
cd client && npm install
```

### 3. Set up environment variables
Create a `.env` file in the `smart-bharat/` root:
```env
GROQ_API_KEY=your_groq_api_key
MONGO_URI=your_mongodb_connection_string
```

### 4. Run locally
```bash
# Terminal 1 — Backend
npx vercel dev --listen 5000 --yes

# Terminal 2 — Frontend
cd client && npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

---

## 🌐 API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/chat` | AI Assistant response |
| POST | `/api/schemes` | Personalized scheme recommendations |
| POST | `/api/complaint` | Generate formal complaint |
| GET | `/api/track?id=` | Track complaint by ID |
| GET | `/api/history` | Get all history + stats |
| DELETE | `/api/history` | Delete history item or clear all |
| POST | `/api/signup` | Register new user |
| POST | `/api/login` | Authenticate user |

---

## 🌍 Supported Languages

🇬🇧 English · 🇮🇳 Hindi · Tamil · Telugu · Bengali · Marathi · Gujarati · Kannada

---

## 📸 Demo Flow

1. **Sign up** → lands on personalized dashboard
2. **Ask AI** in Hindi → get response in Hindi
3. **Find Schemes** → enter age, state, occupation → get personalized recommendations
4. **File Complaint** using voice input → AI generates formal letter → get Complaint ID
5. **Track Complaint** → visual timeline showing status
6. **History** → all past activity logged and searchable

---

## 🔐 Environment Variables

| Variable | Description |
|---|---|
| `GROQ_API_KEY` | Groq API key for LLM access |
| `MONGO_URI` | MongoDB Atlas connection string |

---

## 👩‍💻 Built By

**Samyuktha** — Built for Hackathon 2026

---

## 📄 License

MIT License
