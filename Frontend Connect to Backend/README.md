# Frontend Connect to Backend

This small project contains a backend and a frontend — it was built as a practice to connect the frontend to the backend.

Project structure

- `backend/` — Express backend (server entry: `server.js`).
- `frontend/` — Frontend app (React + Vite; entry: `frontend/src/App.jsx`).

Quick start

1. Start the backend:

```powershell
cd "Frontend Connect to Backend/backend"
npm install
# then start the server (example):
node server.js
# or, if you use nodemon/dev script:
# npm run dev
```

2. Start the frontend:

```powershell
cd "Frontend Connect to Backend/frontend"
npm install
npm run dev
```

3. Open the frontend in your browser (Vite will show the URL) and it will make requests to the backend API (adjust the base API URL in the frontend code if needed).

Notes

- Confirm the backend base URL (for example `http://localhost:3000`) and API base path (for example `/api/products`) match what the frontend expects.
- This repo is for learning and experimentation; remove or rotate any real credentials before publishing.
