# FarmConnect
### Farmer-to-Consumer Direct Marketplace | MERN Stack

A hyperlocal web application that connects small-scale farmers directly 
with nearby consumers, eliminating middlemen and ensuring fair pricing 
for both sides.


---

## Tech Stack
| Layer | Technology |
|---|---|
| Frontend | React 18, Vite, Tailwind CSS, React Router v6 |
| Backend | Node.js, Express.js |
| Database | MongoDB Atlas, Mongoose |
| Auth | JWT, Bcrypt.js |
| State | React Context API |
| HTTP | Axios |

---

## Features
- Role-based auth — separate Farmer and Consumer flows
- Produce listing with CRUD for farmers
- Hyperlocal marketplace with category and price filters
- Pre-order system with harvest date
- Cart with localStorage persistence
- Order tracking with status updates
- 2dsphere geospatial indexing for location-based discovery

---

## Project Structure

This project is a monorepo containing both the frontend and backend codebases.

```text
FarmConnect/
├── backend/                  # Express server & API
│   ├── config/               # Database and environment configurations
│   ├── controllers/          # Route handlers
│   ├── middleware/           # JWT and error handling middlewares
│   ├── models/               # Mongoose models (User, Produce, Order)
│   ├── routes/               # Express API routes
│   └── server.js             # Entry point for backend
│
└── frontend/                 # React application
    ├── public/               # Static assets
    ├── src/
    │   ├── components/       # Reusable UI components
    │   ├── context/          # React Context (Auth, Cart, etc.)
    │   ├── pages/            # Application pages (Home, Dashboard, Market, etc.)
    │   ├── services/         # API integration (Axios)
    │   └── App.jsx           # Main React component
```

---

## Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (Atlas URI or Local Instance)
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone [Your GitHub Repository Link here]
   cd FarmConnect
   ```

2. **Backend Setup**
   ```bash
   cd backend
   npm install
   ```
   Create a `.env` file in the `backend` directory:
   ```env
   PORT=5000
   MONGO_URI=your_mongodb_connection_string
   JWT_SECRET=your_jwt_secret_key
   ```
   Start the backend server:
   ```bash
   npm run dev
   ```

3. **Frontend Setup**
   Open a new terminal window:
   ```bash
   cd frontend
   npm install
   ```
   Create a `.env` file in the `frontend` directory (if needed):
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```
   Start the React development server:
   ```bash
   npm run dev
   ```

---

## API Documentation (Brief Overview)

| Endpoint | Method | Description | Access |
|---|---|---|---|
| `/api/auth/register` | POST | Register a new user (Farmer/Consumer) | Public |
| `/api/auth/login` | POST | Authenticate user & get token | Public |
| `/api/produce` | GET | Get all available produce | Public |
| `/api/produce` | POST | Add new produce listing | Farmer |
| `/api/orders` | POST | Place a new order | Consumer |
| `/api/orders/:userId` | GET | Get orders for specific user | Private |

---

## GitHub Repository
The complete source code is maintained on GitHub, providing version control, collaboration, and a clear history of all development activity.

**Link:** [Your GitHub Repository Link here]
