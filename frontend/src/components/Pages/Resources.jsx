
import React, { useState, useContext } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import userData from '../../data/userData.json';
import ShareResourceButton from '../SmallerComponents/ShareResourceButton';
import { Link } from 'react-router-dom';
import './Resources.css';

function Resources() {
  const { isLoggedIn } = useContext(AuthContext);
  const [activeTab, setActiveTab] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [ uploadedResources, setUploadResources] = useState(userData.uploadedResources || [])
  const savedResources = userData.savedResources || [];
   
  const sharedResources= [
          {
            id: 1,
            title: 'Frontend Development Guide',
            description: 'Learn HTML, CSS, JS with real-world projects.',
            type: 'Roadmap',
            link: 'https://frontendguide.dev',
          },
          {
            id: 2,
            title: 'DBMS Notes',
            description: 'Concise and well-structured database notes.',
            type: 'Notes',
            link: 'https://dbmsnotes.com',
          },
          {
            id: 3,
            title: 'System Design Book',
            description: 'A practical guide for system design interviews.',
            type: 'Book',
            link: 'https://systemdesignbook.com',
          },
          {
            id: 4,
            title: 'JavaScript Cheatsheet',
            description: 'All important JS syntax in one page.',
            type: 'Notes',
            link: 'https://jscheats.dev',
          },
          {
            id: 5,
            title: 'AI Engineer Roadmap',
            description: 'Full roadmap to become an AI Engineer.',
            type: 'Roadmap',
            link: 'https://airoadmap.tech',
          }
        ]
  ;
  
  
  

  const handleNewResource = (newResource) => {
    setUploadResources((prev) => [newResource, ...prev]);
  };

  const getDisplayedResources = () => {
    if (!isLoggedIn && (activeTab === 'saved' || activeTab === 'uploads')) return null;

    const base =
      activeTab === 'all'
        ? sharedResources
        : activeTab === 'saved'
        ? savedResources
        : uploadedResources;

    return base.filter(
      (res) =>
        res.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        res.type.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };

  const filteredResources = getDisplayedResources();

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
            <div key={res.id} className="resources-resource-card">
              <h3>{res.title}</h3>
              <p>{res.description}</p>
              <p><strong>Type:</strong> {res.type}</p>
              <a href={res.link} target="_blank" rel="noopener noreferrer">🔗 Visit</a>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default Resources;
