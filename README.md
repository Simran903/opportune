# Opportune

**AI-Powered Talent Matching Platform for Indian Tech Talent**

Opportune is a full-stack job platform that automatically matches LinkedIn candidates with job requirements using AI-powered skill extraction and matching. Built specifically for connecting employers with top Indian tech talent.

---

## 🚀 Features

- **AI-Powered Candidate Matching**: Automatically scans and matches LinkedIn profiles based on job requirements using KeyBERT and Transformers
- **Dual Authentication**: Email/password and Google OAuth sign-in
- **Security Features**: Rate limiting, CSRF protection, input sanitization, session management, and security logging
- **Modern UI**: Beautiful, responsive design with dark mode support
- **Job Dashboard**: Manage job postings and view matched candidates
- **Real-time Profile Scraping**: FastAPI microservice for LinkedIn profile extraction
- **Focused on Indian Tech Talent**: Specialized matching for Indian developers, designers, and tech professionals

---

## 🏗️ Tech Stack

### Frontend (`client/`)

- **Framework**: Next.js 15.3.4 (React 19, TypeScript)
- **Styling**: Tailwind CSS 4
- **UI Components**: Radix UI
- **Authentication**: React OAuth Google
- **HTTP Client**: Axios
- **State Management**: React Context API

### Backend (`server/`)

- **Runtime**: Node.js with Express 5
- **Language**: TypeScript
- **Database**: PostgreSQL with Prisma ORM
- **Authentication**: JWT, bcrypt, Google Auth Library
- **Validation**: Zod

### Python Microservice (`python-service/`)

- **Framework**: FastAPI
- **ML Libraries**: KeyBERT, Transformers
- **Web Scraping**: BeautifulSoup4, ScraperAPI SDK
- **Server**: Uvicorn

---

## 📁 Project Structure

```
opportune/
├── client/              # Next.js frontend application
│   ├── src/
│   │   ├── app/         # Next.js app router pages
│   │   ├── components/  # React components
│   │   ├── contexts/    # React contexts (Theme, Security, Sidebar)
│   │   ├── hooks/       # Custom React hooks
│   │   └── lib/         # Utilities (axios, security, utils)
│   └── package.json
│
├── server/              # Node.js backend API
│   ├── src/
│   │   ├── controllers/ # Route controllers
│   │   ├── routes/      # Express routes
│   │   ├── middlewares/ # Auth middleware
│   │   ├── config/      # Database config
│   │   └── server.ts    # Express server entry
│   ├── prisma/          # Prisma schema and migrations
│   └── package.json
│
├── python-service/      # FastAPI microservice
│   ├── app.py           # FastAPI application
│   ├── scraper.py       # LinkedIn scraping logic
│   └── requirements.txt
│
└── README.md
```

---

## 🗄️ Database Schema

### Models

- **User**: Authentication and user profiles (supports local and Google OAuth)
- **Job**: Job postings with title, description, location, company
- **Candidate**: Matched LinkedIn profiles linked to jobs

See `server/prisma/schema.prisma` for complete schema definition.

---

## 🚦 Getting Started

### Prerequisites

- Node.js 18+ and npm
- PostgreSQL database
- Python 3.8+ (for microservice)
- Google OAuth credentials (for Google sign-in)

### 1. Frontend Setup

```bash
cd client
npm install
npm run dev
```

Frontend runs on [http://localhost:3000](http://localhost:3000)

**Environment Variables** (optional):

```env
NEXT_PUBLIC_API_URL=http://localhost:5000
NEXT_PUBLIC_GOOGLE_CLIENT_ID=your_google_client_id
```

### 2. Backend Setup

```bash
cd server
npm install

# Set up environment variables
cp .env.example .env  # Create .env file
# Edit .env with your database URL and other configs

# Run database migrations
npx prisma migrate dev
# Or for production: npx prisma migrate deploy

# Generate Prisma client
npx prisma generate

npm run dev
```

Backend API runs on [http://localhost:5000](http://localhost:5000)

**Required Environment Variables**:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/opportune
CORS_ORIGIN=http://localhost:3000
ACCESS_TOKEN_SECRET=your_jwt_secret_key
ACCESS_TOKEN_EXPIRY=24h
GOOGLE_CLIENT_ID=your_google_client_id
```

### 3. Python Microservice Setup

```bash
cd python-service

# Create virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Run the service
uvicorn app:app --host 0.0.0.0 --port 10000 --reload
```

Microservice runs on [http://localhost:10000](http://localhost:10000)

**Environment Variables** (optional):

```env
SCRAPER_API_KEY=your_scraperapi_key
```

### 4. Docker (Optional)

Build and run the Python microservice with Docker:

```bash
cd python-service
docker build -t opportune-python .
docker run -p 10000:10000 opportune-python
```

---

## 📡 API Endpoints

### Authentication (`/user`)

- `POST /user/signup` - Create new user account
- `POST /user/signin` - Email/password login
- `POST /user/google` - Google OAuth login
- `GET /user/user-details` - Get current user (protected)
- `POST /user/update-password` - Update password (protected)

### Jobs (`/job`)

- `POST /job` - Create new job posting (protected)
- `GET /job` - Get all jobs for current user (protected)
- `GET /job/:id` - Get job by ID (protected)
- `DELETE /job/:id` - Delete job (protected)
- `POST /employer/:id/profiles` - Save matched profiles
- `GET /employer/:id/seen-profiles` - Get seen profiles

### Python Microservice (`/scrape`)

- `POST /scrape` - Scrape and match LinkedIn profiles
  ```json
  {
    "description": "Job description text",
    "employer_id": 1
  }
  ```

---

## 🔒 Security Features

The application includes comprehensive security measures:

- **Rate Limiting**: Prevents brute force attacks on login
- **CSRF Protection**: Cross-site request forgery protection
- **Input Sanitization**: XSS prevention through input validation
- **Session Management**: Secure session handling
- **Security Logging**: Audit trail for security events
- **JWT Authentication**: Secure token-based authentication
- **Password Hashing**: bcrypt for password storage

---

## 🎨 UI Features

- **Dark Mode**: Full dark/light theme support
- **Responsive Design**: Mobile-first approach
- **Modern Components**: Radix UI components with custom styling
- **Animations**: Smooth transitions and hover effects
- **Accessibility**: ARIA labels and keyboard navigation

---

## 📝 Available Scripts

### Frontend (`client/`)

```bash
npm run dev      # Start development server with Turbopack
npm run build    # Build for production
npm run start    # Start production server
npm run lint     # Run ESLint
```

### Backend (`server/`)

```bash
npm run dev      # Start development server with hot reload
npm run build    # Compile TypeScript to JavaScript
npm run start    # Start production server
```

### Python Microservice (`python-service/`)

```bash
uvicorn app:app --host 0.0.0.0 --port 10000 --reload  # Development
uvicorn app:app --host 0.0.0.0 --port 10000          # Production
```

---

## 🧪 Development Workflow

1. **Start PostgreSQL database**
2. **Start backend**: `cd server && npm run dev`
3. **Start frontend**: `cd client && npm run dev`
4. **Start Python service**: `cd python-service && uvicorn app:app --reload`

All services should be running simultaneously for full functionality.

---

## 📦 Database Migrations

```bash
cd server

# Create a new migration
npx prisma migrate dev --name migration_name

# Apply migrations (production)
npx prisma migrate deploy

# View database in Prisma Studio
npx prisma studio
```

---

## 🆘 Troubleshooting

### Database Connection Issues

- Verify PostgreSQL is running
- Check `DATABASE_URL` in `.env` file
- Ensure database exists: `CREATE DATABASE opportune;`

### Migration Errors

- Run `npx prisma migrate reset` to reset database (⚠️ deletes all data)
- Or manually fix migration files in `server/prisma/migrations/`

### Google OAuth Not Working

- Verify `GOOGLE_CLIENT_ID` is set correctly
- Check OAuth redirect URIs in Google Cloud Console
- Ensure frontend and backend use same client ID

### Python Service Issues

- Activate virtual environment: `source venv/bin/activate`
- Reinstall dependencies: `pip install -r requirements.txt`
- Check Python version: `python3 --version` (should be 3.8+)
