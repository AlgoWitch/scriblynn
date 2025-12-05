import Message from '../models/Message.js';
import Conversation from '../models/Conversation.js';

// Create a group conversation
export const createGroupConversation = async (req, res) => {
  try {
    const { name, members } = req.body; // members is array of userIds
    if (!members || members.length < 1) {
      return res.status(400).json({ message: 'Group must have at least 1 other member' });
    }
    
    // Add current user to members
    const allMembers = [...members, req.user.id];

    const conversation = await Conversation.create({
      name,
      members: allMembers,
      isGroup: true,
      groupAdmin: req.user.id
    });

    const populated = await Conversation.findById(conversation._id).populate('members', 'username profilePicture');
    res.status(201).json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get user conversations
export const getConversations = async (req, res) => {
  try {
    const conversations = await Conversation.find({
      members: { $in: [req.user.id] }
    })
    .populate('members', 'username profilePicture')
    .populate('lastMessage')
    .sort({ updatedAt: -1 });

    res.json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Send a message
export const sendMessage = async (req, res) => {
  const { recipient, content, conversationId, mediaType, mediaUrl } = req.body;

  try {
    let chatId = conversationId;

    // If no conversationId, check if 1-on-1 conversation exists or create it
    if (!chatId && recipient) {
      let conversation = await Conversation.findOne({
        isGroup: false,
        members: { $all: [req.user.id, recipient] }
      });

      if (!conversation) {
        conversation = await Conversation.create({
          members: [req.user.id, recipient],
          isGroup: false
        });
      }
      chatId = conversation._id;
    }

    if (!chatId) {
      return res.status(400).json({ message: 'Recipient or Conversation ID required' });
    }

    const message = new Message({
      sender: req.user.id,
      conversationId: chatId,
      content,
      mediaType: mediaType || 'text',
      mediaUrl
    });

    await message.save();

    // Update last message in conversation
    await Conversation.findByIdAndUpdate(chatId, {
      lastMessage: message._id
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'username profilePicture')
      .populate('conversationId');
      
    res.status(201).json(populatedMessage); // Return directly, not wrapped in { message: ... } to match frontend expectation if possible, or update frontend. 
    // Previous controller returned { message: '...', message: populatedMessage }. 
    // I'll return populatedMessage directly or { data: populatedMessage }? 
    // Standard is usually the object.
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error: error.message });
  }
};

// Get messages by Conversation ID
export const getMessages = async (req, res) => {
  const { conversationId } = req.params;

  try {
    const messages = await Message.find({ conversationId })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePicture');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error: error.message });
  }
};

// Retrieve messages between two users (Legacy support)
export const getMessagesByUser = async (req, res) => {
  const { userId } = req.params;
  try {
    const conversation = await Conversation.findOne({
        isGroup: false,
        members: { $all: [req.user.id, userId] }
    });

    if (!conversation) return res.json([]);

    const messages = await Message.find({ conversationId: conversation._id })
      .sort({ createdAt: 1 })
      .populate('sender', 'username profilePicture');

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
};