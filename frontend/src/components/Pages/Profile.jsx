import React, { useState, useEffect } from 'react';
import { postAPI, authAPI } from '../../utils/api';
import CreatePostButton from '../SmallerComponents/CreatePostButton';
import { FaEllipsisV } from 'react-icons/fa';
import { Link } from 'react-router-dom';
import './Profile.css';

function ProfilePage() {
  const [user, setUser] = useState(null);
  const [posts, setPosts] = useState([]);
  const [activeTab, setActiveTab] = useState('named');
  const [loading, setLoading] = useState(true);

  // menu and editing state
  const [menuOpen, setMenuOpen] = useState(null);
  const [editingPost, setEditingPost] = useState(null);
  const [editContent, setEditContent] = useState('');

  // Profile editing state
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [editProfileData, setEditProfileData] = useState({
    username: '',
    bio: '',
    profilePicture: ''
  });

  useEffect(() => {
    // Check if user is logged in
    const token = localStorage.getItem('token');
    const userData = localStorage.getItem('user');

    if (token && userData) {
      const parsedUser = JSON.parse(userData);
      setUser(parsedUser);
      fetchUserPosts(parsedUser._id);
    } else {
      setLoading(false);
    }
  }, []);

  const fetchUserPosts = async (userId) => {
    try {
      // Fetch posts by author from backend (already sorted by date)
      const response = await postAPI.getAllPosts(1, 100, '', '', userId);
      const userPosts = response.data.posts || [];
      setPosts(userPosts);
    } catch (error) {
      console.error('Failed to fetch posts:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleNewPost = () => {
    // Refresh posts after creating new one
    if (user) {
      fetchUserPosts(user._id);
    }
  };

  const toggleMenu = (postId) => {
    setMenuOpen(menuOpen === postId ? null : postId);
  };

  const handleDelete = async (postId) => {
    try {
      await postAPI.deletePost(postId);
      setPosts(posts.filter((p) => p._id !== postId));
      setMenuOpen(null);
    } catch (error) {
      console.error('Failed to delete post:', error);
      alert('Failed to delete post');
    }
  };

  const startEditing = (post) => {
    setEditingPost(post);
    setEditContent(post.content);
    setMenuOpen(null);
  };

  const saveEdit = async (postId) => {
    try {
      await postAPI.updatePost(postId, { content: editContent });
      setPosts(
        posts.map((p) =>
          p._id === postId ? { ...p, content: editContent } : p
        )
      );
      setEditingPost(null);
    } catch (error) {
      console.error('Failed to update post:', error);
      alert('Failed to update post');
    }
  };

  const handleEditProfileClick = () => {
    setEditProfileData({
      username: user.username,
      bio: user.bio || '',
      profilePicture: user.profilePicture || ''
    });
    setShowEditProfile(true);
  };

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    try {
      const res = await authAPI.updateProfile(editProfileData);
      setUser(res.data);
      localStorage.setItem('user', JSON.stringify(res.data));
      setShowEditProfile(false);
    } catch (error) {
      console.error('Failed to update profile:', error);
      const errorMessage = error.response?.data?.message || 'Failed to update profile';
      alert(errorMessage);
    }
  };

  if (loading) {
    return (
      <div className="profile-page">
        <div className="loading" style={{ textAlign: 'center', padding: '2rem' }}>
          Loading profile...
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="profile-page">
        <div className="login-prompt-card">
          <h2>✨ Join the Scriblyn Community</h2>
          <p>Sign up or log in to view your profile, post history, and connect with others.</p>
          <Link to="/login">
            <button className="primary-btn">Login / Signup</button>
          </Link>
        </div>
      </div>
    );
  }

  // Separate posts by anonymous status
  const namedPosts = posts.filter((post) => !post.anonymous);
  const anonymousPosts = posts.filter((post) => post.anonymous);
  const displayPosts = activeTab === 'named' ? namedPosts : anonymousPosts;

  // Get initials for default profile picture
  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const defaultProfilePic = `https://ui-avatars.com/api/?name=${user.username}&background=6366f1&color=fff&size=150`;

  return (
    <div className="profile-page">
      <div className="profile-header">
        <img
          src={user.profilePicture || defaultProfilePic}
          alt="profile"
          onError={(e) => { e.target.src = defaultProfilePic; }}
        />
        <h2>{user.username}</h2>
        <p>{user.bio || 'A passionate writer and thinker.'}</p>
        <button className="primary-btn" onClick={handleEditProfileClick} style={{ marginTop: '1rem' }}>
          Edit Profile
        </button>
        <div className="profile-stats">
          <span><strong>{posts.length}</strong> posts</span>
          <span><strong>{user.followers?.length || 0}</strong> followers</span>
          <span><strong>{user.following?.length || 0}</strong> following</span>
        </div>
      </div>

      {showEditProfile && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Edit Profile</h3>
            <form onSubmit={handleProfileUpdate}>
              <div className="form-group">
                <label>Username</label>
                <input
                  type="text"
                  value={editProfileData.username}
                  onChange={(e) => setEditProfileData({ ...editProfileData, username: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Bio</label>
                <textarea
                  value={editProfileData.bio}
                  onChange={(e) => setEditProfileData({ ...editProfileData, bio: e.target.value })}
                />
              </div>
              <div className="form-group">
                <label>Profile Picture URL</label>
                <input
                  type="text"
                  value={editProfileData.profilePicture}
                  onChange={(e) => setEditProfileData({ ...editProfileData, profilePicture: e.target.value })}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setShowEditProfile(false)}>Cancel</button>
                <button type="submit" className="primary-btn">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Create Post Button */}
      <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '1rem' }}>
        <CreatePostButton onPost={handleNewPost} />
      </div>

      {/* Tabs for Named vs Anonymous Posts */}
      <div className="profile-tabs">
        <button
          className={activeTab === 'named' ? 'active' : ''}
          onClick={() => setActiveTab('named')}
        >
          Named Posts ({namedPosts.length})
        </button>
        <button
          className={activeTab === 'anonymous' ? 'active' : ''}
          onClick={() => setActiveTab('anonymous')}
        >
          Anonymous Posts ({anonymousPosts.length})
        </button>
      </div>

      {/* Posts */}
      <div className="profile-posts">
        {/* Removed headings as requested */}

        {displayPosts.length === 0 ? (
          <p style={{ textAlign: 'center', padding: '2rem' }}>
            No {activeTab} posts yet. Create your first post!
          </p>
        ) : (
          displayPosts.map((post) => (
            <div key={post._id} className="profile-post-card">
              <div className="post-header">
                <h4>{post.title}</h4>
                <div className="post-options">
                  <FaEllipsisV onClick={() => toggleMenu(post._id)} />
                  {menuOpen === post._id && (
                    <div className="post-dropdown">
                      <button onClick={() => startEditing(post)}>Edit</button>
                      <button onClick={() => handleDelete(post._id)}>Delete</button>
                    </div>
                  )}
                </div>
              </div>

              {editingPost?._id === post._id ? (
                <>
                  <textarea
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    rows="4"
                    style={{ width: '100%', marginTop: '0.5rem' }}
                  />
                  <button
                    className="primary-btn"
                    style={{ marginTop: '0.5rem' }}
                    onClick={() => saveEdit(post._id)}
                  >
                    Save
                  </button>
                </>
              ) : (
                <p>{post.content}</p>
              )}

              <div className="post-meta">
                <span>{new Date(post.createdAt).toLocaleDateString()}</span>
                <span>❤️ {post.likes?.length || 0}</span>
              </div>
              {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                  {post.tags.map((tag, i) => (
                    <span key={i} className="tag">#{tag}</span>
                  ))}
                </div>
              )}
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default ProfilePage;
