import React, { useState, useEffect } from 'react';
import { postAPI } from '../../utils/api';
import PostCard from '../SmallerComponents/PostCard';
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
  const [selectedTag, setSelectedTag] = useState(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  useEffect(() => {
    // Reset to page 1 when filters change
    setPage(1);
    fetchPosts(1, true);
  }, [searchQuery, selectedTag]);

  const fetchPosts = async (pageNum, reset = false) => {
    try {
      const response = await postAPI.getAllPosts(pageNum, 6, searchQuery, selectedTag || ''); // Fetch 6 posts per page
      const newPosts = response.data.posts || [];

      if (reset || pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      if (newPosts.length < 6 || pageNum >= response.data.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      setError('Failed to load posts');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

  const handleTagClick = (tag) => {
    setSelectedTag(prevTag => prevTag === tag ? null : tag);
  };

  // Removed client-side filtering
  const filteredPosts = posts;

  if (loading && page === 1) {
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
            <button
              key={tag}
              className={`tag ${selectedTag === tag ? 'active' : ''}`}
              onClick={() => handleTagClick(tag)}
            >
              {tag}
            </button>
          ))}
          {selectedTag && (
            <button className="tag clear-tag" onClick={() => setSelectedTag(null)}>
              Clear Filter ✕
            </button>
          )}
        </div>

        <div className="main-feed-wrapper">
          <h3>
            {selectedTag ? `Posts tagged with #${selectedTag}` : 'Explore Real Stories & Shared Journeys'}
          </h3>

          {filteredPosts.length === 0 ? (
            <p style={{ textAlign: 'center', padding: '2rem' }}>
              {searchQuery || selectedTag
                ? 'No posts found matching your filters.'
                : 'No posts yet. Be the first to create one!'}
            </p>
          ) : (
            <>
              <div className="post-grid">
                {filteredPosts.map((post) => (
                  <PostCard
                    key={post._id}
                    post={post}
                    onTagClick={handleTagClick}
                  />
                ))}
              </div>

              {hasMore && !searchQuery && !selectedTag && (
                <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
                  <button className="primary-btn" onClick={handleLoadMore}>Load More</button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default Feed;
