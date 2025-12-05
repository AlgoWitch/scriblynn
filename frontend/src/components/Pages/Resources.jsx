
import React, { useState, useContext, useEffect } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import userData from '../../data/userData.json';
import ShareResourceButton from '../SmallerComponents/ShareResourceButton';
import { Link } from 'react-router-dom';
import './Resources.css';
import EditResourceModal from '../SmallerComponents/EditResourceModal';
import { resourceAPI } from '../../utils/api';

function Resources() {
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [editingResource, setEditingResource] = useState(null);

  // Resources pulled from backend
  const [resources, setResources] = useState([]);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loading, setLoading] = useState(false);

  // Fallback local user data for uploads/saved when backend/user not available
  const [fallbackUploads] = useState(userData.uploadedResources || []);
  const [fallbackSaved] = useState(userData.savedResources || []);

  // Fetch resources from backend
  useEffect(() => {
    setPage(1);
    fetchResources(1, true);
  }, [activeTab, searchTerm, isLoggedIn, currentUser]); // Added isLoggedIn and currentUser to dependencies for re-fetching when auth state changes

  const fetchResources = async (pageNum = 1, reset = false) => {
    try {
      setLoading(true);

      let author = '';
      let savedBy = '';

      if (isLoggedIn && currentUser) {
        if (activeTab === 'uploads') {
          author = currentUser._id || currentUser.id;
        } else if (activeTab === 'saved') {
          savedBy = currentUser._id || currentUser.id;
        }
      }

      // If tab is restricted but user not logged in, don't fetch (or fetch empty)
      if (!isLoggedIn && (activeTab === 'saved' || activeTab === 'uploads')) {
        setResources([]);
        setHasMore(false);
        setLoading(false);
        return;
      }

      const res = await resourceAPI.getAllResources(pageNum, 8, searchTerm, author, savedBy);
      const newResources = res.data.resources || [];

      if (reset || pageNum === 1) {
        setResources(newResources);
      } else {
        setResources(prev => [...prev, ...newResources]);
      }

      if (newResources.length < 8 || pageNum >= res.data.totalPages) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    } catch (err) {
      console.error('Failed to fetch resources:', err);
      if (pageNum === 1) setResources([]);
    } finally {
      setLoading(false);
    }
  };

  const handleLoadMore = () => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchResources(nextPage);
  };

  const handleNewResource = (newResource) => {
    // newResource comes from backend (populated). Prepend to list if it matches current filter
    // For simplicity, we can just prepend it if we are in 'all' or 'uploads' tab
    if (activeTab === 'all' || activeTab === 'uploads') {
      setResources((prev) => [newResource, ...prev]);
    }
  };

  // Removed client-side filtering logic
  const filteredResources = resources;

  return (
    <div className="resources-page">
      <div className="resources-header">
        <h1>Explore Shared Resources</h1>
        <p>Notes, books, roadmaps and more — curated by our community.</p>
        {isLoggedIn && (
          <div className="resources-share-btn-container">
            <ShareResourceButton onShare={handleNewResource} />
          </div>
        )}
      </div>

      <div className="resources-search-bar-container">
        <input
          type="text"
          placeholder="🔍 Search resources by title, type, or description..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="resources-tab-buttons">
        <button className={activeTab === 'all' ? 'active' : ''} onClick={() => setActiveTab('all')}>All</button>
        <button className={activeTab === 'saved' ? 'active' : ''} onClick={() => setActiveTab('saved')}>Saved</button>
        <button className={activeTab === 'uploads' ? 'active' : ''} onClick={() => setActiveTab('uploads')}>My Uploads</button>
      </div>

      {!isLoggedIn && (activeTab === 'saved' || activeTab === 'uploads') ? (
        <div className="resources-login-message-container">
          <div className="resources-login-message-box">
            <h3>🔒 Restricted Access</h3>
            <p>Login or Signup to view your saved and uploaded resources.</p>
            <Link to="/login">
              <button className="resources-soft-auth-btn">Login / Signup</button>
            </Link>
          </div>
        </div>
      ) : (
        <div className="resources-resource-list">
          {filteredResources?.map((res) => (
            <div key={res._id || res.id} className="resources-resource-card">
              <h3>{res.title}</h3>
              <p>{res.description}</p>
              <p><strong>Type:</strong> {res.type}</p>
              <a href={res.link} target="_blank" rel="noopener noreferrer">🔗 Visit</a>
              {isLoggedIn && (
                <div style={{ marginTop: '8px' }}>
                  <button onClick={async () => {
                    try {
                      await resourceAPI.saveResource(res._id || res.id);
                      // Update local state to reflect save/unsave
                      setResources(prev => prev.map(r => {
                        if ((r._id || r.id).toString() === (res._id || res.id).toString()) {
                          // toggle savedBy locally (best-effort)
                          const savedBy = r.savedBy || [];
                          const userId = currentUser?._id;
                          if (!userId) return r;
                          const has = savedBy.some(id => id.toString() === userId);
                          const newSaved = has ? savedBy.filter(id => id.toString() !== userId) : [...savedBy, userId];
                          return { ...r, savedBy: newSaved };
                        }
                        return r;
                      }));
                    } catch (err) {
                      console.error('Failed to save resource:', err);
                      alert(err.response?.data?.message || 'Failed to save resource');
                    }
                  }}>{(res.savedBy || []).some(id => id.toString() === (currentUser?._id)) ? 'Unsave' : 'Save'}</button>

                  {/* Edit button visible only to resource author */}
                  {((res.author && (res.author._id || res.author).toString()) === (currentUser?._id)) && (
                    <button style={{ marginLeft: 8 }} onClick={() => setEditingResource(res)}>Edit</button>
                  )}

                  {/* Delete button visible only to resource author */}
                  {((res.author && (res.author._id || res.author).toString()) === (currentUser?._id)) && (
                    <button style={{ marginLeft: 8 }} onClick={async () => {
                      const ok = window.confirm('Delete this resource? This action cannot be undone.');
                      if (!ok) return;
                      try {
                        await resourceAPI.deleteResource(res._id || res.id);
                        setResources(prev => prev.filter(r => (r._id || r.id).toString() !== (res._id || res.id).toString()));
                      } catch (err) {
                        console.error('Failed to delete resource:', err);
                        alert(err.response?.data?.message || 'Failed to delete resource');
                      }
                    }}>Delete</button>
                  )}
                </div>
              )}
            </div>
          ))}
          {hasMore && !searchTerm && (
            <div style={{ textAlign: 'center', marginTop: '2rem', paddingBottom: '2rem', width: '100%', gridColumn: '1 / -1' }}>
              <button className="primary-btn" onClick={handleLoadMore} disabled={loading}>
                {loading ? 'Loading...' : 'Load More'}
              </button>
            </div>
          )}
        </div>
      )}

      {editingResource && (
        <EditResourceModal
          resource={editingResource}
          onClose={() => setEditingResource(null)}
          onUpdate={(updatedResource) => {
            setResources((prev) =>
              prev.map((r) => ((r._id || r.id).toString() === (updatedResource._id || updatedResource.id).toString() ? updatedResource : r))
            );
          }}
        />
      )}
    </div>
  );
}

export default Resources;