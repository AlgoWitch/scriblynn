import express from 'express';
import { createCommunity, getCommunities, getCommunityById, updateCommunity, deleteCommunity } from '../controllers/communityController.js';
import { joinCommunity, leaveCommunity, addPostToCommunity } from '../controllers/communityController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new community
router.post('/', protect, createCommunity);

// Get all communities
router.get('/', getCommunities);

// Get a community by ID
router.get('/:id', getCommunityById);

// Join a community
router.post('/:id/join', protect, joinCommunity);

// Leave a community
router.post('/:id/leave', protect, leaveCommunity);

// Add a post to a community
router.post('/:id/posts', protect, addPostToCommunity);

// Update a community by ID
router.put('/:id', protect, updateCommunity);

// Delete a community by ID
router.delete('/:id', protect, deleteCommunity);

export default router;