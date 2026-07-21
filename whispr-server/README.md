<div align="center">

# Whispr Server 🛡️⚡

> **whispr-server** is the backend infrastructure for Whispr, engineered with Node.js, Express 5, Socket.io 4, MongoDB (Mongoose), JWT Cookie authentication, Arcjet security engine, Cloudinary image CDN, and Nodemailer email delivery service.

[![Node.js](https://img.shields.io/badge/Node.js-22+-339933?style=for-the-badge&logo=node.js)](https://nodejs.org/)
[![Express](https://img.shields.io/badge/Express-5.x-000000?style=for-the-badge&logo=express)](https://expressjs.com/)
[![Socket.io](https://img.shields.io/badge/Socket.io-4.x-010101?style=for-the-badge&logo=socket.io)](https://socket.io/)
[![MongoDB](https://img.shields.io/badge/MongoDB-Mongoose-47A248?style=for-the-badge&logo=mongodb)](https://www.mongodb.com/)
[![Arcjet](https://img.shields.io/badge/Arcjet-Security Shield-000000?style=for-the-badge)](https://arcjet.com/)

</div>

---

## 🏗️ Robust Backend Design

The server is architected with scalability and security in mind, providing a solid foundation for real-time applications.
- **Middleware Chain:** Modular middleware handles authentication (`auth.middleware`), socket handshakes (`socket.middleware`), and threat mitigation (`arcjet.middleware`) cleanly before requests hit controllers.
- **Event-Driven Resilience:** Asynchronous, non-blocking tasks (like sending emails via Nodemailer) ensure the main event loop remains unblocked, keeping the REST API snappy.
- **Safe State Tracking:** The server safely manages in-memory socket mappings for multi-tab support without leaking memory, automatically persisting "last active" states to MongoDB upon full disconnects.

---

## 🔑 Backend Core Architecture

### 1. **Socket.io Authentication & Multi-Device Tracking**
- **Handshake Authentication**: Sockets are authenticated at handshake level (`io.use(socketIoMiddleware)`) by extracting and verifying the `jwt` cookie from request headers.
- **Multi-Device Mapping**: Tracks user sockets in `userSocketMap = { [userId]: string[] }`. Supports multiple concurrent active tabs/devices per user.
- **Automated Last Active Persistence**: Persists user `lastActive` timestamp to MongoDB only when all active socket connections for a user disconnect.

### 2. **Enterprise Security Shield (Arcjet)**
- **Shield Protection**: Live mode security monitoring against common web vulnerabilities.
- **Bot Detection**: Automated filtering blocking malicious scrapers while allowing search engines.
- **Spoofed Bot Prevention**: Detects and denies spoofed bot user-agents.
- **Rate Limiting**: Sliding window rate-limiter (100 requests per 60 seconds per client).

### 3. **Secure Cookie-Based JWT Auth**
- Issues signed `jwt` cookies configured with `httpOnly`, `sameSite: strict`, and `secure` in production.
- Password hashing utilizing `bcryptjs` with salt rounds.

### 4. **Cloudinary CDN & Email Services**
- Automatic image upload handling via Cloudinary SDK for rich media sharing.
- Asynchronous, non-blocking email dispatches for welcome greetings and security sign-in notifications using HTML templates in Nodemailer.

---

## 📁 Directory Layout

```
whispr-server/src/
├── controllers/
│   ├── auth.controller.js      # Signup, Signin, Signout, Profile Update, Check Auth
│   └── message.controller.js   # Get Contacts, Chat Partners, Message History, Send Message
├── lib/
│   ├── arcjet.js               # Arcjet Shield, Bot Detection, & Rate Limit Rules
│   ├── cloudinary.js           # Cloudinary SDK Configuration
│   ├── db.js                   # MongoDB Connection Handler
│   ├── email.js                # Nodemailer Transporter & Styled HTML Email Templates
│   ├── socket.js               # Socket.io instance, multi-device socket mapping, disconnect handler
│   └── utils.js                # JWT token generator & Cookie configuration
├── middlewares/
│   ├── arcjet.middleware.js    # Arcjet protection middleware for Express routes
│   ├── auth.middleware.js      # JWT cookie verification middleware
│   └── socket.middleware.js    # Socket.io handshake cookie authentication middleware
├── models/
│   ├── message.model.js        # Mongoose Message Schema (senderId, receiverId, text, image)
│   └── user.model.js           # Mongoose User Schema (fullName, email, password, profilePic, lastActive)
├── routes/
│   ├── auth.route.js           # Authentication Endpoints
│   └── message.route.js        # Messaging Endpoints
└── server.js                   # Express application entry point & environment configuration
```

---

## 🌐 API Reference

### Auth Endpoints (`/api/auth`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `POST` | `/api/auth/signup` | No | Creates a new user account, sets JWT cookie, and triggers welcome email |
| `POST` | `/api/auth/signin` | No | Authenticates user credentials, sets JWT cookie, and sends sign-in email |
| `POST` | `/api/auth/signout` | Yes | Clears authentication cookie |
| `GET` | `/api/auth/checkUser` | Yes | Validates current session and returns logged-in user profile |
| `PATCH` | `/api/auth/update-profile` | Yes | Updates user `fullName` and/or uploads `profilePic` to Cloudinary |

### Message Endpoints (`/api/messages`)

| Method | Endpoint | Auth Required | Description |
| :--- | :--- | :--- | :--- |
| `GET` | `/api/messages/contacts` | Yes | Retrieves list of all contacts (excluding current user) |
| `GET` | `/api/messages/chat-partners` | Yes | Fetches users with whom the logged-in user has message history |
| `GET` | `/api/messages/:id` | Yes | Fetches conversation message history between current user and target user |
| `POST` | `/api/messages/send/:id` | Yes | Saves text/image message, and emits real-time `newMessage` via Socket.io |

---

## ⚡ Socket.io Real-Time Events

### Client Emits / Listens

- **`getOnlineUsers`** *(Server -> Client)*: Emits array of active online user IDs whenever a user connects or disconnects.
- **`newMessage`** *(Server -> Target Client)*: Emits new message object to the recipient's socket ID(s) upon message creation.

---

## 🛠️ Environment Configuration

Create a `.env` file in `whispr-server/` with the following parameters:

```env
PORT=3000
MONGODB_URI=mongodb+srv://<username>:<password>@cluster.mongodb.net/whispr
JWT_SECRET=your_jwt_secret_key
CLIENT_URL=http://localhost:5173
NODE_ENV=development

# Cloudinary CDN Credentials
CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

# Gmail SMTP Configuration
EMAIL_USER=your_email@gmail.com
EMAIL_PASS=your_gmail_app_password
EMAIL_FROM=Whispr <your_email@gmail.com>

# Security Shield Key
ARCJET_KEY=ajkey_your_arcjet_key
```

---

## 🚀 Running Server Locally

```bash
# Install dependencies
npm install

# Start in development mode (with nodemon auto-reloading)
npm run dev

# Start in production mode
npm start
```
