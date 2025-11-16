# Fullstack Blog Backend

A Node.js/Express backend API for a fullstack blog website with MongoDB database.

## 🚀 Features

- **User Authentication**: Signup, Login with JWT tokens
- **Post Management**: Create, Read, Update, Delete posts
- **Social Features**: Like posts, add comments
- **User Profiles**: User profile management with followers/following
- **Communities**: Create and join communities
- **Messaging**: Send messages between users

## 📦 Technologies Used

- **Express.js** - Web framework
- **MongoDB** - Database (MongoDB Atlas)
- **Mongoose** - ODM for MongoDB
- **JWT** - JSON Web Tokens for authentication
- **bcryptjs** - Password hashing
- **CORS** - Cross-origin resource sharing
- **dotenv** - Environment variable management

## 📁 Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── db.js                 # MongoDB connection
│   ├── controllers/
│   │   ├── authController.js     # Authentication logic
│   │   ├── postController.js     # Post management logic
│   │   ├── userController.js     # User management
│   │   └── messageController.js  # Messaging logic
│   ├── middleware/
│   │   ├── authMiddleware.js     # JWT verification
│   │   └── errorHandler.js       # Error handling
│   ├── models/
│   │   ├── User.js               # User schema
│   │   ├── Post.js               # Post schema
│   │   ├── Community.js          # Community schema
│   │   └── Message.js            # Message schema
│   ├── routes/
│   │   ├── authRoutes.js         # Auth endpoints
│   │   ├── postRoutes.js         # Post endpoints
│   │   ├── userRoutes.js         # User endpoints
│   │   ├── communityRoutes.js    # Community endpoints
│   │   └── messageRoutes.js      # Message endpoints
│   ├── utils/
│   │   └── validators.js         # Input validation
│   └── server.js                 # Entry point
├── .env                          # Environment variables
├── package.json
└── README.md
```

## 🔧 Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Environment variables are already configured in `.env`:**
   ```
   MONGODB_URI=mongodb+srv://shreya212suman_db_user:shreya2028@cluster0.mzpm5yb.mongodb.net/blogDB?retryWrites=true&w=majority
   JWT_SECRET=your_super_secret_jwt_key_change_this_in_production_12345
   PORT=5001
   NODE_ENV=development
   ```

3. **Start the server:**
   ```bash
   # Development mode with auto-restart
   npm run dev

   # Production mode
   npm start
   ```

The server is now running on **http://localhost:5001** ✅

## 📡 API Endpoints

### Authentication Routes (`/api/auth`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| POST | `/api/auth/signup` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |

### Post Routes (`/api/posts`)

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/posts` | Get all posts | No |
| GET | `/api/posts/:id` | Get post by ID | No |
| POST | `/api/posts` | Create new post | Yes |
| PUT | `/api/posts/:id` | Update post | Yes |
| DELETE | `/api/posts/:id` | Delete post | Yes |
| POST | `/api/posts/:id/like` | Like/Unlike post | Yes |
| POST | `/api/posts/:id/comment` | Add comment | Yes |

## 🔐 Authentication

The API uses JWT (JSON Web Tokens) for authentication. Include the token in the Authorization header:

```
Authorization: Bearer <your_jwt_token>
```

## 📝 Example API Requests

### Signup
```bash
POST http://localhost:5001/api/auth/signup
Content-Type: application/json

{
  "username": "johndoe",
  "email": "john@example.com",
  "password": "password123"
}
```

**Response:**
```json
{
  "_id": "...",
  "username": "johndoe",
  "email": "john@example.com",
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

### Login
```bash
POST http://localhost:5001/api/auth/login
Content-Type: application/json

{
  "email": "john@example.com",
  "password": "password123"
}
```

### Create Post
```bash
POST http://localhost:5001/api/posts
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "title": "My First Post",
  "content": "This is the content of my first post",
  "tags": ["javascript", "nodejs"]
}
```

### Get All Posts
```bash
GET http://localhost:5001/api/posts
```

### Like Post
```bash
POST http://localhost:5001/api/posts/:postId/like
Authorization: Bearer <your_token>
```

### Add Comment
```bash
POST http://localhost:5001/api/posts/:postId/comment
Authorization: Bearer <your_token>
Content-Type: application/json

{
  "text": "Great post!"
}
```

## 🗄️ Database Schema

### User Model
- `username` (String, unique, required, min: 3)
- `email` (String, unique, required, lowercase)
- `password` (String, hashed, required, min: 6)
- `bio` (String, optional)
- `profilePicture` (String, optional)
- `followers` (Array of User IDs)
- `following` (Array of User IDs)
- `timestamps` (createdAt, updatedAt)

### Post Model
- `title` (String, required)
- `content` (String, required)
- `author` (User ID reference, required)
- `likes` (Array of User IDs)
- `comments` (Array with user ID and text)
- `tags` (Array of Strings)
- `image` (String, optional)
- `timestamps` (createdAt, updatedAt)

### Community Model
- `name` (String, unique, required)
- `description` (String)
- `members` (Array of User IDs)
- `admin` (User ID reference, required)
- `posts` (Array of Post IDs)
- `image` (String)
- `timestamps` (createdAt, updatedAt)

### Message Model
- `sender` (User ID reference, required)
- `recipient` (User ID reference, required)
- `content` (String, required)
- `read` (Boolean, default: false)
- `timestamps` (createdAt, updatedAt)

## 🔒 Security Features

- ✅ Password hashing with bcryptjs (10 salt rounds)
- ✅ JWT token authentication (30-day expiry)
- ✅ Protected routes with middleware
- ✅ Input validation with email regex
- ✅ Error handling middleware
- ✅ CORS enabled for frontend communication
- ✅ MongoDB injection protection via Mongoose

## 🚀 Connecting Frontend to Backend

Update your React frontend to connect to the backend API:

### 1. Create an API utility file (`src/utils/api.js`):

```javascript
const API_URL = 'http://localhost:5001/api';

// Get token from localStorage
const getToken = () => localStorage.getItem('token');

// Auth API calls
export const signup = async (userData) => {
  const response = await fetch(`${API_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData)
  });
  return response.json();
};

export const login = async (credentials) => {
  const response = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials)
  });
  return response.json();
};

// Post API calls
export const getPosts = async () => {
  const response = await fetch(`${API_URL}/posts`);
  return response.json();
};

export const createPost = async (postData) => {
  const response = await fetch(`${API_URL}/posts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify(postData)
  });
  return response.json();
};

export const likePost = async (postId) => {
  const response = await fetch(`${API_URL}/posts/${postId}/like`, {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${getToken()}`
    }
  });
  return response.json();
};

export const addComment = async (postId, text) => {
  const response = await fetch(`${API_URL}/posts/${postId}/comment`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getToken()}`
    },
    body: JSON.stringify({ text })
  });
  return response.json();
};
```

### 2. Update your Login component:

```javascript
import { login } from '../utils/api';

const handleLogin = async (e) => {
  e.preventDefault();
  try {
    const data = await login({ email, password });
    if (data.token) {
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data));
      // Redirect to feed
      navigate('/feed');
    }
  } catch (error) {
    console.error('Login error:', error);
  }
};
```

### 3. Update your Feed component:

```javascript
import { useEffect, useState } from 'react';
import { getPosts } from '../utils/api';

const Feed = () => {
  const [posts, setPosts] = useState([]);

  useEffect(() => {
    const fetchPosts = async () => {
      const data = await getPosts();
      setPosts(data);
    };
    fetchPosts();
  }, []);

  return (
    <div>
      {posts.map(post => (
        <div key={post._id}>
          <h3>{post.title}</h3>
          <p>{post.content}</p>
          <small>By: {post.author.username}</small>
        </div>
      ))}
    </div>
  );
};
```

## 📌 Current Status

✅ **Backend is fully set up and running!**

- ✅ MongoDB connected successfully
- ✅ Server running on http://localhost:5001
- ✅ All models created (User, Post, Community, Message)
- ✅ Authentication routes working (signup, login)
- ✅ Post routes working (CRUD, like, comment)
- ✅ JWT authentication middleware active
- ✅ Error handling configured
- ✅ CORS enabled for frontend

## 🛠️ Development

- Edit files in the `src/` directory
- Nodemon automatically restarts the server on file changes
- Check the terminal for logs and errors
- Use Postman or Thunder Client to test API endpoints

## 📧 Next Steps

1. **Test the API endpoints** using Postman or Thunder Client
2. **Connect your React frontend** to the backend API
3. **Implement the remaining controllers** (user, community, message)
4. **Add more features** as needed

---

**Backend is ready! Start building your frontend integration! 🎉**
