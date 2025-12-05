
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import { Link } from 'react-router-dom';
import { communityAPI } from '../../utils/api';
import CreateCommunityButton from '../SmallerComponents/CreateCommunityButton';
import './Communities.css';

function Communities() {
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(isLoggedIn ? 'subscribed' : 'recommended');
  const [searchTerm, setSearchTerm] = useState('');

  const [allCommunitiesList, setAllCommunitiesList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null);

  // Fetch communities from backend
  useEffect(() => {
    setPage(1);
    fetchCommunities(1, true);
  }, [activeTab, searchTerm, isLoggedIn, currentUser]);

  const fetchCommunities = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);

      let userId = '';
      if (isLoggedIn && currentUser) {
        userId = currentUser._id || currentUser.id;
      }

      // If tab is restricted but user not logged in, don't fetch (or fetch empty)
      if (!isLoggedIn && (activeTab === 'created' || activeTab === 'subscribed')) {
        setAllCommunitiesList([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      const res = await communityAPI.getAllCommunities(pageNum, 8, searchTerm, activeTab, userId);
      const newCommunities = res.data.communities || [];

      if (reset || pageNum === 1) {
        setAllCommunitiesList(newCommunities);
      } else {
        setAllCommunitiesList(prev => [...prev, ...newCommunities]);
      }

      if (newCommunities.length < 8 || pageNum >= res.data.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error('Could not load communities from backend', err);
      if (pageNum === 1) setAllCommunitiesList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchCommunities(nextPage);
  };

  const handleCreateCommunity = async (newCommunity) => {
    try {
      if (editingCommunity) {
        // Update existing
        const res = await communityAPI.updateCommunity(editingCommunity._id, {
          name: newCommunity.name,
          description: newCommunity.description
        });
        setAllCommunitiesList(prev => prev.map(c => c._id === res.data._id ? res.data : c));
      } else {
        // Create new
        const res = await communityAPI.createCommunity({
          name: newCommunity.name,
          description: newCommunity.description
        });
        // If we are in 'created' or 'recommended' (and it's ours), prepend?
        // Actually, if we create one, we are admin, so it should appear in 'created'.
        if (activeTab === 'created') {
          setAllCommunitiesList(prev => [res.data, ...prev]);
        } else {
          // Switch to created tab to see it? Or just let it be.
          // For now, let's switch tab to created
          setActiveTab('created');
        }
      }
      setShowModal(false);
      setEditingCommunity(null);
    } catch (err) {
      console.error('Failed to save community', err);
      alert('Failed to save community');
    }
  };

  const handleDeleteCommunity = async (id) => {
    if (!window.confirm('Are you sure you want to delete this community?')) return;
    try {
      await communityAPI.deleteCommunity(id);
      setAllCommunitiesList(prev => prev.filter(c => c._id !== id));
      setMenuOpenId(null);
    } catch (err) {
      console.error('Failed to delete community', err);
      alert('Failed to delete community');
    }
  };

  // Removed client-side categorization and filtering
  const filtered = allCommunitiesList;

  const renderLoginPrompt = (type) => {
    const message =
      type === 'created'
        ? 'Login or signup to see your created communities.'
        : 'Login or signup to see your subscribed communities.';
    return (
      <div className="communities-login-message-container">
        <div className="communities-login-message-box">
          <h3>🔒 Hold up!</h3>
          <p>{message}</p>
          <Link to="/login">
            <button className="communities-soft-auth-btn">Login / Signup</button>
          </Link>
        </div>
      </div>
    );
  };

  const renderCommunities = (communities, type) => {
    if (!isLoggedIn && (type === 'created' || type === 'subscribed')) {
      return renderLoginPrompt(type);
    }

    if (loading) return <div style={{ textAlign: 'center', padding: '2rem' }}>Loading...</div>;

    if (filtered.length === 0) {
      return <div style={{ textAlign: 'center', padding: '2rem' }}>No communities found in this section.</div>;
    }

    return (
      <div className="communities-list">
        {filtered.map((community) => (
          <div key={community._id} className="communities-card">
            <div className="communities-card-header">
              <h3>{community.name}</h3>
              {type === 'created' && (
                <div className="communities-menu-wrapper">
                  <button
                    className="communities-dots"
                    onClick={() =>
                      setMenuOpenId((prev) => (prev === community._id ? null : community._id))
                    }
                  >
                    ⋮
                  </button>
                  {menuOpenId === community._id && (
                    <div className="communities-dropdown">
                      <button
                        onClick={() => {
                          setEditingCommunity(community);
                          setShowModal(true);
                          setMenuOpenId(null);
                        }}
                      >
                        Edit
                      </button>
                      <button onClick={() => handleDeleteCommunity(community._id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p>{community.description}</p>
            <Link to={`/communities/${community._id}`}>
              <button className="communities-visit-btn">Visit</button>
            </Link>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="communities-page">
      <div className="communities-header">
        <h1>Find Your Circle</h1>
        <p>Browse, join, or create communities that vibe with you.</p>
        <div className="communities-controls">
          <input
            type="text"
            placeholder="Search communities..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          {isLoggedIn && (
            <button
              className="communities-create-btn"
              onClick={() => {
                setEditingCommunity(null);
                setShowModal(true);
              }}
            >
              + Create Community
            </button>
          )}
        </div>
      </div>

      <div className="communities-tab-buttons">
        <button
          onClick={() => setActiveTab('subscribed')}
          className={activeTab === 'subscribed' ? 'active' : ''}
        >
          Subscribed
        </button>
        <button
          onClick={() => setActiveTab('created')}
          className={activeTab === 'created' ? 'active' : ''}
        >
          Created
        </button>
        <button
          onClick={() => setActiveTab('recommended')}
          className={activeTab === 'recommended' ? 'active' : ''}
        >
          Recommended
        </button>
      </div>

      <div className="communities-tab-content">
        {renderCommunities(null, activeTab)}
        {hasMore && !searchTerm && (
          <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem' }}>
            <button className="primary-btn" onClick={handleLoadMore} disabled={loading}>
              {loading ? 'Loading...' : 'Load More'}
            </button>
          </div>
        )}
      </div>

      {showModal && (
        <CreateCommunityButton
          onCreate={handleCreateCommunity}
          initialData={editingCommunity}
          onClose={() => {
            setShowModal(false);
            setEditingCommunity(null);
          }}
        />
      )}
    </div>
  );
}

export default Communities;
