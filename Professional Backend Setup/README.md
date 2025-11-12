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

Authentication & Model layer updates

- `User` model (`src/models/user.models.js`) with fields: `username`, `email`, `fullName`, `avatar`, `coverImage`, `watchHistory` (ref: `Video`), `password`, `refreshToken`.
- Pre‑save password hashing using **bcrypt** (secure one‑way hashing before persistence).
- Instance method `isPasswordCorrect(password)` for credential verification.
- JWT helpers on the model to generate:
  - Access Token (includes `_id`, `email`, `username`, `fullName`).
  - Refresh Token (includes `_id` only) for session renewal.
- Environment‑driven token secrets & expiries improve security and make rotation easy.
- Indexes on frequently queried fields (`username`, `fullName`) for more efficient lookups.

Required auth environment variables (add these to your `.env`):

```dotenv
ACCESS_TOKEN_SECRET=change_me_access_secret
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=change_me_refresh_secret
REFRESH_TOKEN_EXPIRY=7d
MONGODB_URI=your_mongo_connection_string
PORT=8000
CORS_ORIGIN=http://localhost:5173
```

Example login flow (simplified):

```js
import { User } from "../models/user.models.js";

async function loginController(req, res) {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user || !(await user.isPasswordCorrect(password))) {
    return res.status(401).json({ message: "Invalid credentials" });
  }

  const accessToken = user.generateAccessToken();
  const refreshToken = user.generateRefreshToken();
  user.refreshToken = refreshToken;
  await user.save({ validateBeforeSave: false });

  res
    .cookie("refreshToken", refreshToken, {
      httpOnly: true,
      secure: true,
      sameSite: "strict",
      path: "/",
    })
    .json({ accessToken });
}
```

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
- Further improvements planned:
  - incorporate `ApiResponse`/`ApiError` consistently in controllers
  - add health-check and metrics endpoints
  - implement refresh token rotation & revocation (blacklist or versioning)
  - production checklist (indexes, rate limiting, logging correlation IDs, monitoring)
