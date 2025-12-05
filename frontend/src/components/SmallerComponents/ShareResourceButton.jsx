import React, { useState } from 'react';
import { resourceAPI } from '../../utils/api';
import './ShareResourceButton.css';

const ShareResourceButton = ({ onShare }) => {
  const [isModalOpen, setModalOpen] = useState(false);
  const [resource, setResource] = useState({
    title: '',
    description: '',
    link: '',
    type: 'Book',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setResource({ ...resource, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    if (resource.title && resource.link && resource.type) {
      setLoading(true);
      try {
        const response = await resourceAPI.createResource(resource);
        onShare(response.data);
        setResource({ title: '', description: '', link: '', type: 'Book' });
        setModalOpen(false);
      } catch (error) {
        console.error('Failed to create resource:', error);
        // Show server-provided message when available to aid debugging
        const serverMessage = error?.response?.data?.message || error.message || 'Failed to share resource. Please try again.';
        alert(serverMessage);
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <>
      <button className="share-resource-button" onClick={() => setModalOpen(true)}>
        Share Resource
      </button>

      {isModalOpen && (
        <div className="share-resource-modal">
          <div className="share-resource-modal-content">
            <h2>Share a Resource</h2>
            <input
              type="text"
              name="title"
              placeholder="Resource Title"
              value={resource.title}
              onChange={handleChange}
            />
            <textarea
              name="description"
              placeholder="Description (optional)"
              value={resource.description}
              onChange={handleChange}
            />
            <input
              type="text"
              name="link"
              placeholder="Link to Resource"
              value={resource.link}
              onChange={handleChange}
            />
            <select name="type" value={resource.type} onChange={handleChange}>
              <option value="Book">Book</option>
              <option value="Notes">Notes</option>
              <option value="Roadmap">Roadmap</option>
              <option value="Video">Video</option>
              <option value="Blog">Blog</option>
              <option value="Other">Other</option>
            </select>

            <div className="modal-buttons">
              <button onClick={handleSubmit} className="post-btn" disabled={loading}>
                {loading ? 'Sharing...' : 'Share'}
              </button>
              <button onClick={() => setModalOpen(false)} className="cancel-btn" disabled={loading}>Cancel</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default ShareResourceButton;
