// filepath: /backend/src/routes/messageRoutes.js
import express from 'express';
import { 
  sendMessage, 
  getMessages, 
  getMessagesByUser, 
  createGroupConversation, 
  getConversations 
} from '../controllers/messageController.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/send', protect, sendMessage);
router.post('/group', protect, createGroupConversation);
router.get('/conversations', protect, getConversations);
router.get('/conversation/:conversationId', protect, getMessages);
router.get('/:userId', protect, getMessagesByUser);

export default router;