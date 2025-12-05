import express from 'express';
import { 
  createPost, 
  getPosts, 
  getPostById, 
  updatePost, 
  deletePost,
  likePost,
  addComment,
  likeComment,
  replyToComment
} from '../controllers/postController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/', protect, createPost);
router.get('/', getPosts);
router.get('/:id', getPostById);
router.put('/:id', protect, updatePost);
router.delete('/:id', protect, deletePost);
router.post('/:id/like', protect, likePost);
router.post('/:id/comment', protect, addComment);
router.put('/:id/comment/:commentId/like', protect, likeComment);
router.post('/:id/comment/:commentId/reply', protect, replyToComment);

export default router;