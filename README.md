# Arvyax Full Stack Internship Assignment

**Task:** Build a Secure Wellness Session Platform with Auth, Drafts, and Auto-Save

## Summary
A MERN full-stack app that lets users register/login, view public wellness sessions (yoga, meditation, etc.), create/edit their own sessions, auto-save drafts and publish sessions. Uses JWT auth, MongoDB (Atlas), and a React + Tailwind frontend.

## Tech Stack
- Frontend: React (Vite), TailwindCSS, Axios, React Router  
- Backend: Node.js, Express, Mongoose (MongoDB)  
- Auth: JWT (jsonwebtoken) + bcrypt  
- Dev tools: react-hot-toast (recommended)  

## Core Features
- Register & Login (passwords hashed)  
- JWT-protected routes  
- Public sessions listing  
- User sessions: create / auto-save draft / edit / publish  
- Session editor with Title, Tags, JSON URL, Save Draft & Publish  
- Auto-save after 5s of inactivity (debounced)  
- Toast feedback for auto-save/publish

## Required Environment Variables

# Environment Setup Guide

## Backend Configuration

Create `server/.env` file:

```env
PORT=5001
MONGO_URI=<your_mongo_atlas_uri>
JWT_SECRET=<your_jwt_secret>
JWT_REFRESH_SECRET=<your_refresh_secret>
CLIENT_URL=http://localhost:5173
BCRYPT_SALT_ROUNDS=12
```

*Note: Change `CLIENT_URL` to production origin when deployed (no trailing slash)*

## Frontend Configuration

Create `client/.env` file:

```env
VITE_API_BASE_URL=http://localhost:5001/api
VITE_APP_NAME="Arvyax App"
```

*Note: In production, set `VITE_API_BASE_URL` to your deployed backend (e.g. `https://your-backend.onrender.com/api`)*

## Quick Start (Local Development)

### Backend
```bash
cd server
npm install
node server.js
```

### Frontend
```bash
cd client
npm install
npm run dev
# open http://localhost:5173
```

## Demo Data

Use this JSON to create a published session (Postman/Thunder Client):

```json
{
  "title": "Morning Yoga Flow for Flexibility",
  "tags": ["yoga","flexibility","morning"],
  "jsonUrl": "https://example.com/sessions/morning-yoga.json",
  "status": "published"
}
```
