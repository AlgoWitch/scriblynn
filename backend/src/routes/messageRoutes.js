// filepath: /backend/src/routes/messageRoutes.js
import express from 'express';
import { sendMessage, getMessages } from '../controllers/messageController.js';
import { authenticate } from '../middleware/authMiddleware.js';

const router = express.Router();

// Route to send a message
router.post('/send', authenticate, sendMessage);

// Route to get messages between users
router.get('/:userId', authenticate, getMessages);

export default router;