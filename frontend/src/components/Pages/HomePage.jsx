import React, { useEffect, useState, useContext } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import { postAPI } from '../../utils/api';
import CreatePostButton from '../SmallerComponents/CreatePostButton';
import PostCard from '../SmallerComponents/PostCard';
import { Link } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [posts, setPosts] = useState([]);
  const { isLoggedIn } = useContext(AuthContext);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  const fetchPosts = async (pageNum) => {
    setLoading(true);
    try {
      const res = await postAPI.getAllPosts(pageNum, 6);
      const newPosts = res.data.posts || [];

      if (pageNum === 1) {
        setPosts(newPosts);
      } else {
        setPosts(prev => [...prev, ...newPosts]);
      }

      if (newPosts.length < 6 || pageNum >= res.data.totalPages) {
        setHasMore(false);
      }
    } catch (error) {
      console.error("Failed to fetch posts for home page", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPosts(1);
  }, []);

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchPosts(nextPage);
  };

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
          <Link to="/login">
            <button className="primary-btn">Login to Write a Post</button>
          </Link>
        )}
        <Link to="/Communities">
          <button className="secondary-btn" style={{ marginLeft: '10px' }}>Explore Communities</button>
        </Link>
      </div>

      <div className="main-feed">
        <h2 className="feed-heading">
          Explore Real Stories & Shared Journeys
        </h2>

        <div className="post-list">
          {posts.length === 0 && !loading ? (
            <p style={{ textAlign: 'center', color: '#666' }}>No posts found.</p>
          ) : (
            posts.map((post) => (
              <PostCard key={post._id} post={post} />
            ))
          )}
        </div>

        {loading && <p style={{ textAlign: 'center', marginTop: '1rem' }}>Loading...</p>}

        {hasMore && !loading && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <button className="primary-btn" onClick={handleLoadMore}>Load More</button>
          </div>
        )}

        {!hasMore && posts.length > 0 && (
          <div style={{ textAlign: 'center', marginTop: '2rem' }}>
            <Link to="/Feed" style={{ textDecoration: 'none' }}>
              <button className="secondary-btn">View All Posts in Feed</button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}

export default HomePage;
