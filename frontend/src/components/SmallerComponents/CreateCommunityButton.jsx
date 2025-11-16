// src/components/SmallerComponents/CreateCommunityButton.jsx
import React, { useState, useEffect } from 'react';
import './CreateCommunityButton.css';

function CreateCommunityButton({ onCreate, initialData = null, onClose }) {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    if (initialData) {
      setName(initialData.name || '');
      setDescription(initialData.description || '');
    }
  }, [initialData]);

  const handleSubmit = (e) => {
    e.preventDefault();

    const newCommunity = {
      id: initialData?.id || Date.now(),
      name,
      description
    };

    onCreate(newCommunity);
    setName('');
    setDescription('');
    if (onClose) onClose();
  };

  return (
    <div className="modal-overlay">
      <div className="modal-box">
        <h2>{initialData ? 'Edit Community' : 'Create Community'}</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Community Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
          />
          <textarea
            placeholder="Community Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            required
          />
          <div className="modal-actions">
            <button type="submit">{initialData ? 'Update' : 'Create'}</button>
            <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default CreateCommunityButton;
