# API Testing Guide

Test your backend API using these curl commands or import them into Postman/Thunder Client.

## Base URL
```
http://localhost:5001/api
```

## 🔍 Health Check

```bash
curl http://localhost:5001/
```

**Expected Response:**
```json
{"message":"API is running..."}
```

---

## 🔐 Authentication Endpoints

### 1. Signup (Register New User)

```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "testuser",
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "username": "testuser",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### 2. Login

```bash
curl -X POST http://localhost:5001/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "password123"
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "username": "testuser",
  "email": "test@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**💡 Save the token from the response for authenticated requests!**

### 3. Get Current User (Protected)

```bash
curl -X GET http://localhost:5001/api/auth/me \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

---

## 📝 Post Endpoints

### 1. Get All Posts (Public)

```bash
curl http://localhost:5001/api/posts
```

### 2. Get Single Post by ID

```bash
curl http://localhost:5001/api/posts/POST_ID_HERE
```

### 3. Create New Post (Protected)

```bash
curl -X POST http://localhost:5001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post. It can be as long as you want!",
    "tags": ["javascript", "nodejs", "mongodb"]
  }'
```

**Expected Response:**
```json
{
  "_id": "...",
  "title": "My First Blog Post",
  "content": "This is the content...",
  "author": {
    "_id": "...",
    "username": "testuser",
    "profilePicture": ""
  },
  "likes": [],
  "comments": [],
  "tags": ["javascript", "nodejs", "mongodb"],
  "createdAt": "2024-...",
  "updatedAt": "2024-..."
}
```

### 4. Update Post (Protected)

```bash
curl -X PUT http://localhost:5001/api/posts/POST_ID_HERE \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "title": "Updated Title",
    "content": "Updated content"
  }'
```

### 5. Delete Post (Protected)

```bash
curl -X DELETE http://localhost:5001/api/posts/POST_ID_HERE \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

### 6. Like/Unlike Post (Protected)

```bash
curl -X POST http://localhost:5001/api/posts/POST_ID_HERE/like \
  -H "Authorization: Bearer YOUR_TOKEN_HERE"
```

**Note:** Calling this endpoint again will unlike the post.

### 7. Add Comment to Post (Protected)

```bash
curl -X POST http://localhost:5001/api/posts/POST_ID_HERE/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -d '{
    "text": "Great post! Very informative."
  }'
```

---

## 🧪 Complete Testing Flow

### Step 1: Create a new user
```bash
curl -X POST http://localhost:5001/api/auth/signup \
  -H "Content-Type: application/json" \
  -d '{
    "username": "johndoe",
    "email": "john@example.com",
    "password": "test1234"
  }'
```

**Copy the token from response!**

### Step 2: Create a post
```bash
# Replace YOUR_TOKEN with the actual token from step 1
curl -X POST http://localhost:5001/api/posts \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "title": "Getting Started with Node.js",
    "content": "Node.js is a powerful runtime environment...",
    "tags": ["nodejs", "backend", "javascript"]
  }'
```

**Copy the post _id from response!**

### Step 3: Get all posts
```bash
curl http://localhost:5001/api/posts
```

### Step 4: Like the post
```bash
# Replace YOUR_TOKEN and POST_ID
curl -X POST http://localhost:5001/api/posts/POST_ID/like \
  -H "Authorization: Bearer YOUR_TOKEN"
```

### Step 5: Add a comment
```bash
# Replace YOUR_TOKEN and POST_ID
curl -X POST http://localhost:5001/api/posts/POST_ID/comment \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "text": "Awesome post! Thanks for sharing."
  }'
```

---

## 📌 Using Postman or Thunder Client

### Import as cURL

1. Open Postman/Thunder Client
2. Click "Import" → "Raw Text"
3. Paste any of the above curl commands
4. Click "Import"
5. The request will be automatically configured

### Set Environment Variables

Create these variables for easier testing:

- `BASE_URL`: `http://localhost:5001/api`
- `TOKEN`: Your JWT token (update after login)
- `POST_ID`: A post ID (update after creating a post)

Then use them in requests:
- URL: `{{BASE_URL}}/posts`
- Authorization: `Bearer {{TOKEN}}`

---

## ⚠️ Common Error Responses

### 400 Bad Request
```json
{
  "message": "User already exists"
}
```

### 401 Unauthorized
```json
{
  "message": "Not authorized, no token"
}
```

### 404 Not Found
```json
{
  "message": "Post not found"
}
```

### 500 Server Error
```json
{
  "message": "Error message here",
  "stack": "..." // Only in development mode
}
```

---

## ✅ Success!

If you can successfully:
1. ✅ Create a user
2. ✅ Login and get a token
3. ✅ Create a post
4. ✅ Get all posts
5. ✅ Like and comment on posts

**Your backend is fully functional! 🎉**

Now you can connect your React frontend to these endpoints!
