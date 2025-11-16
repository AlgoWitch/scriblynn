# Quick Start Guide

## 🚀 Backend is Ready!

Your backend is **fully configured and running** on:
```
http://localhost:5001
```

---

## ✅ What's Working

- ✅ MongoDB Connected
- ✅ Server Running on Port 5001
- ✅ Authentication (Signup/Login) 
- ✅ Post Management (CRUD + Like + Comment)
- ✅ JWT Authentication
- ✅ Password Hashing
- ✅ Error Handling
- ✅ CORS Enabled

---

## 📚 Documentation Files

| File | Purpose |
|------|---------|
| `README.md` | Complete backend documentation |
| `SUMMARY.md` | What has been built (this is the main overview) |
| `API_TESTING.md` | How to test the API with curl/Postman |
| `FRONTEND_INTEGRATION.md` | How to connect your React frontend |
| `QUICK_START.md` | This file - quick reference |

---

## 🎯 Test It Now!

### 1. Health Check
```bash
curl http://localhost:5001/
```

### 2. Create a User
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{"username":"testuser","email":"test@example.com","password":"test123"}'
```

### 3. Get All Posts
```bash
curl http://localhost:5001/api/posts
```

---

## 🔗 Connect Frontend

1. **Read** `FRONTEND_INTEGRATION.md` 
2. **Install** axios in frontend: `npm install axios`
3. **Create** `frontend/src/utils/api.js` with API calls
4. **Update** Login, Signup, and Feed components
5. **Test** the full flow!

---

## 📝 Key Endpoints

### Auth
- `POST /api/auth/signup` - Sign up
- `POST /api/auth/login` - Login  
- `GET /api/auth/me` - Get current user (needs token)

### Posts
- `GET /api/posts` - Get all posts
- `POST /api/posts` - Create post (needs token)
- `POST /api/posts/:id/like` - Like post (needs token)
- `POST /api/posts/:id/comment` - Comment (needs token)

---

## 🔑 Important Info

**MongoDB Connection:**
```
mongodb+srv://shreya212suman_db_user:shreya2028@cluster0.mzpm5yb.mongodb.net/blogDB
```

**JWT Secret:**
```
your_super_secret_jwt_key_change_this_in_production_12345
```
⚠️ Change this in production!

**Port:** 5001

---

## 🛠️ Commands

### Start Backend
```bash
cd backend
npm run dev
```

### Stop Backend
Press `Ctrl + C` in terminal

### Restart Backend
```bash
npm run dev
```

### Install New Package
```bash
npm install package-name
```

---

## 📂 Project Structure

```
backend/
├── src/
│   ├── config/db.js           # MongoDB connection
│   ├── controllers/           # Business logic
│   ├── middleware/            # Auth & error handling
│   ├── models/                # Database schemas
│   ├── routes/                # API endpoints
│   └── server.js              # Entry point
├── .env                       # Environment variables
├── package.json               # Dependencies
└── [Documentation files]
```

---

## 🎉 You're All Set!

Your backend is **production-ready** (with minor security tweaks needed).

**Next:** Connect your React frontend!

Read `FRONTEND_INTEGRATION.md` for step-by-step instructions.

---

**Happy Coding! 🚀**
