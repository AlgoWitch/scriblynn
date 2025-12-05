import React, { useState, useEffect } from 'react';
import { postAPI } from '../../utils/api';
import './Feed.css';

// availableTags will be derived from posts after fetching

const Feed = () => {
  const [posts, setPosts] = useState([]);
  const [availableTags, setAvailableTags] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTag, setSelectedTag] = useState('');

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await postAPI.getAllPosts();
      setPosts(response.data);
      // derive tags from posts (normalize and remove empties)
      const tagSet = new Set();
      (response.data || []).forEach(p => (p.tags || []).forEach(t => {
        if (t == null) return;
        const tt = String(t).trim();
        if (tt) tagSet.add(tt);
      }));
      setAvailableTags([...tagSet].sort((a, b) => a.localeCompare(b)));
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

  // Apply tag filter (if any) and search query
  const filteredPosts = posts
    .filter(post => {
      if (!post) return false;
      if (selectedTag) {
        return (post.tags || []).some(t => String(t || '').trim().toLowerCase() === String(selectedTag || '').trim().toLowerCase());
      }
      return true;
    })
    .filter(post => {
      const q = String(searchQuery || '').toLowerCase();
      if (!q) return true;
      const title = String(post.title || '').toLowerCase();
      const content = String(post.content || '').toLowerCase();
      const author = String(post.author?.username || '').toLowerCase();
      return title.includes(q) || content.includes(q) || author.includes(q);
    });

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
          {availableTags.length === 0 ? (
            <div style={{ color: '#777' }}>No tags yet</div>
          ) : (
            availableTags.map(tag => (
              <button
                key={tag}
                className={`tag ${selectedTag && String(selectedTag).toLowerCase() === String(tag).toLowerCase() ? 'active' : ''}`}
                onClick={() => setSelectedTag(prev => (prev && String(prev).toLowerCase() === String(tag).toLowerCase()) ? '' : tag)}
              >
                {tag}
              </button>
            ))
          )}
          {selectedTag && (
            <button className="tag clear-tag" onClick={() => setSelectedTag('')}>Clear</button>
          )}
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
                        <span
                          key={index}
                          onClick={() => setSelectedTag(tag)}
                          style={{
                            backgroundColor: '#e0e7ff',
                            padding: '2px 8px',
                            borderRadius: '12px',
                            fontSize: '0.8rem',
                            marginRight: '5px',
                            cursor: 'pointer'
                          }}
                        >
                          #{String(tag).trim()}
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
