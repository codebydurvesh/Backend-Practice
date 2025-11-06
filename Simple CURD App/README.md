# Simple CRUD App

- A small Node.js + Express API that uses Mongoose to connect to MongoDB.
- Key files and folders:
  - `index.js` — application entry point (mounts routes at `/api/products`).
  - `routes/` — route definitions (`product.route.js`).
  - `controllers/` — request handlers (`product.controller.js`).
  - `models/` — Mongoose model (`product.model.js`).
  - `package.json` — project metadata and dependencies.

## Tech

- Node.js
- Express
- MongoDB / Mongoose

## Quick start

1. Install dependencies:

```bash
npm install
```

2. Update the MongoDB connection string in `index.js` (or replace it with an environment variable).

3. Start the server:

```bash
npm run dev
```

4. Open or test the API at:

```
http://localhost:3000/
```

API endpoints (mounted at `/api/products`):

- GET `/api/products` — list all products
- GET `/api/products/:id` — get a product by id
- POST `/api/products` — create a product (JSON body)
- PUT `/api/products/:id` — update a product
- DELETE `/api/products/:id` — delete a product

## Notes

- If routes appear to "not work", verify that:

  - the server is running and listening on port 3000,
  - the MongoDB connection succeeds,
  - you are using the correct base path (`/api/products`).

- Environment file:
  - Copy `.env.example` to `.env` and fill in the values

---
