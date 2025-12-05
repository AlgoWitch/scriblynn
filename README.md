# 📚 Scriblyn – A Community-First Social Learning Platform

Scriblyn is a modern **social learning platform** designed to help students, creators, and professionals collaborate, share knowledge, and discover resources — all in one place.  
It centralizes learning communities, resource-sharing, discussions, and anonymous expression through a clean and powerful MERN stack architecture.

---

# 🚨 1. Problem Statement

Learning is scattered across platforms today:

- Notes and resources exist on multiple apps  
- Discussions take place in unorganized groups  
- Collaborations happen informally  
- Anonymous posting is rarely supported  

### **Scriblyn solves all these challenges by offering a unified hub where users can:**
- ✍️ Share posts and resources  
- 🧑‍🤝‍🧑 Join or create learning communities  
- 🕶️ Post anonymously with moderation safety  
- 🔍 Search and filter any type of content  

---

# 🏗️ 2. System Architecture

### 🔄 Architecture Flow
Frontend (React.js)
↓
Backend (Node.js + Express)
↓
Database (MongoDB Atlas)


### 🧩 Components

#### **Frontend**
- React.js  
- React Router  
- TailwindCSS  
- Axios  

#### **Backend**
- Node.js  
- Express.js REST API  
- JWT Authentication  

#### **Database**
- MongoDB Atlas  
- Mongoose ORM  

### ☁️ Hosting Overview
| Layer | Platform |
|-------|----------|
| Frontend | Vercel / Netlify |
| Backend | Render / Railway |
| Database | MongoDB Atlas |

---

# ⭐ 3. Key Features

| Category | Features |
|----------|----------|
| **Authentication** | JWT signup, login, logout |
| **Routing** | Pages: Home, Feed, Profile, Communities, Resources, Messages |
| **CRUD** | Create, Read, Update, Delete posts, communities & resources |
| **Anonymous Posting** | Full support with user identity protection |
| **Search + Filters** | Search posts, communities, and resources |
| **Sorting** | Sort by date or popularity |
| **Pagination** | Smooth infinite scroll/paginated feeds |
| **Profile Page** | User details, user posts, uploads management |
| **Dynamic Data** | Live updates in UI |
| **Deployment Ready** | Clean MERN architecture |

---

# 🛠️ 4. Tech Stack

| Layer | Technologies |
|-------|--------------|
| **Frontend** | React.js, React Router, TailwindCSS, Axios |
| **Backend** | Node.js, Express.js |
| **Database** | MongoDB (Mongoose) |
| **Authentication** | JSON Web Token (JWT) |
| **Hosting** | Vercel, Render, MongoDB Atlas |

---

# 🔌 5. API Overview

Below is the complete API structure for Scriblyn's backend.

---

## 🔐 Authentication APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/auth/signup` | POST | Register a new user | Public |
| `/api/auth/login` | POST | Login & receive JWT token | Public |

---

## 📝 Post APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/posts` | GET | Get all posts (search, sort, filter, pagination) | Public |
| `/api/posts/:id` | GET | Get a single post | Public |
| `/api/posts` | POST | Create a post (supports anonymous) | Authenticated |
| `/api/posts/:id` | PUT | Edit a post | Authenticated |
| `/api/posts/:id` | DELETE | Delete a post | Authenticated |

---

## 🏘️ Community APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/communities` | GET | Get all communities | Public |
| `/api/communities` | POST | Create new community | Authenticated |

---

## 📂 Resource APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/resources` | GET | Get shared resources (with search/filter) | Public |
| `/api/resources` | POST | Share a new resource | Authenticated |

---

## 👤 User APIs

| Endpoint | Method | Description | Access |
|----------|--------|-------------|--------|
| `/api/users/:id` | GET | Get user profile and posts | Authenticated |

---

# 📦 6. Project Folder Structure

