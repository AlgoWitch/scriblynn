import express from 'express';
import { createCommunity, getCommunities, getCommunityById, updateCommunity, deleteCommunity } from '../controllers/communityController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Create a new community
router.post('/', authenticate, createCommunity);

// Get all communities
router.get('/', getCommunities);

// Get a community by ID
router.get('/:id', getCommunityById);

// Update a community by ID
router.put('/:id', authenticate, updateCommunity);

// Delete a community by ID
router.delete('/:id', authenticate, deleteCommunity);

export default router;