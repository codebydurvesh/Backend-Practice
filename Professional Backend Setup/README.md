# Professional Backend Setup

A production-minded Node.js + Express backend built to learn professional project structure, secure MongoDB connectivity, and JWT-based authentication.

---

## 📚 What I Learned

| Area                  | Key Takeaways                                                                                        |
| --------------------- | ---------------------------------------------------------------------------------------------------- |
| **Project Structure** | Modular folders (`routes/`, `controllers/`, `models/`, `middlewares/`, `utils/`) for maintainability |
| **Configuration**     | Environment variables via `.env` + `dotenv`; secrets never in source                                 |
| **Database**          | Mongoose connection with error handling; deferred server start until DB ready                        |
| **Middleware**        | CORS, body parsing (with limits), cookies, static assets, centralized async error wrapper            |
| **Authentication**    | bcrypt password hashing, JWT access/refresh tokens, secure cookie handling                           |
| **Code Quality**      | Consistent API responses (`ApiResponse`), structured errors (`ApiError`), `asyncHandler` wrapper     |

---

## 🗂️ Project Structure

```
src/
├── app.js              # Express app config & middleware
├── index.js            # Entry point (DB connect → server start)
├── constants.js        # App-wide constants
├── controllers/        # Route handlers
│   └── user.controllers.js
├── db/                 # Database connection
│   └── index.js
├── middlewares/        # Custom middleware
│   └── multer.middlewares.js
├── models/             # Mongoose schemas
│   ├── user.models.js
│   └── video.models.js
├── routes/             # API routes
│   └── user.routes.js
└── utils/              # Helper utilities
    ├── ApiError.js
    ├── ApiResponse.js
    ├── asyncHandler.js
    └── cloudinary.js
```

---

## ⚙️ Setup & Run

1. **Install dependencies**

   ```bash
   npm install
   ```

2. **Configure environment**  
   Create a `.env` file (or copy `.env.example`):

   ```dotenv
   MONGODB_URI=your_mongo_connection_string
   PORT=8000
   CORS_ORIGIN=http://localhost:5173
   ACCESS_TOKEN_SECRET=your_access_secret
   ACCESS_TOKEN_EXPIRY=15m
   REFRESH_TOKEN_SECRET=your_refresh_secret
   REFRESH_TOKEN_EXPIRY=7d
   ```

3. **Start the server**

   ```bash
   npm run dev
   # or
   node src/index.js
   ```

4. **Test the API**
   ```
   POST http://localhost:8000/api/v1/users/register
   ```

---

## 🔐 Authentication Flow

### User Model Features

- Fields: `username`, `email`, `fullName`, `avatar`, `coverImage`, `watchHistory`, `password`, `refreshToken`
- Pre-save hook: password hashed with **bcrypt**
- Methods: `isPasswordCorrect()`, `generateAccessToken()`, `generateRefreshToken()`
- Indexes on `username` and `fullName`

### Example Login (simplified)

```js
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
  })
  .json({ accessToken });
```

---

## 🛠️ Recent Updates

| Component             | Change                                                                                             |
| --------------------- | -------------------------------------------------------------------------------------------------- |
| `app.js`              | CORS (env origin), JSON/URL parsing with limits, static assets, cookie-parser, user routes mounted |
| `index.js`            | Fixed to import configured `app` from `app.js`; server starts after DB connection                  |
| `user.routes.js`      | Added `POST /register` route; fixed `Router()` typo                                                |
| `user.controllers.js` | `registerUser` wrapped with `asyncHandler`                                                         |
| `utils/`              | Added `ApiResponse`, `ApiError`, `asyncHandler` helpers                                            |
| `user.models.js`      | Full User schema with bcrypt + JWT methods                                                         |

---

## 🚀 Future Improvements

- [ ] Use `ApiResponse`/`ApiError` consistently in all controllers
- [ ] Add health-check and metrics endpoints
- [ ] Implement refresh token rotation & revocation
- [ ] Production hardening: rate limiting, logging correlation IDs, monitoring

---

## ⚠️ Security Note

Never commit real secrets. Rotate any credentials that were previously exposed and add `.env` to `.gitignore`.

---

## 📝 Disclaimer

This project is for **learning purposes only**. I am currently in the learning phase of backend development, so please be aware that this code is not from an actual professional backend developer. Feedback and suggestions are always welcome!
