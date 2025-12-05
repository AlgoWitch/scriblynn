import React, { useEffect, useState, useContext } from 'react';
import { useParams, Link } from 'react-router-dom';
import { communityAPI, postAPI } from '../../utils/api';
import { AuthContext } from '../SmallerComponents/AuthContext';
import PostCard from '../SmallerComponents/PostCard';
import './Communities.css';

const CommunityDetail = () => {
  const { id } = useParams();
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [community, setCommunity] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  // New post form state
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [tags, setTags] = useState('');
  const [activeTab, setActiveTab] = useState('posts');
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [showMyPostsOnly, setShowMyPostsOnly] = useState(false);

  useEffect(() => {
    fetchCommunity();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const fetchCommunity = async () => {
    try {
      setLoading(true);
      const res = await communityAPI.getCommunityById(id);
      setCommunity(res.data);
    } catch (err) {
      console.error(err);
      setError('Failed to load community');
    } finally {
      setLoading(false);
    }
  };

  const isMember = () => {
    if (!community || !currentUser) return false;
    const members = community.members || [];
    const uid = currentUser._id || currentUser.id || currentUser;
    return members.some(m => String(m._id || m).toString() === String(uid));
  };

  const handleJoin = async () => {
    try {
      const res = await communityAPI.joinCommunity(id);
      setCommunity(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to join');
    }
  };

  const handleLeave = async () => {
    try {
      const res = await communityAPI.leaveCommunity(id);
      setCommunity(res.data);
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to leave');
    }
  };

  const handleCreatePost = async (e) => {
    e.preventDefault();
    try {
      const tagArray = tags.split(',').map(t => t.trim()).filter(Boolean);
      const res = await communityAPI.addPostToCommunity(id, { title, content, tags: tagArray });
      // prepend new post to local community posts
      setCommunity(prev => ({ ...prev, posts: [res.data, ...(prev.posts || [])] }));
      setTitle(''); setContent(''); setTags('');
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || 'Failed to create post');
    }
  };

  const handlePostDelete = (postId) => {
    setCommunity(prev => ({
      ...prev,
      posts: prev.posts.filter(p => (p._id || p.id) !== postId)
    }));
  };

  if (loading) return <div style={{ padding: '2rem' }}>Loading community...</div>;
  if (error) return <div style={{ padding: '2rem', color: 'red' }}>{error}</div>;
  if (!community) return <div style={{ padding: '2rem' }}>Community not found</div>;



  // ... (existing useEffect and fetch functions remain same, but I will include them in the full file content if I were rewriting the whole file, but here I am replacing the render part mostly)

  // I need to replace the return statement and add the state variables.
  // Since I can't easily inject state variables without replacing the whole component body or a large chunk, I will replace the main render logic.

  return (
    <div className="communities-page">
      <div className="communities-header">
        <h1>{community.name}</h1>
        <p>{community.description}</p>
        <div style={{ marginTop: '8px' }}>
          <strong>Members:</strong> {community.members?.length || 0}
        </div>
        <div style={{ marginTop: '16px' }}>
          {isLoggedIn ? (
            isMember() ? (
              <button className="communities-create-btn" onClick={handleLeave}>Leave Community</button>
            ) : (
              <button className="communities-create-btn" onClick={handleJoin}>Join Community</button>
            )
          ) : (
            <div style={{ color: '#666' }}>Login to join this community</div>
          )}
        </div>
      </div>

      <div className="communities-tab-buttons">
        <button
          className={activeTab === 'posts' ? 'active' : ''}
          onClick={() => setActiveTab('posts')}
        >
          Posts
        </button>
        <button
          className={activeTab === 'members' ? 'active' : ''}
          onClick={() => setActiveTab('members')}
        >
          Members
        </button>
      </div>

      <div className="community-detail-container" style={{ display: 'block' }}>
        {activeTab === 'posts' && (
          <div className="community-posts-section">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem', flexWrap: 'wrap', gap: '1rem' }}>
              <h3>Community Posts</h3>
              <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                {isLoggedIn && (
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: '#6b4c9a' }}>
                    <input
                      type="checkbox"
                      checked={showMyPostsOnly}
                      onChange={(e) => setShowMyPostsOnly(e.target.checked)}
                    />
                    Show My Posts Only
                  </label>
                )}
                {isLoggedIn && isMember() && (
                  <button
                    className="communities-create-btn"
                    onClick={() => setShowCreatePost(!showCreatePost)}
                  >
                    {showCreatePost ? 'Cancel Post' : 'Create Post'}
                  </button>
                )}
              </div>
            </div>

            {showCreatePost && isLoggedIn && isMember() && (
              <div className="community-create-post-card">
                <h4>Create a post in {community.name}</h4>
                <form onSubmit={handleCreatePost} className="community-create-post-form">
                  <input
                    required
                    placeholder="Post Title"
                    value={title}
                    onChange={e => setTitle(e.target.value)}
                  />
                  <textarea
                    required
                    placeholder="Share something with the community..."
                    value={content}
                    onChange={e => setContent(e.target.value)}
                  />
                  <input
                    placeholder="Tags (comma separated)"
                    value={tags}
                    onChange={e => setTags(e.target.value)}
                  />
                  <div style={{ marginTop: '8px', textAlign: 'right' }}>
                    <button type="submit" className="communities-create-btn">Publish Post</button>
                  </div>
                </form>
              </div>
            )}

            {(!community.posts || community.posts.length === 0) ? (
              <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: '2rem' }}>
                No posts yet. Be the first to share something!
              </p>
            ) : (
              (community.posts || [])
                .filter(p => !showMyPostsOnly || (currentUser && (p.author?._id === currentUser._id || p.author === currentUser._id)))
                .map(p => (
                  <PostCard key={p._id || p.id} post={p} onDelete={handlePostDelete} />
                ))
            )}
            {showMyPostsOnly && (community.posts || []).filter(p => currentUser && (p.author?._id === currentUser._id || p.author === currentUser._id)).length === 0 && community.posts.length > 0 && (
              <p style={{ textAlign: 'center', color: '#888', fontStyle: 'italic', marginTop: '2rem' }}>
                You haven't posted in this community yet.
              </p>
            )}
          </div>
        )}

        {activeTab === 'members' && (
          <div className="community-members-section" style={{ width: '100%' }}>
            <h4>Members ({community.members?.length || 0})</h4>
            <ul className="community-members-list">
              {(community.members || []).map(m => (
                <li key={m._id || m} style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <div
                    style={{
                      width: '32px', height: '32px', borderRadius: '50%',
                      backgroundColor: '#b191f9', color: 'white',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      fontWeight: 'bold', fontSize: '0.9rem'
                    }}
                  >
                    {(m.username || m).charAt(0).toUpperCase()}
                  </div>
                  <Link to={`/profile/${m._id || m}`} style={{ textDecoration: 'none', color: '#4b106e', fontWeight: '600' }}>
                    {m.username || m}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};

export default CommunityDetail;
