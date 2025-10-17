````markdown name=README.md
# Express Products API

A RESTful API built with Express.js for managing a simple `products` resource. This project implements standard CRUD operations, middleware (logging, authentication, validation), global error handling, and advanced features such as filtering, pagination, search, and basic statistics. The API uses an in-memory datastore for ease of grading; you can swap it for a real database (MongoDB, Postgres) if needed.

---

## Table of Contents
- Project structure
- Requirements
- Installation
- Environment variables
- Running the server
- API Endpoints
- Middleware & Error Handling
- Examples (curl)
- Notes for submission

---

## Project structure (important files)
- `server.js` — app entry point
- `routes/products.js` — RESTful routes for products
- `controllers/productsController.js` — controller logic and in-memory datastore
- `middleware/logger.js` — request logging middleware
- `middleware/auth.js` — API key authentication middleware
- `middleware/validate.js` — validation middleware for create/update
- `middleware/asyncWrapper.js` — helper to catch async errors
- `errors/errors.js` — custom error classes and global error handler
- `.env.example` — example environment variables you must provide
- `package.json` — dependencies and start scripts

---

## Requirements
- Node.js v18+ (or v16+)
- npm

Recommended installations for converting/creating screenshots (if needed):
- ImageMagick or Inkscape (optional)

---

## Installation
1. Clone the repository:
   git clone <your-repo-url>
   cd <repo-folder>

2. Install dependencies:
   npm install

3. Copy environment example:
   cp .env.example .env
   Then edit `.env` to set `API_KEY` (optional) and `PORT` if you want a different port.

---

## Environment variables
Use `.env` (do not commit secrets). Example variables in `.env.example`:
- `PORT` — port number (default 3000)
- `API_KEY` — if set, protected endpoints require this value in the `x-api-key` header; if empty, create/update/delete are open for local development.

---

## Run
Start server:
npm start

Development (with nodemon if installed):
npm run dev

Default server URL:
http://localhost:3000

Root endpoint:
GET / → returns "Hello World from Express Products API"

---

## API Endpoints

Base path: `/api/products`

1. GET /api/products  
   - List products with filtering and pagination.
   - Query params:
     - `category` — filter by category (case-insensitive exact match)
     - `page` — page number (default: 1)
     - `limit` — items per page (default: 10)
     - `minPrice` / `maxPrice` — numeric price filters
   - Response:
     ```json
     {
       "total": 12,
       "page": 1,
       "limit": 10,
       "data": [ /* product objects */ ]
     }
     ```

2. GET /api/products/:id  
   - Get a single product by `id`.
   - 404 if not found.

3. POST /api/products  
   - Create a new product (protected if `API_KEY` set).
   - Body (JSON, all fields required):
     ```json
     {
       "name": "Product Name",
       "description": "Description",
       "price": 12.5,
       "category": "electronics",
       "inStock": true
     }
     ```
   - Returns 201 with the created product.

4. PUT /api/products/:id  
   - Update an existing product (protected if `API_KEY` set).
   - Accepts partial updates; validated for type correctness.
   - Returns updated product.

5. DELETE /api/products/:id  
   - Delete a product (protected if `API_KEY` set).
   - Returns deleted product details.

6. GET /api/products/search?q=term  
   - Search products by `name` (case-insensitive substring).
   - Returns `{ total, data }`.

7. GET /api/products/stats  
   - Returns product counts grouped by category:
     ```json
     {
       "stats": { "electronics": 3, "stationery": 2 },
       "totalProducts": 5
     }
     ```

---

## Middleware & Validation
- Logger middleware logs method, URL, and timestamp for each request.
- JSON body parsing via `body-parser`.
- Authentication middleware checks `x-api-key` header against `API_KEY` (if configured).
- Validation middleware enforces required fields and types for create and update routes; returns 400 `ValidationError` when invalid.
- Async route handlers are wrapped to forward thrown errors to global error handler.

---

## Error handling
- Uses custom error classes in `errors/errors.js`:
  - `NotFoundError` -> 404
  - `ValidationError` -> 400
  - `UnauthorizedError` -> 401
  - Generic `AppError` -> custom status or 500
- Global error-handler middleware returns JSON:
  ```json
  {
    "error": { "message": "Description", "status": <http-status> }
  }
  ```

---

## Examples (curl)

List products (first page):
curl "http://localhost:3000/api/products?page=1&limit=5"

Filter by category:
curl "http://localhost:3000/api/products?category=electronics"

Create product (with API key):
curl -X POST http://localhost:3000/api/products \
  -H "Content-Type: application/json" \
  -H "x-api-key: YOUR_KEY" \
  -d '{"name":"New","description":"desc","price":10,"category":"misc","inStock":true}'

Search:
curl "http://localhost:3000/api/products/search?q=mouse"

Get stats:
curl "http://localhost:3000/api/products/stats"

---

## Data persistence
This project uses an in-memory array as the data store (located in `controllers/productsController.js`). For real persistence:
- Replace the data array with a database layer (e.g., MongoDB with Mongoose, PostgreSQL).
- Move DB logic into a separate service/data-access module for separation of concerns.

---

## Submission checklist
When submitting to GitHub Classroom or your repo, include:
- All project files (server.js, routes/, controllers/, middleware/, errors/)
- `README.md` (this file)
- `.env.example` (do not commit `.env` with secrets)
- `screenshot.png` (a screenshot of MongoDB Compass or Atlas showing the required data — if your assignment requires one)
- Optionally: `.gitignore` (exclude node_modules)

---

## Notes & tips
- If `API_KEY` is left blank in `.env`, protected endpoints will be open for local development and grading convenience.
- Replace the in-memory store with a DB for production or when required by the assignment.
- Use tools like Postman or Insomnia to exercise the API during grading.

---

If you want, I can also generate a `.gitignore`, `.env.example` (if missing), or a short script of PowerShell commands to initialize the repo on Windows and push these files to GitHub.  
````
