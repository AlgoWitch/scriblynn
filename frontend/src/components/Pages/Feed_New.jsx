import React, { useState, useEffect } from 'react';
import { postAPI } from '../../utils/api';
import './Feed.css';

const tags = [
  'Life', 'College', 'MentalHealth', 'Productivity', 'Friendship',
  'Love', 'Stress', 'Success', 'Failure', 'DailyThoughts', 'Gratitude', 'Growth'
];

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLike = async (postId) => {
    try {
      await postAPI.likePost(postId);
      // Refresh posts to show updated likes
      fetchPosts();
    } catch (err) {
      console.error('Failed to like post:', err);
      if (err.response?.status === 401) {
        alert('Please login to like posts');
      }
    }
  };

  const filteredPosts = posts.filter(post => 
    post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.content.toLowerCase().includes(searchQuery.toLowerCase()) ||
    post.author.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <div className="feed-page">
        <div className="centered-container">
          <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>Loading posts...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="feed-page">
        <div className="centered-container">
          <div className="error" style={{ textAlign: 'center', padding: '2rem', color: 'red' }}>{error}</div>
        </div>
      </div>
    );
  }

  return (
    <div className="feed-page">
      <div className="centered-container">
        <div className="search-section">
          <input 
            type="text" 
            placeholder="Search posts or people..." 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
          />
        </div>

        <div className="tags-section">
          {tags.map(tag => (
            <button key={tag} className="tag">{tag}</button>
          ))}
        </div>

        <div className="main-feed-wrapper">
          <h3>Explore Real Stories & Shared Journeys</h3>
          
          {filteredPosts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              {searchQuery ? 'No posts found matching your search.' : 'No posts yet. Be the first to create one!'}
            </p>
          ) : (
            <div className="post-grid">
              {filteredPosts.map((post) => (
                <div className="post-card" key={post._id}>
                  <h4>{post.title}</h4>
                  <p>{post.content.substring(0, 150)}{post.content.length > 150 ? '...' : ''}</p>
                  <div style={{ marginTop: '10px' }}>
                    {post.tags && post.tags.map((tag, index) => (
                      <span key={index} style={{ 
                        backgroundColor: '#e0e7ff', 
                        padding: '2px 8px', 
                        borderRadius: '12px', 
                        fontSize: '0.8rem',
                        marginRight: '5px'
                      }}>
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div style={{ marginTop: '10px', display: 'flex', gap: '15px', alignItems: 'center' }}>
                    <span>🪷 {post.author.username}</span>
                    <button 
                      onClick={() => handleLike(post._id)}
                      style={{ 
                        background: 'none', 
                        border: 'none', 
                        cursor: 'pointer',
                        fontSize: '1rem'
                      }}
                    >
                      💖 {post.likes.length}
                    </button>
                    <span>🗨️ {post.comments.length}</span>
                  </div>
                  <div style={{ fontSize: '0.8rem', color: '#666', marginTop: '8px' }}>
                    {new Date(post.createdAt).toLocaleDateString()}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
