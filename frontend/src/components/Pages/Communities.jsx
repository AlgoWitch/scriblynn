
import React, { useState, useContext } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import userData from '../../data/userData.json';
import { Link } from 'react-router-dom';
import CreateCommunityButton from '../SmallerComponents/CreateCommunityButton';
import './Communities.css';

function Communities() {
  const { isLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState(isLoggedIn ? 'subscribed' : 'recommended');
  const [searchTerm, setSearchTerm] = useState('');
  const [createdCommunities, setCreatedCommunities] = useState(userData.createdCommunities || []);
  const [subscribedCommunities] = useState(userData.likedCommunities || []);
  const [showModal, setShowModal] = useState(false);
  const [editingCommunity, setEditingCommunity] = useState(null);
  const [menuOpenId, setMenuOpenId] = useState(null); 

  const recommendedCommunities = [
    { id: 101, name: 'Bookworms United', description: 'Share reviews, swap reads.' },
    { id: 102, name: 'Fitness & Wellness', description: 'Chasing health goals!' },
    { id: 103, name: 'Plant Parents', description: 'Nature lovers unite.' },
    { id: 104, name: 'Art & Doodles', description: 'Share your art.' },
  ];

  const handleSearch = () => {
    // Optional search logic
  };

  const handleCreateCommunity = (newCommunity) => {
    setCreatedCommunities((prev) => {
      const exists = prev.find((c) => c.id === newCommunity.id);
      if (exists) {
        return prev.map((c) => (c.id === newCommunity.id ? newCommunity : c));
      }
      return [newCommunity, ...prev];
    });
    setShowModal(false);
    setEditingCommunity(null);
  };

  const handleDeleteCommunity = (id) => {
    setCreatedCommunities((prev) => prev.filter((comm) => comm.id !== id));
    setMenuOpenId(null);
  };

  const filterCommunities = (communities) =>
    communities?.filter((comm) =>
      comm.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comm.description.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

  const allCommunities = {
    created: createdCommunities,
    subscribed: subscribedCommunities,
    recommended: recommendedCommunities,
  };

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

    const filtered = filterCommunities(communities);

    return (
      <div className="communities-list">
        {filtered.map((community) => (
          <div key={community.id} className="communities-card">
            <div className="communities-card-header">
              <h3>{community.name}</h3>
              {type === 'created' && (
                <div className="communities-menu-wrapper">
                  <button
                    className="communities-dots"
                    onClick={() =>
                      setMenuOpenId((prev) => (prev === community.id ? null : community.id))
                    }
                  >
                    ⋮
                  </button>
                  {menuOpenId === community.id && (
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
                      <button onClick={() => handleDeleteCommunity(community.id)}>Delete</button>
                    </div>
                  )}
                </div>
              )}
            </div>
            <p>{community.description}</p>
            <button className="communities-visit-btn">Visit</button>
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
          <button className="communities-search-btn" onClick={handleSearch}>Search</button>
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
        {renderCommunities(allCommunities[activeTab], activeTab)}
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
