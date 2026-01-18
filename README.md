# 🚀 ConnectIQ — AI-Powered Professional Networking Assistant

![Python](https://img.shields.io/badge/Python-3.9%2B-blue)
![React](https://img.shields.io/badge/React-18-61DAFB)
![FastAPI](https://img.shields.io/badge/FastAPI-0.68%2B-009688)
![Status](https://img.shields.io/badge/Status-Active-success)

**ConnectIQ** is an **AI-powered professional networking assistant** that helps users discover **who to connect with**, **why the connection matters**, and **when the timing is right** — all through a simple intent-based search.

Instead of manually browsing hundreds of profiles, users describe their intent (e.g., *"AI researcher," "startup mentor," "collaboration partner"*), and ConnectIQ intelligently surfaces meaningful connections using **semantic AI matching** and **contextual signals**.

---

## 🎯 The Problem It Solves

Professional networking is often manual, inefficient, and poorly timed. ConnectIQ transforms networking into an intelligent, insight-driven process by helping users:

1.  **Identify** relevant connections instantly.
2.  **Understand** why a specific connection matters.
3.  **Reach out** at the right time with the right context.

---

## ✨ Key Features

- 🔍 **Intent-Based Search:** Search using natural language and semantic similarity.
- 🧠 **AI-Powered Recommendations:** Receive explainable matches based on profile embeddings.
- 🎯 **Opportunity Scoring:** Profiles are ranked by relevance + timing.
- 🔐 **Secure Authentication:** JWT authentication with OAuth2 flows.
- 📜 **Activity Tracking:** View search history and manage saved profiles.
- 🌗 **Modern UI:** Responsive design with Dark Mode support (React + Tailwind).
- 📑 **API Documentation:** Interactive Swagger UI for backend testing.

---

## 🛠️ Tech Stack

### **Backend**
| Tech | Purpose |
| :--- | :--- |
| **FastAPI** | High-performance API framework |
| **SQLAlchemy** | ORM for database management |
| **JWT + OAuth2** | Secure authentication flow |
| **SQLite** | Lightweight database for local development |

### **AI & Machine Learning**
| Tech | Purpose |
| :--- | :--- |
| **Sentence Transformers** | Converting intent/profiles to vector embeddings |
| **Semantic Similarity** | Cosine similarity for matching |
| **Custom Logic** | Explainable ranking & opportunity scoring |

### **Frontend**
| Tech | Purpose |
| :--- | :--- |
| **React** | Component-based UI |
| **Vite** | Fast build tool |
| **Tailwind CSS** | Styling and responsive design |
| **Framer Motion** | UI animations |

---

## 🧪 AI Recommendation Logic

ConnectIQ goes beyond keyword matching by using **Vector Embeddings**:

1.  **Embedding Generation:** The system uses `sentence-transformers` to convert user intent and user profiles into high-dimensional vectors.
2.  **Semantic Comparison:** It calculates the distance between the user's intent vector and profile vectors.
3.  **Scoring Engine:**
    * **Semantic Relevance:** How well the profile matches the search query.
    * **Recent Activity:** How active the user has been recently.
4.  **Output:** Returns an **Opportunity Score**, a **Match Explanation**, and **Contextual Triggers** for outreach.

---

## 📁 Project Structure

```text
AI-Powered-Networking-System/
│
├── ai/
│   ├── ai_engine.py             # Core logic for embeddings & scoring
│   └── pycache/
│
├── backend/
│   ├── auth/
│   │   ├── auth_routes.py       # Login/Signup endpoints
│   │   ├── auth_utils.py        # Hashing & Token generation
│   │   └── __init__.py
│   │
│   ├── data/
│   │   ├── devpost_fetcher.py   # Data aggregation scripts
│   │   ├── github_fetcher.py
│   │   ├── scholar_fetcher.py
│   │   ├── fallback.py
│   │   ├── profile_loader.py
│   │   └── mock_profiles.json   # Seed data
│   │
│   ├── db/
│   │   ├── database.py          # DB Connection
│   │   ├── models.py            # SQL Tables
│   │   └── __init__.py
│   │
│   ├── routes/
│   │   └── user_routes.py       # User-specific API routes
│   │
│   ├── main.py                  # App entry point
│   └── requirements.txt
│
├── connectiq-frontend/
│   ├── src/
│   │   ├── components/
│   │   │   ├── LoginBox.jsx
│   │   │   ├── SignupBox.jsx
│   │   │   └── ProtectedTest.jsx
│   │   │
│   │   ├── api.js               # API Wrapper
│   │   ├── auth.js              # Auth logic
│   │   ├── token.js             # LocalStorage management
│   │   ├── App.jsx              # Main UI logic
│   │   └── main.jsx
│   │
│   ├── public/
│   ├── package.json
│   └── vite.config.js
│
├── connectiq.db                 # SQLite Database
└── README.md
```

---

## ▶️ How to Run Locally

Follow these steps to set up the project on your local machine.

### 1. Backend Setup
Navigate to the backend folder and set up the Python environment.

```bash
cd backend

# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\Scripts\activate
# Mac/Linux:
source venv/bin/activate

# Install dependencies
pip install -r requirements.txt

# Run the server
uvicorn main:app --reload
```
*The backend will start at `http://127.0.0.1:8000`*

### 2. Frontend Setup
Navigate to the frontend folder and install Node dependencies.

```bash
cd connectiq-frontend

# Install dependencies
npm install

# Run the development server
npm run dev
```
*The frontend will start at `http://localhost:5173`*

---

## 📡 API Endpoints & Documentation

Once the backend is running, you can access the interactive Swagger documentation at:
👉 **http://127.0.0.1:8000/docs**

### Authentication
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/auth/signup` | Register a new user |
| `POST` | `/auth/login` | Login & receive JWT access token |

### Core Functionality
| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `POST` | `/recommendations` | Get AI-driven profile recommendations |
| `GET` | `/user/search-history` | Retrieve past search intent history |
| `GET` | `/protected-test` | Verify JWT token validity |
| `GET` | `/health` | System health check |

---

## 🔐 Authentication Flow

1.  **Signup:** User provides credentials; password is securely hashed.
2.  **Login:** Valid credentials return a JWT Access Token.
3.  **Storage:** The frontend stores the token in the browser (LocalStorage/Session).
4.  **Access:** Protected backend routes require the token in the Authorization header.

---

## ⚠️ Development Challenges & Solutions

During development, several challenges were encountered and resolved:

* **JWT & OAuth2:** Misconfiguration in the Swagger UI authorization flow was resolved by aligning the token URL scheme.
* **Data Integrity:** Handling circular imports within the backend architecture required strict refactoring of database and model initializations.
* **API Contracts:** Aligning the React frontend state management with FastAPI's JSON response structure required iterative debugging.

---

## 🚧 Project Status

* ✅ **Core Logic:** AI recommendation engine functioning.
* ✅ **Security:** Full authentication suite implemented.
* ✅ **UI:** Responsive frontend integrated with backend.
* ⏳ **Deployment:** Pending (Currently runs locally).

---

## 🤝 Contributors

* **AI / ML:** Semantic matching & scoring logic.
* **Backend:** API architecture, authentication, and data flow.
* **Frontend:** UI/UX design and API integration.

---

*Built with ❤️ for better connections.*
