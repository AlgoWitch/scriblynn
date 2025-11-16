
import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import userData from '../../data/userData.json';
import CreatePostButton from '../SmallerComponents/CreatePostButton';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);

  const randomGuestPosts = [
    {
      id: 1,
      title: "Welcome to Scriblyn!",
      content: "Discover voices from all corners of campus.",
      likes: 12,
      createdAt: "2025-04-28T10:00:00Z",
      tags: ["introduction", "community"],
      author: "John Doe"
    },
    {
      id: 2,
      title: "Why Journaling Helps Mental Clarity",
      content: "A few minutes of reflection can change your day.",
      likes: 20,
      createdAt: "2025-04-29T14:45:00Z",
      tags: ["mental health", "writing"],
      author: "Jane Smith"
    },
    {
      id: 3,
      title: "Top 5 Study Playlists",
      content: "Lofi, classical, or ambient? Here's what helps most.",
      likes: 18,
      createdAt: "2025-04-25T11:00:00Z",
      tags: ["study", "music"],
      author: "Maria Green"
    }
  ];

  useEffect(() => {
    if (isLoggedIn) {
      setPosts(userData.posts || []);
    } else {
      setPosts(randomGuestPosts);
    }
  }, [isLoggedIn]);

  const handleNewPost = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
  };

  return (
    <div>
      <div className="hero-section">
        <h1>Your Space to Share, Listen, and Connect.</h1>
        <p>Post your thoughts, share your journey, connect with others...</p>

        {isLoggedIn && <CreatePostButton onPost={handleNewPost} />}
        {!isLoggedIn && (
          <button disabled style={{ opacity: 0.5, cursor: 'not-allowed' }}>
            Login to Write a Post
          </button>
        )}
        <Link to="/Communities">
        <button>Explore Communities</button>
        </Link>
      </div>

      <div className="main-feed">
        <h2 className="feed-heading">
          {isLoggedIn ? 'Posts From People You Follow' : 'Explore Real Stories & Shared Journeys'}
        </h2>

        <div className="post-list">
          {posts.map((post) => (
            <div key={post.id} className="home-post-card">
              <h3>{post.title}</h3>
              <p>{post.content}</p>
              <div className="home-post-meta">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>❤️ {post.likes}</span>
              </div>
              <div className="home-author">
                <span>{post.author}</span>
              </div>
              <div className="home-tags">
                {post.tags?.map((tag, idx) => (
                  <span key={idx} className="tag">#{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default HomePage;
