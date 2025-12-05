
import React, { useState, useContext, useEffect, useRef } from 'react';
import { AuthContext } from '../SmallerComponents/AuthContext';
import { Link } from 'react-router-dom';
import { messageAPI, authAPI } from '../../utils/api';
import { FaPlus, FaImage, FaVideo, FaSmile, FaPaperPlane, FaUsers } from 'react-icons/fa';
import './Messages.css';

function Messages() {
  const { isLoggedIn, currentUser } = useContext(AuthContext);
  const [conversations, setConversations] = useState([]);
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [allUsers, setAllUsers] = useState([]);
  const [showNewChatModal, setShowNewChatModal] = useState(false);
  const [showGroupModal, setShowGroupModal] = useState(false);
  const [groupName, setGroupName] = useState('');
  const [selectedGroupMembers, setSelectedGroupMembers] = useState([]);
  const [mediaUrl, setMediaUrl] = useState('');
  const [mediaType, setMediaType] = useState('text');

  const messagesEndRef = useRef(null);

  // Fetch conversations and users
  useEffect(() => {
    if (isLoggedIn) {
      loadConversations();
      authAPI.getAllUsers().then(res => {
        setAllUsers(res.data.filter(u => u._id !== currentUser._id));
      }).catch(err => console.error('Failed to load users', err));
    }
  }, [isLoggedIn, currentUser]);

  const loadConversations = async () => {
    try {
      const res = await messageAPI.getConversations();
      setConversations(res.data);
    } catch (err) {
      console.error('Failed to load conversations', err);
    }
  };

  // Poll for messages when conversation is selected
  useEffect(() => {
    if (selectedConversation) {
      loadMessages(selectedConversation._id);
      const interval = setInterval(() => loadMessages(selectedConversation._id), 3000);
      return () => clearInterval(interval);
    }
  }, [selectedConversation]);

  const loadMessages = async (conversationId) => {
    try {
      const res = await messageAPI.getMessagesByConversation(conversationId);
      setMessages(res.data);
      // Only scroll if it's a fresh load or new message (simple check: length changed)
      // For now, just scroll to bottom on every load might be annoying if user scrolled up.
      // Better: scroll only if we are already near bottom or if it's initial load.
      // For simplicity in this iteration:
      // scrollToBottom(); 
    } catch (err) {
      console.error('Failed to load messages', err);
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !mediaUrl) || !selectedConversation) return;

    try {
      const res = await messageAPI.sendMessage({
        conversationId: selectedConversation._id,
        content: newMessage,
        mediaType: mediaType,
        mediaUrl: mediaUrl
      });

      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      setMediaUrl('');
      setMediaType('text');
      loadConversations(); // Update last message in sidebar
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Failed to send message');
    }
  };

  const handleCreateGroup = async () => {
    if (!groupName.trim() || selectedGroupMembers.length === 0) return;
    try {
      const res = await messageAPI.createGroup({
        name: groupName,
        members: selectedGroupMembers
      });
      setConversations(prev => [res.data, ...prev]);
      setSelectedConversation(res.data);
      setShowGroupModal(false);
      setGroupName('');
      setSelectedGroupMembers([]);
    } catch (err) {
      console.error('Failed to create group', err);
      alert('Failed to create group');
    }
  };

  const startDirectChat = async (userId) => {
    // Check if conversation exists locally
    const existing = conversations.find(c => !c.isGroup && c.members.some(m => m._id === userId));
    if (existing) {
      setSelectedConversation(existing);
      setShowNewChatModal(false);
      return;
    }

    // If not, we can just set a temporary state or send a message to create it.
    // But our backend creates it on first message.
    // To make UI smoother, let's just "select" a fake conversation object or handle it.
    // Actually, let's just send a "Hi" message or empty message? No.
    // Best way: Just show the chat view for this user.
    // But my UI relies on `selectedConversation` object.
    // I'll create a temporary object.
    const user = allUsers.find(u => u._id === userId);
    const tempConv = {
      _id: null, // No ID yet
      isGroup: false,
      members: [currentUser, user],
      tempRecipientId: userId // Helper to know who to send to
    };
    // Wait, sendMessage needs conversationId OR recipient.
    // If I set selectedConversation to this temp object, handleSendMessage needs to handle it.

    // Actually, let's just send a request to backend to find/create conversation without sending message?
    // No endpoint for that yet.
    // Let's just use the `sendMessage` logic: if `selectedConversation._id` is missing, use `tempRecipientId`.

    // But `handleSendMessage` uses `selectedConversation._id`.
    // I'll update `handleSendMessage`.

    setSelectedConversation(tempConv);
    setShowNewChatModal(false);
    setMessages([]);
  };

  // Update handleSendMessage to handle temp conversation
  const handleSendMessageWithTemp = async (e) => {
    e.preventDefault();
    if ((!newMessage.trim() && !mediaUrl) || !selectedConversation) return;

    const payload = {
      content: newMessage,
      mediaType: mediaType,
      mediaUrl: mediaUrl
    };

    if (selectedConversation._id) {
      payload.conversationId = selectedConversation._id;
    } else if (selectedConversation.tempRecipientId) {
      payload.recipient = selectedConversation.tempRecipientId;
    } else {
      return;
    }

    try {
      const res = await messageAPI.sendMessage(payload);

      // If it was a temp conversation, now we have the real one.
      if (!selectedConversation._id) {
        // The response is the message, which has conversationId populated (object)
        const realConvId = res.data.conversationId._id || res.data.conversationId;
        // We need to fetch the full conversation or just construct it.
        // Let's reload conversations to get the proper object.
        await loadConversations();
        // And set selected to the new one.
        // We can find it in the new list.
        // For now, just reload conversations and let user click? No, that's bad UX.
        // Let's try to find it.
        const newConv = await messageAPI.getConversations().then(r => r.data.find(c => c._id === realConvId));
        if (newConv) setSelectedConversation(newConv);
      }

      setMessages(prev => [...prev, res.data]);
      setNewMessage('');
      setMediaUrl('');
      setMediaType('text');
      loadConversations();
    } catch (err) {
      console.error('Failed to send message', err);
      alert('Failed to send message');
    }
  };

  const getInitials = (name) => {
    if (!name) return 'U';
    return name.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);
  };

  const getConversationName = (conv) => {
    if (conv.isGroup) return conv.name;
    const otherMember = conv.members.find(m => m._id !== currentUser._id);
    return otherMember ? otherMember.username : 'Unknown User';
  };

  const getConversationImage = (conv) => {
    if (conv.isGroup) return null; // Placeholder for group
    const otherMember = conv.members.find(m => m._id !== currentUser._id);
    return otherMember ? otherMember.profilePicture : null;
  };

  if (!isLoggedIn) {
    return (
      <div className="messages-page">
        <div className="login-prompt-card">
          <h2>✨ Join the Conversation</h2>
          <p>Sign up or log in to chat with friends, join groups, and share your thoughts.</p>
          <Link to="/login">
            <button className="primary-btn">Login / Signup</button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="messages-page">
      <div className="messages-container">
        {/* Sidebar */}
        <div className="messages-sidebar">
          <div className="sidebar-header">
            <h3>Chats</h3>
            <div style={{ display: 'flex', gap: '10px' }}>
              <button onClick={() => setShowNewChatModal(true)} className="icon-btn" title="New Chat"><FaPlus /></button>
              <button onClick={() => setShowGroupModal(true)} className="icon-btn" title="New Group"><FaUsers /></button>
            </div>
          </div>
          <div className="users-list">
            {conversations.map(conv => (
              <div
                key={conv._id}
                className={`user-item ${selectedConversation?._id === conv._id ? 'active' : ''}`}
                onClick={() => setSelectedConversation(conv)}
              >
                <div className="user-avatar">
                  {getConversationImage(conv) ? (
                    <img src={getConversationImage(conv)} alt="avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {conv.isGroup ? 'G' : getInitials(getConversationName(conv))}
                    </div>
                  )}
                </div>
                <div className="user-info">
                  <h4>{getConversationName(conv)}</h4>
                  <p className="user-status">
                    {conv.lastMessage ? (
                      conv.lastMessage.content ?
                        (conv.lastMessage.content.length > 20 ? conv.lastMessage.content.substring(0, 20) + '...' : conv.lastMessage.content)
                        : (conv.lastMessage.mediaType === 'image' ? '📷 Photo' : '🎥 Video')
                    ) : 'Start chatting'}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Chat Area */}
        <div className="chat-area">
          {selectedConversation ? (
            <>
              <div className="chat-header">
                <div className="user-avatar small">
                  {getConversationImage(selectedConversation) ? (
                    <img src={getConversationImage(selectedConversation)} alt="avatar" />
                  ) : (
                    <div className="avatar-placeholder">
                      {selectedConversation.isGroup ? 'G' : getInitials(getConversationName(selectedConversation))}
                    </div>
                  )}
                </div>
                <h3>{getConversationName(selectedConversation)}</h3>
              </div>

              <div className="messages-list">
                {messages.length === 0 ? (
                  <div className="no-messages">No messages yet. Say hi! 👋</div>
                ) : (
                  messages.map((msg, index) => {
                    const isMe = msg.sender._id === currentUser._id || msg.sender === currentUser._id;
                    return (
                      <div key={index} className={`message-bubble ${isMe ? 'sent' : 'received'}`}>
                        {msg.mediaUrl && (
                          <div className="message-media">
                            {msg.mediaType === 'video' ? (
                              <video src={msg.mediaUrl} controls style={{ maxWidth: '100%', borderRadius: '8px' }} />
                            ) : (
                              <img src={msg.mediaUrl} alt="attachment" style={{ maxWidth: '100%', borderRadius: '8px' }} />
                            )}
                          </div>
                        )}
                        {msg.content && <p>{msg.content}</p>}
                        <span className="timestamp">
                          {new Date(msg.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>
                    );
                  })
                )}
                <div ref={messagesEndRef} />
              </div>

              <form className="message-input-area" onSubmit={handleSendMessageWithTemp}>
                <div className="media-inputs">
                  <button type="button" className="media-btn" onClick={() => {
                    const url = prompt("Enter Image URL:");
                    if (url) { setMediaUrl(url); setMediaType('image'); }
                  }}><FaImage /></button>
                  <button type="button" className="media-btn" onClick={() => {
                    const url = prompt("Enter Video URL:");
                    if (url) { setMediaUrl(url); setMediaType('video'); }
                  }}><FaVideo /></button>
                </div>
                <input
                  type="text"
                  placeholder={mediaUrl ? "Add a caption..." : "Type a message..."}
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                />
                <button type="submit" disabled={!newMessage.trim() && !mediaUrl}><FaPaperPlane /></button>
              </form>
              {mediaUrl && (
                <div className="media-preview">
                  <span>Attached: {mediaType}</span>
                  <button onClick={() => { setMediaUrl(''); setMediaType('text'); }}>✕</button>
                </div>
              )}
            </>
          ) : (
            <div className="no-chat-selected">
              <h3>Select a conversation or start a new one</h3>
            </div>
          )}
        </div>
      </div>

      {/* New Chat Modal */}
      {showNewChatModal && (
        <div className="modal-overlay" onClick={() => setShowNewChatModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Start New Chat</h3>
            <div className="users-list-modal">
              {allUsers.map(user => (
                <div key={user._id} className="user-item-modal" onClick={() => startDirectChat(user._id)}>
                  <div className="user-avatar small">
                    {user.profilePicture ? <img src={user.profilePicture} alt={user.username} /> : <div className="avatar-placeholder">{getInitials(user.username)}</div>}
                  </div>
                  <span>{user.username}</span>
                </div>
              ))}
            </div>
            <button className="close-modal-btn" onClick={() => setShowNewChatModal(false)}>Close</button>
          </div>
        </div>
      )}

      {/* Create Group Modal */}
      {showGroupModal && (
        <div className="modal-overlay" onClick={() => setShowGroupModal(false)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <h3>Create New Group</h3>
            <input
              placeholder="Group Name"
              value={groupName}
              onChange={e => setGroupName(e.target.value)}
              className="group-name-input"
            />
            <div className="users-list-modal">
              {allUsers.map(user => (
                <div
                  key={user._id}
                  className={`user-item-modal ${selectedGroupMembers.includes(user._id) ? 'selected' : ''}`}
                  onClick={() => {
                    if (selectedGroupMembers.includes(user._id)) {
                      setSelectedGroupMembers(prev => prev.filter(id => id !== user._id));
                    } else {
                      setSelectedGroupMembers(prev => [...prev, user._id]);
                    }
                  }}
                >
                  <div className="user-avatar small">
                    {user.profilePicture ? <img src={user.profilePicture} alt={user.username} /> : <div className="avatar-placeholder">{getInitials(user.username)}</div>}
                  </div>
                  <span>{user.username}</span>
                  {selectedGroupMembers.includes(user._id) && <span className="check-mark">✓</span>}
                </div>
              ))}
            </div>
            <button className="create-group-btn" onClick={handleCreateGroup}>Create Group</button>
            <button className="close-modal-btn" onClick={() => setShowGroupModal(false)}>Cancel</button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Messages;

