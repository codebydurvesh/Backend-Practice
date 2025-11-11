# Professional Backend Setup

This project contains my practice work for building a backend with a professional structure and production-minded patterns. While working on this project I learned how to set up a maintainable server and how to connect to MongoDB in a reliable, secure way.

Key learnings

- Project structure: separate folders for routes, controllers, models, middlewares and utils to keep code modular and testable.
- Configuration: use environment variables and `.env` (with `dotenv`) to keep secrets out of source code.
- Database connection: connect to MongoDB with Mongoose, handle connection errors, and keep configuration (URI, options) in environment variables.
- Middleware and error handling: use JSON/body parsers, CORS, cookie parsing, static serving and centralized error handlers to make the app robust.
- Routing and controllers: keep handlers small and focused (controllers) and register routes from a central place (app entry).
- Deployment considerations: avoid hard-coded credentials, add `.env.example`, and prepare the app to read `PORT` and other runtime settings from env.

Recent changes (code updates)

- `src/app.js` — added and configured middleware:
  - CORS configured with `origin` and `credentials` from env
  - `express.json()` with a request body size limit
  - `express.urlencoded()` with a size limit
  - `express.static("public")` for serving static assets
  - `cookie-parser()` for cookie handling

- `src/index.js` — improved startup and DB wiring:
  - using `dotenv` (custom env path `./env`)
  - invoking `connectDB()` then starting the server only after successful DB connection
  - basic connection error logging to help startup diagnostics

- `src/utils/` — new utility helpers to standardize responses and error handling:
  - `ApiResponse.js` — small class for consistent API responses
  - `ApiError.js` — custom error class for throwing structured errors
  - `asyncHandler.js` — async wrapper for route handlers (centralizes try/catch)

How to run (quick)

1. Install dependencies:

```powershell
cd "Professional Backend Setup"
npm install
```

2. Create a `.env` file (or copy `.env.example`) and set your `MONGODB_URI`, `PORT`, and `CORS_ORIGIN`.

3. Start the server:

```powershell
npm run dev
# or
node src/index.js
```

Notes

- This project is focused on learning best practices for backend setup and secure database connectivity. Before using any credentials in a public repository, rotate secrets and remove them from history.
- The recent changes added middleware and utility helpers to make request handling, errors, and responses more consistent across the app.
- I will further:
  - add example usage of `ApiResponse`/`ApiError` in controllers,
  - add a health-check endpoint, or
  - provide a short checklist for production-hardening (indexes, monitoring, backups, rate limiting).
