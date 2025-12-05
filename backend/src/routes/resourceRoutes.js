import express from 'express';
import {
  createResource,
  getResources,
  getResourceById,
  updateResource,
  deleteResource,
  saveResource,
  getUserUploads,
  getUserSaved
} from '../controllers/resourceController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Public routes
router.get('/', getResources);

// User specific routes (must be before '/:id' to avoid route collision)
router.get('/user/uploads', protect, getUserUploads);
router.get('/user/saved', protect, getUserSaved);

// Resource ID routes
router.get('/:id', getResourceById);

// Protected routes
router.post('/', protect, createResource);
router.put('/:id', protect, updateResource);
router.delete('/:id', protect, deleteResource);
router.post('/:id/save', protect, saveResource);

export default router;
