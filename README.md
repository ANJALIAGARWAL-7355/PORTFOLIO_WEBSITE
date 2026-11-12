# Anjali Agarwal — Professional Portfolio 🚀

## PORTFOLIO_WEBSITE

Personal portfolio website of **Anjali Agarwal** — AI/ML Engineer, Full-Stack Developer, and Computer Science Engineering Student.

## 🌟 About
Computer Science Engineering student specializing in Artificial Intelligence and Machine Learning. Passionate about building intelligent systems, developing scalable full-stack solutions, and solving complex algorithmic challenges.

- **GitHub:** [https://github.com/ANJALIAGARWAL-7355](https://github.com/ANJALIAGARWAL-7355)
- **LinkedIn:** [https://www.linkedin.com/in/anjali-agarwal-138a0b399/](https://www.linkedin.com/in/anjali-agarwal-138a0b399/)

## ⚙️ Tech Stack
- **Frontend:** React 18, TypeScript, Three.js, React Three Fiber, GSAP, CSS3
- **Backend:** Python Flask, SQLite, RESTful API
- **AI/ML:** PyTorch, TensorFlow, Scikit-Learn, Transformers, LangChain, Pandas, NumPy

## 🚀 Running the Project

### 1. Frontend
```bash
npm install
npm run dev
```

### 2. Python Backend (Portfolio API & SQLite Storage)
```bash
cd backend
python -m pip install -r requirements.txt
python app.py
```
Backend runs on `http://127.0.0.1:5000` and automatically persists contact submissions and anonymous usage events to `backend/contacts.db`.

The API provides:
- `GET /api/projects` with search, category, technology, status, and pagination filters
- `GET /api/projects/<slug>` and `GET /api/projects/summary`
- `POST /api/contact` with input validation and per-client rate limiting
- Admin-only `GET /api/contact/messages` and `PATCH /api/contact/messages/<id>` for managing submissions
- `POST /api/analytics/events` and admin-only `GET /api/analytics/summary`

Set `CONTACT_ADMIN_TOKEN` before starting the backend to enable the protected message-management and analytics-summary endpoints. Send it as `Authorization: Bearer <token>`. Without a token, those endpoints fail closed. Optional settings include `CORS_ORIGINS` (comma-separated origins), `CONTACTS_DB_PATH`, `CONTACT_RATE_LIMIT` (default `5`), and `CONTACT_RATE_WINDOW` in seconds (default `60`).

The Vite development server proxies `/api` to the local Flask backend. A production deployment must also route `/api` requests to a deployed Python backend.
