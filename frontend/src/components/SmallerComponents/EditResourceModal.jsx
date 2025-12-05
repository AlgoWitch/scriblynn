import React, { useState, useEffect } from 'react';
import { resourceAPI } from '../../utils/api';
import './EditResourceModal.css';

const EditResourceModal = ({ resource, onClose, onUpdate }) => {
    const [formData, setFormData] = useState({
        title: '',
        description: '',
        link: '',
        type: 'Book',
    });
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (resource) {
            setFormData({
                title: resource.title || '',
                description: resource.description || '',
                link: resource.link || '',
                type: resource.type || 'Book',
            });
        }
    }, [resource]);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async () => {
        if (formData.title && formData.link && formData.type) {
            setLoading(true);
            try {
                const response = await resourceAPI.updateResource(resource._id || resource.id, formData);
                onUpdate(response.data);
                onClose();
            } catch (error) {
                console.error('Failed to update resource:', error);
                const serverMessage = error?.response?.data?.message || error.message || 'Failed to update resource.';
                alert(serverMessage);
            } finally {
                setLoading(false);
            }
        } else {
            alert("Please fill in all required fields.");
        }
    };

    return (
        <div className="edit-resource-modal">
            <div className="edit-resource-modal-content">
                <h2>Edit Resource</h2>
                <input
                    type="text"
                    name="title"
                    placeholder="Resource Title"
                    value={formData.title}
                    onChange={handleChange}
                />
                <textarea
                    name="description"
                    placeholder="Description (optional)"
                    value={formData.description}
                    onChange={handleChange}
                />
                <input
                    type="text"
                    name="link"
                    placeholder="Link to Resource"
                    value={formData.link}
                    onChange={handleChange}
                />
                <select name="type" value={formData.type} onChange={handleChange}>
                    <option value="Book">Book</option>
                    <option value="Notes">Notes</option>
                    <option value="Roadmap">Roadmap</option>
                    <option value="Video">Video</option>
                    <option value="Blog">Blog</option>
                    <option value="Other">Other</option>
                </select>

                <div className="modal-buttons">
                    <button onClick={handleSubmit} className="save-btn" disabled={loading}>
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button onClick={onClose} className="cancel-btn" disabled={loading}>Cancel</button>
                </div>
            </div>
        </div>
    );
};

export default EditResourceModal;
