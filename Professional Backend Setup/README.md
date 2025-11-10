# Professional Backend Setup

This project contains my practice work for building a backend with a professional structure and production-minded patterns. While working on this project I learned how to set up a maintainable server and how to connect to MongoDB in a reliable, secure way.

Key learnings

- Project structure: separate folders for routes, controllers, models, middlewares and utils to keep code modular and testable.
- Configuration: use environment variables and `.env` (with `dotenv`) to keep secrets out of source code.
- Database connection: connect to MongoDB with Mongoose, handle connection errors, and keep configuration (URI, options) in environment variables.
- Middleware and error handling: use JSON/body parsers, CORS, logging and centralized error handlers to make the app robust.
- Routing and controllers: keep handlers small and focussed (controllers) and register routes from a central place (app entry).
- Deployment considerations: avoid hard-coded credentials, add `.env.example`, and prepare the app to read `PORT` and other runtime settings from env.

How to run (quick)

1. Install dependencies:

```powershell
cd "Professional Backend Setup"
npm install
```

2. Create a `.env` file (or copy `.env.example`) and set your `MONGODB_URI` and `PORT`.

3. Start the server:

```powershell
npm run dev
# or
node src/index.js
```

Notes

- This project is focused on learning best practices for backend setup and secure database connectivity. Before using any credentials in a public repository, rotate secrets and remove them from history.
- If you'd like, I can add a `.env.example`, health-check endpoints, or a short checklist for production-hardening (indexes, monitoring, backups, rate limiting).
