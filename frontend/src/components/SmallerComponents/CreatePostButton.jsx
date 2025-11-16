import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { postAPI } from '../../utils/api';
import './CreatePostButton.css';

const CreatePostButton = ({ onPost }) => {
  const [showModal, setShowModal] = useState(false);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handlePost = async () => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    if (!token) {
      alert('Please login to create a post');
      navigate('/login');
      return;
    }

    if (!title || !content) {
      setError('Title and content are required');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const postData = {
        title,
        content,
        tags: tags.split(',').map(tag => tag.trim()).filter(tag => tag),
        anonymous: isAnonymous
      };

      await postAPI.createPost(postData);
      
      // Close modal and reset form
      setShowModal(false);
      setTitle('');
      setContent('');
      setTags('');
      setIsAnonymous(false);
      
      // Refresh the page to show new post or call onPost if provided
      if (onPost) {
        onPost();
      } else {
        window.location.reload();
      }
    } catch (err) {
      console.error('Failed to create post:', err);
      setError(err.response?.data?.message || 'Failed to create post. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <button onClick={() => setShowModal(true)} className="create-post-btn">
        Create Post
      </button>

      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h2>Create a Post</h2>
            
            {error && <p style={{ color: 'red', marginBottom: '10px' }}>{error}</p>}
            
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />
            <textarea
              placeholder="What's on your mind?"
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows="6"
              required
            />

            <input
              type="text"
              placeholder="Tags (comma-separated, e.g., javascript, nodejs)"
              value={tags}
              onChange={(e) => setTags(e.target.value)}
            />

            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', margin: '10px 0' }}>
              <input
                type="checkbox"
                id="anonymous"
                checked={isAnonymous}
                onChange={(e) => setIsAnonymous(e.target.checked)}
              />
              <label htmlFor="anonymous">Post anonymously</label>
            </div>

            <button onClick={handlePost} disabled={loading}>
              {loading ? 'Posting...' : 'Post'}
            </button>
            <button onClick={() => setShowModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </>
  );
};

export default CreatePostButton;
