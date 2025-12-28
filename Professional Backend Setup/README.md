# 🚀 Professional Backend Setup

A production-ready **Node.js + Express** backend project built to learn and practice professional backend development patterns, secure MongoDB connectivity, JWT-based authentication, file uploads with Cloudinary, and industry-standard project architecture.

---

## 📚 What I Learned & Technologies Used

### 🛠️ Core Technologies

| Technology                         | Purpose                                                    |
| ---------------------------------- | ---------------------------------------------------------- |
| **Node.js**                        | JavaScript runtime for server-side development             |
| **Express.js v5**                  | Fast, minimalist web framework for building REST APIs      |
| **MongoDB + Mongoose**             | NoSQL database with elegant ODM for data modeling          |
| **JWT (jsonwebtoken)**             | Secure stateless authentication with access/refresh tokens |
| **bcrypt**                         | Password hashing for secure credential storage             |
| **Cloudinary**                     | Cloud-based image and video upload/storage service         |
| **Multer**                         | Middleware for handling multipart/form-data (file uploads) |
| **cookie-parser**                  | Parse and handle HTTP cookies securely                     |
| **CORS**                           | Cross-Origin Resource Sharing configuration                |
| **dotenv**                         | Environment variable management                            |
| **mongoose-aggregate-paginate-v2** | Pagination support for MongoDB aggregation pipelines       |

### 🧠 Key Concepts Learned

| Concept                       | What I Learned                                                                                      |
| ----------------------------- | --------------------------------------------------------------------------------------------------- |
| **Project Architecture**      | Modular MVC-style folder structure (`routes/`, `controllers/`, `models/`, `middlewares/`, `utils/`) |
| **Environment Configuration** | Securing sensitive data using `.env` files; never hardcoding secrets in source code                 |
| **Database Connection**       | Async MongoDB connection with proper error handling; server starts only after DB is ready           |
| **Middleware Chaining**       | Understanding Express middleware flow: CORS → body parsing → cookies → routes → error handling      |
| **Authentication Flow**       | Complete JWT-based auth with access tokens (short-lived) and refresh tokens (long-lived)            |
| **Password Security**         | Using bcrypt with salt rounds for secure password hashing; never storing plain text passwords       |
| **File Upload Pipeline**      | Local temp storage with Multer → Upload to Cloudinary → Cleanup local files                         |
| **MongoDB Aggregation**       | Complex queries using `$lookup`, `$match`, `$addFields`, `$project` for joining collections         |
| **Error Handling**            | Centralized error handling with custom `ApiError` class and `asyncHandler` wrapper                  |
| **API Response Standards**    | Consistent response format using `ApiResponse` class for success responses                          |
| **Mongoose Hooks**            | Pre-save middleware for automatic password hashing before saving to database                        |
| **Schema Methods**            | Custom instance methods on Mongoose schemas (`isPasswordCorrect`, `generateAccessToken`)            |
| **Cookie Security**           | `httpOnly` and `secure` flags for protecting tokens from XSS attacks                                |
| **Route Protection**          | Middleware-based JWT verification for securing private endpoints                                    |

---

## 🗂️ Project Structure

```
Professional Backend Setup/
├── package.json                # Project dependencies & scripts
├── README.md                   # Project documentation
├── .env                        # Environment variables (not committed)
├── public/
│   └── temp/                   # Temporary file storage for uploads
└── src/
    ├── index.js                # Entry point - DB connection & server start
    ├── app.js                  # Express app configuration & middleware setup
    ├── constants.js            # Application-wide constants (DB_NAME)
    ├── controllers/
    │   └── user.controllers.js # User-related business logic & handlers
    ├── db/
    │   └── index.js            # MongoDB connection logic with Mongoose
    ├── middlewares/
    │   ├── auth.middleware.js  # JWT verification middleware
    │   └── multer.middlewares.js # File upload configuration
    ├── models/
    │   ├── user.models.js      # User schema with auth methods
    │   ├── video.models.js     # Video schema with pagination plugin
    │   ├── subscription.models.js # Channel subscription schema
    │   ├── playlist.models.js  # Playlist schema
    │   ├── comment.models.js   # Video comments schema
    │   ├── like.models.js      # Likes schema (videos, comments, tweets)
    │   └── tweet.models.js     # Tweet/post schema
    ├── routes/
    │   └── user.routes.js      # User API route definitions
    └── utils/
        ├── ApiError.js         # Custom error class for API errors
        ├── ApiResponse.js      # Standard API response wrapper
        ├── asyncHandler.js     # Async/await error handling wrapper
        └── cloudinary.js       # Cloudinary upload configuration
```

---

## 🔐 Authentication System (Deep Dive)

### How It Works

```
┌─────────────────────────────────────────────────────────────────┐
│                    AUTHENTICATION FLOW                          │
├─────────────────────────────────────────────────────────────────┤
│                                                                 │
│  1. REGISTER                                                    │
│     User → POST /register → Validate → Hash Password            │
│          → Upload Avatar to Cloudinary → Save to MongoDB        │
│          → Return user (without password)                       │
│                                                                 │
│  2. LOGIN                                                       │
│     User → POST /login → Find user → Compare password (bcrypt)  │
│          → Generate Access Token (15min) + Refresh Token (7d)   │
│          → Store Refresh Token in DB → Set HTTP-only cookies    │
│          → Return tokens + user data                            │
│                                                                 │
│  3. PROTECTED ROUTES                                            │
│     Request → verifyJWT middleware → Extract token from         │
│            cookie/header → Verify with secret → Attach user     │
│            to req.user → Continue to controller                 │
│                                                                 │
│  4. TOKEN REFRESH                                               │
│     Expired Access Token → POST /refresh-token                  │
│          → Verify Refresh Token → Generate new tokens           │
│          → Update Refresh Token in DB → Return new tokens       │
│                                                                 │
│  5. LOGOUT                                                      │
│     User → POST /logout → Clear Refresh Token from DB           │
│          → Clear cookies → Return success                       │
│                                                                 │
└─────────────────────────────────────────────────────────────────┘
```

### User Model Features

The `User` model includes:

| Field          | Type               | Description                           |
| -------------- | ------------------ | ------------------------------------- |
| `username`     | String (indexed)   | Unique, lowercase, trimmed username   |
| `email`        | String (unique)    | User's email address                  |
| `fullName`     | String (indexed)   | User's display name                   |
| `avatar`       | String (required)  | Cloudinary URL for profile picture    |
| `coverImage`   | String (optional)  | Cloudinary URL for cover/banner image |
| `watchHistory` | ObjectId[] → Video | Array of watched video references     |
| `password`     | String (hashed)    | bcrypt hashed password                |
| `refreshToken` | String             | Current valid refresh token           |

### Schema Methods

```javascript
// Password comparison method
userSchema.methods.isPasswordCorrect = async function (password) {
  return await bcrypt.compare(password, this.password);
};

// Generate short-lived access token (contains user info)
userSchema.methods.generateAccessToken = function () {
  return jwt.sign(
    {
      _id: this._id,
      email: this.email,
      username: this.username,
      fullName: this.fullName,
    },
    process.env.ACCESS_TOKEN_SECRET,
    { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
  );
};

// Generate long-lived refresh token (contains only _id)
userSchema.methods.generateRefreshToken = function () {
  return jwt.sign({ _id: this._id }, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRY,
  });
};
```

### Pre-Save Hook for Password Hashing

```javascript
// Automatically hash password before saving (only if new or modified)
userSchema.pre("save", async function (next) {
  if (this.isNew || this.isModified("password")) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
});
```

---

## 📡 API Endpoints

### Base URL: `http://localhost:8000/api/v1`

### User Routes (`/users`)

| Method  | Endpoint             | Access    | Description                          |
| ------- | -------------------- | --------- | ------------------------------------ |
| `POST`  | `/register`          | Public    | Register new user with avatar upload |
| `POST`  | `/login`             | Public    | Login and receive tokens             |
| `POST`  | `/logout`            | Protected | Logout and clear tokens              |
| `POST`  | `/refresh-token`     | Public    | Get new access token                 |
| `POST`  | `/change-password`   | Protected | Change current password              |
| `GET`   | `/current-user`      | Protected | Get logged-in user details           |
| `PATCH` | `/update-account`    | Protected | Update fullName and email            |
| `PATCH` | `/avatar`            | Protected | Update profile avatar                |
| `PATCH` | `/cover-image`       | Protected | Update cover image                   |
| `GET`   | `/channel/:username` | Protected | Get channel profile with stats       |
| `GET`   | `/history`           | Protected | Get user's watch history             |

---

## 🧰 Utility Classes Explained

### 1. ApiError Class

Custom error class extending Node.js `Error` for consistent error responses:

```javascript
class ApiError extends Error {
  constructor(
    statusCode,
    message = "Something went wrong",
    errors = [],
    stack = ""
  ) {
    super(message);
    this.statusCode = statusCode;
    this.data = null;
    this.success = false;
    this.errors = errors;
  }
}

// Usage
throw new ApiError(400, "All fields are required");
throw new ApiError(401, "Invalid user credentials");
throw new ApiError(404, "User doesn't exist!");
```

### 2. ApiResponse Class

Standard wrapper for successful API responses:

```javascript
class ApiResponse {
  constructor(statusCode, data, message = "Success") {
    this.statusCode = statusCode;
    this.data = data;
    this.message = message;
    this.success = statusCode < 400;
  }
}

// Usage
return res
  .status(201)
  .json(new ApiResponse(200, createdUser, "User registered Successfully"));
```

### 3. AsyncHandler Wrapper

Higher-order function to eliminate repetitive try-catch blocks:

```javascript
const asyncHandler = (fn) => async (req, res, next) => {
  try {
    await fn(req, res, next);
  } catch (error) {
    res
      .status(error.code || 500)
      .json({ success: false, message: error.message });
  }
};

// Usage - wraps any async controller function
const registerUser = asyncHandler(async (req, res) => {
  // Your logic here - errors are automatically caught
});
```

---

## 🌐 MongoDB Aggregation Pipelines

### Getting Channel Profile with Subscriber Count

One of the advanced features I learned - using aggregation to join collections:

```javascript
const channel = await User.aggregate([
  { $match: { username: username?.toLowerCase() } },
  {
    $lookup: {
      from: "subscriptions", // Join with subscriptions collection
      localField: "_id", // Match user._id
      foreignField: "channel", // With subscription.channel
      as: "subscribers", // Store as subscribers array
    },
  },
  {
    $lookup: {
      from: "subscriptions",
      localField: "_id",
      foreignField: "subscriber",
      as: "subscribedTo", // Channels this user subscribes to
    },
  },
  {
    $addFields: {
      subscribersCount: { $size: "$subscribers" },
      channelsSubscribedToCount: { $size: "$subscribedTo" },
      isSubscribed: {
        $cond: {
          if: { $in: [req.user?._id, "$subscribers.subscriber"] },
          then: true,
          else: false,
        },
      },
    },
  },
  {
    $project: {
      fullName: 1,
      username: 1,
      subscribersCount: 1,
      channelsSubscribedToCount: 1,
      isSubscribed: 1,
      avatar: 1,
      coverImage: 1,
      email: 1,
    },
  },
]);
```

---

## 📤 File Upload Flow (Multer + Cloudinary)

```
┌────────────────────────────────────────────────────────────┐
│                    FILE UPLOAD PIPELINE                    │
├────────────────────────────────────────────────────────────┤
│                                                            │
│  1. Client sends multipart/form-data with file             │
│                    ↓                                       │
│  2. Multer middleware intercepts request                   │
│     - Saves file temporarily to ./public/temp              │
│     - Attaches file info to req.files                      │
│                    ↓                                       │
│  3. Controller extracts local file path                    │
│     const avatarLocalPath = req.files?.avatar[0]?.path     │
│                    ↓                                       │
│  4. Upload to Cloudinary                                   │
│     const avatar = await uploadOnCloudinary(avatarLocalPath)│
│                    ↓                                       │
│  5. Cloudinary returns URL, delete local temp file         │
│     fs.unlinkSync(localFilePath)                           │
│                    ↓                                       │
│  6. Save Cloudinary URL to database                        │
│                                                            │
└────────────────────────────────────────────────────────────┘
```

### Cloudinary Configuration

```javascript
import { v2 as cloudinary } from "cloudinary";
import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const response = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto", // Automatically detect file type
    });

    fs.unlinkSync(localFilePath); // Cleanup temp file
    return response;
  } catch (error) {
    fs.unlinkSync(localFilePath); // Cleanup on failure too
    return null;
  }
};
```

---

## ⚙️ Setup & Installation

### Prerequisites

- Node.js v18+ installed
- MongoDB Atlas account or local MongoDB instance
- Cloudinary account (free tier works)

### 1. Clone & Install Dependencies

```bash
cd "Professional Backend Setup"
npm install
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```dotenv
# Database
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net
DB_NAME=mydatabase

# Server
PORT=8000
CORS_ORIGIN=http://localhost:5173

# JWT Secrets (use strong random strings in production)
ACCESS_TOKEN_SECRET=your-super-secret-access-token-key
ACCESS_TOKEN_EXPIRY=15m
REFRESH_TOKEN_SECRET=your-super-secret-refresh-token-key
REFRESH_TOKEN_EXPIRY=7d

# Cloudinary
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
```

### 3. Start the Server

```bash
# Development mode with hot reload
npm run dev

# Production mode
node src/index.js
```

### 4. Test the API

```bash
# Register a new user
POST http://localhost:8000/api/v1/users/register
Content-Type: multipart/form-data

fullName: John Doe
username: johndoe
email: john@example.com
password: securepassword123
avatar: [file upload]

# Login
POST http://localhost:8000/api/v1/users/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "securepassword123"
}
```

---

## 📦 Dependencies

### Production Dependencies

| Package                          | Version | Purpose                           |
| -------------------------------- | ------- | --------------------------------- |
| `express`                        | ^5.1.0  | Web framework                     |
| `mongoose`                       | ^8.19.3 | MongoDB ODM                       |
| `bcrypt`                         | ^6.0.0  | Password hashing                  |
| `jsonwebtoken`                   | ^9.0.2  | JWT token generation/verification |
| `cloudinary`                     | ^2.8.0  | Cloud file storage                |
| `multer`                         | ^2.0.2  | File upload handling              |
| `cookie-parser`                  | ^1.4.7  | Cookie parsing middleware         |
| `cors`                           | ^2.8.5  | Cross-origin resource sharing     |
| `dotenv`                         | ^17.2.3 | Environment variable loader       |
| `mongoose-aggregate-paginate-v2` | ^1.1.4  | Aggregation pagination            |

### Dev Dependencies

| Package    | Version | Purpose                      |
| ---------- | ------- | ---------------------------- |
| `nodemon`  | ^3.1.10 | Auto-restart on file changes |
| `prettier` | ^3.6.2  | Code formatting              |

---

## 🗃️ Data Models Overview

### Relationships Diagram

```
┌─────────────┐     ┌──────────────────┐     ┌─────────────┐
│    User     │────<│   Subscription   │>────│    User     │
│  (channel)  │     │  (subscriber →   │     │(subscriber) │
└─────────────┘     │   ← channel)     │     └─────────────┘
       │            └──────────────────┘
       │
       ├──────────< Video >──────────────────────┐
       │              │                          │
       │              ├────────< Comment         │
       │              │           (owner, video) │
       │              │                          │
       │              └────────< Like            │
       │                         (video, likedBy)│
       │                                         │
       ├──────────< Playlist                     │
       │            (owner, videos[])            │
       │                                         │
       └──────────< Tweet                        │
                    (owner, content)             │
                         │                       │
                         └───────< Like          │
                                  (tweet, likedBy)
```

---

## 🚀 Future Improvements

- [ ] Implement video upload and streaming functionality
- [ ] Add rate limiting to prevent API abuse
- [ ] Implement email verification on registration
- [ ] Add forgot password / password reset flow
- [ ] Implement refresh token rotation for enhanced security
- [ ] Add request logging with correlation IDs
- [ ] Write unit and integration tests
- [ ] Add Swagger/OpenAPI documentation
- [ ] Implement health-check and metrics endpoints
- [ ] Add input validation using Joi or Zod
- [ ] Deploy to production (Railway, Render, or AWS)

---

## ⚠️ Security Best Practices Followed

| Practice              | Implementation                                           |
| --------------------- | -------------------------------------------------------- |
| Password Hashing      | bcrypt with 10 salt rounds                               |
| JWT Tokens            | Separate access (short) and refresh (long) tokens        |
| HTTP-Only Cookies     | Tokens stored in cookies inaccessible to JavaScript      |
| Environment Variables | Secrets stored in `.env`, never committed                |
| Input Validation      | Check for empty fields, existing users before operations |
| Secure Token Storage  | Refresh token stored in database, verified on each use   |
| File Cleanup          | Temporary files deleted after Cloudinary upload          |

---

## 📝 Lessons & Challenges

### Things That Tripped Me Up

1. **Password Not Hashing**: Initially used `this.isModified("password")` alone in pre-save hook, but it didn't work for new documents. Fixed by adding `this.isNew` check.

2. **Mongoose vs MongoDB ID**: Learned that `req.user._id` from JWT is a string, but MongoDB needs `ObjectId`. Fixed using `new mongoose.Types.ObjectId()` in aggregation pipelines.

3. **File Upload Order**: Multer must run before accessing `req.files`. Route order matters!

4. **Cookie Not Setting**: Forgot `credentials: true` in CORS config and fetch requests.

---

## 📜 License

ISC

---

## 📝 Disclaimer
This project is not a completed, there are some controllers and routes to add of the remaining models.
It is for **learning purposes only**. I am currently in the learning phase of backend development. The code demonstrates concepts I've learned but may not represent production-ready standards. Feedback, suggestions, and constructive criticism are always welcome!

---

