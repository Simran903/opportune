# Opportune Monorepo

This repository contains a full-stack job platform with:
- **Frontend**: Next.js (React, TypeScript, Tailwind CSS)
- **Backend**: Node.js (Express, TypeScript, Prisma/PostgreSQL)
- **Microservice**: Python (FastAPI, Selenium, KeyBERT, Transformers)

---

## Project Structure

```
.
├── client/   # Next.js frontend
├── server/   # Node.js backend & Python microservice
└── README.md # (this file)
```

---

## 1. Frontend (client/)
- Built with [Next.js](https://nextjs.org/) and TypeScript
- UI: Tailwind CSS

### Setup & Development
```bash
cd client
npm install
npm run dev
```
Visit [http://localhost:3000](http://localhost:3000)

---

## 2. Backend API (server/)
- Node.js, Express, TypeScript
- Database: PostgreSQL (via Prisma ORM)
- REST API endpoints for users and jobs

### Setup & Development
```bash
cd server
npm install
# Set up your .env file with DATABASE_URL
npx prisma migrate deploy  # or npx prisma migrate dev
npm run dev
```
API runs on [http://localhost:5000](http://localhost:5000)

#### Example .env
```
DATABASE_URL=postgresql://user:password@localhost:5432/opportune
CORS_ORIGIN=http://localhost:3000
```

#### Database
- See `server/prisma/schema.prisma` for models: User, Job, Candidate
- Run migrations with Prisma CLI

---

## 3. Python Microservice (server/python/)
- FastAPI app for scraping and ML-based candidate matching
- Uses Selenium, KeyBERT, Transformers, scikit-learn

### Setup & Development
```bash
cd server/python
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt
uvicorn app:app --host 0.0.0.0 --port 10000
```
Service runs on [http://localhost:10000](http://localhost:10000)

### Docker
Build and run the microservice with Docker:
```bash
docker build -t opportune-python .
docker run -p 10000:10000 opportune-python
```

---

## Environment Variables
- `client/` may use NEXT_PUBLIC_ variables for API URLs
- `server/` requires `DATABASE_URL` and optionally `CORS_ORIGIN`

---

## Scripts
- `client/`: `npm run dev`, `build`, `start`, `lint`
- `server/`: `npm run dev`, `build`, `start`
- `server/python/`: `uvicorn app:app ...` or use Docker
