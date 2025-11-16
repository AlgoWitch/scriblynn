import Message from '../models/Message';

// Send a message from one user to another
export const sendMessage = async (req, res) => {
  const { receiverId, content } = req.body;

  try {
    const message = new Message({
      sender: req.user.id,
      receiver: receiverId,
      content,
      timestamp: new Date(),
    });

    await message.save();
    res.status(201).json({ message: 'Message sent successfully', message });
  } catch (error) {
    res.status(500).json({ message: 'Error sending message', error });
  }
};

// Retrieve messages between two users
export const getMessages = async (req, res) => {
  const { userId } = req.params;

  try {
    const messages = await Message.find({
      $or: [
        { sender: req.user.id, receiver: userId },
        { sender: userId, receiver: req.user.id },
      ],
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving messages', error });
  }
};