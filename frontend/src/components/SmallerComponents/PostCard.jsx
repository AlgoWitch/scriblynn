import React, { useState, useContext } from 'react';
import { FaHeart, FaRegHeart, FaComment, FaRegComment, FaPaperPlane, FaEdit, FaTrash } from 'react-icons/fa';
import { AuthContext } from './AuthContext';
import { postAPI } from '../../utils/api';
import './PostCard.css';

const PostCard = ({ post, onTagClick, onDelete }) => {
    const { currentUser } = useContext(AuthContext);

    // Initialize state from props
    const [isLiked, setIsLiked] = useState(
        currentUser && post.likes ? post.likes.includes(currentUser._id) : false
    );
    const [likeCount, setLikeCount] = useState(post.likes ? post.likes.length : 0);

    const [showComments, setShowComments] = useState(false);
    const [comments, setComments] = useState(post.comments || []);
    const [commentText, setCommentText] = useState('');
    const [submittingComment, setSubmittingComment] = useState(false);
    const [replyingTo, setReplyingTo] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(post.title);
    const [editContent, setEditContent] = useState(post.content);

    const isAuthor = currentUser && (post.author?._id === currentUser._id || post.author === currentUser._id);

    const handleDelete = async () => {
        if (!window.confirm('Are you sure you want to delete this post?')) return;
        try {
            await postAPI.deletePost(post._id);
            if (onDelete) onDelete(post._id);
            else window.location.reload();
        } catch (error) {
            console.error('Failed to delete post:', error);
            alert('Failed to delete post');
        }
    };

    const handleEditSubmit = async () => {
        try {
            await postAPI.updatePost(post._id, { title: editTitle, content: editContent });
            setIsEditing(false);
            window.location.reload();
        } catch (error) {
            console.error('Failed to edit post:', error);
            alert('Failed to edit post');
        }
    };

    const isCommentLiked = (comment) => {
        return currentUser && comment.likes && comment.likes.includes(currentUser._id);
    };

    const getCommentLikeCount = (comment) => {
        return comment.likes ? comment.likes.length : 0;
    };

    const handleLikeComment = async (commentId) => {
        if (!currentUser) return;
        try {
            const res = await postAPI.likeComment(post._id, commentId);
            if (res.data && res.data.comments) {
                setComments(res.data.comments);
            }
        } catch (error) {
            console.error('Failed to like comment:', error);
        }
    };

    const handleReplySubmit = async (e, commentId) => {
        e.preventDefault();
        if (!replyText.trim() || !currentUser) return;

        try {
            const res = await postAPI.replyToComment(post._id, commentId, replyText);
            if (res.data && res.data.comments) {
                setComments(res.data.comments);
            }
            setReplyingTo(null);
            setReplyText('');
        } catch (error) {
            console.error('Failed to reply:', error);
        }
    };

    const handleLike = async () => {
        if (!currentUser) {
            alert('Please login to like posts');
            return;
        }

        // Optimistic update
        const newIsLiked = !isLiked;
        setIsLiked(newIsLiked);
        setLikeCount(prev => newIsLiked ? prev + 1 : prev - 1);

        try {
            await postAPI.likePost(post._id);
        } catch (error) {
            console.error('Failed to like post:', error);
            // Revert on error
            setIsLiked(!newIsLiked);
            setLikeCount(prev => !newIsLiked ? prev + 1 : prev - 1);
        }
    };

    const handleCommentSubmit = async (e) => {
        e.preventDefault();
        if (!commentText.trim() || !currentUser) return;

        setSubmittingComment(true);
        try {
            const res = await postAPI.addComment(post._id, commentText);
            // The backend returns the updated post with populated comments
            // We can take the last comment from there, or just the comments array
            if (res.data && res.data.comments) {
                setComments(res.data.comments);
            }
            setCommentText('');
        } catch (error) {
            console.error('Failed to add comment:', error);
            alert('Failed to add comment');
        } finally {
            setSubmittingComment(false);
        }
    };

    return (
        <div className="post-card">
            <div className="post-header">
                <div style={{ flex: 1 }}>
                    {isEditing ? (
                        <input
                            value={editTitle}
                            onChange={e => setEditTitle(e.target.value)}
                            className="edit-title-input"
                            autoFocus
                        />
                    ) : (
                        <h3 className="post-title">{post.title}</h3>
                    )}
                    <span className="post-meta">
                        {new Date(post.createdAt).toLocaleDateString()}
                    </span>
                </div>
                {isAuthor && !isEditing && (
                    <div className="post-management-actions">
                        <button onClick={() => setIsEditing(true)} className="manage-btn edit" title="Edit Post">
                            <FaEdit />
                        </button>
                        <button onClick={handleDelete} className="manage-btn delete" title="Delete Post">
                            <FaTrash />
                        </button>
                    </div>
                )}
            </div>

            <div className="post-content">
                {isEditing ? (
                    <div className="edit-mode-container">
                        <textarea
                            value={editContent}
                            onChange={e => setEditContent(e.target.value)}
                            className="edit-content-input"
                        />
                        <div className="edit-actions">
                            <button onClick={handleEditSubmit} className="save-btn">Save</button>
                            <button onClick={() => setIsEditing(false)} className="cancel-btn">Cancel</button>
                        </div>
                    </div>
                ) : (
                    post.content.length > 200 ? (
                        <>
                            {post.content.substring(0, 200)}...
                        </>
                    ) : (
                        post.content
                    )
                )}
            </div>

            {post.tags && post.tags.length > 0 && (
                <div className="post-tags">
                    {post.tags.map((tag, index) => (
                        <span
                            key={index}
                            className="post-tag"
                            onClick={() => onTagClick && onTagClick(tag)}
                        >
                            #{tag}
                        </span>
                    ))}
                </div>
            )}

            <div className="post-footer">
                <div className="author-info">
                    <span>🪷 {post.anonymous ? 'Anonymous' : (post.author?.username || 'Unknown')}</span>
                </div>

                <div className="post-actions">
                    <button
                        className={`action-btn ${isLiked ? 'liked' : ''}`}
                        onClick={handleLike}
                        title={isLiked ? "Unlike" : "Like"}
                    >
                        {isLiked ? <FaHeart /> : <FaRegHeart />}
                        <span>{likeCount}</span>
                    </button>

                    <button
                        className="action-btn"
                        onClick={() => setShowComments(!showComments)}
                        title="Comments"
                    >
                        {showComments ? <FaComment /> : <FaRegComment />}
                        <span>{comments.length}</span>
                    </button>
                </div>
            </div>

            {showComments && (
                <div className="comments-section">
                    {currentUser ? (
                        <form className="comment-input-area" onSubmit={handleCommentSubmit}>
                            <input
                                type="text"
                                className="comment-input"
                                placeholder="Write a comment..."
                                value={commentText}
                                onChange={(e) => setCommentText(e.target.value)}
                            />
                            <button
                                type="submit"
                                className="send-comment-btn"
                                disabled={!commentText.trim() || submittingComment}
                            >
                                <FaPaperPlane />
                            </button>
                        </form>
                    ) : (
                        <p style={{ textAlign: 'center', color: '#888', marginBottom: '1rem' }}>
                            Please login to comment.
                        </p>
                    )}

                    <div className="comments-list">
                        {comments.length === 0 ? (
                            <p style={{ textAlign: 'center', color: '#aaa', fontStyle: 'italic' }}>No comments yet.</p>
                        ) : (
                            comments.map((comment, idx) => (
                                <div key={comment._id || idx} className="comment-item">
                                    <div className="comment-main">
                                        <span className="comment-author">
                                            {comment.user?.username || 'User'}
                                        </span>
                                        <span className="comment-text">{comment.text}</span>
                                    </div>
                                    <div className="comment-actions">
                                        <button
                                            onClick={() => handleLikeComment(comment._id)}
                                            className={`comment-action-btn ${isCommentLiked(comment) ? 'liked' : ''}`}
                                            title="Like comment"
                                        >
                                            {isCommentLiked(comment) ? <FaHeart size={12} /> : <FaRegHeart size={12} />}
                                            <span style={{ marginLeft: '4px' }}>{getCommentLikeCount(comment)}</span>
                                        </button>
                                        <button
                                            onClick={() => setReplyingTo(replyingTo === comment._id ? null : comment._id)}
                                            className="comment-action-btn"
                                            title="Reply to comment"
                                        >
                                            Reply
                                        </button>
                                    </div>

                                    {replyingTo === comment._id && (
                                        <form onSubmit={(e) => handleReplySubmit(e, comment._id)} className="reply-input-area">
                                            <input
                                                type="text"
                                                value={replyText}
                                                onChange={(e) => setReplyText(e.target.value)}
                                                placeholder="Write a reply..."
                                                autoFocus
                                                className="reply-input"
                                            />
                                            <button type="submit" className="send-reply-btn"><FaPaperPlane size={12} /></button>
                                        </form>
                                    )}

                                    {comment.replies && comment.replies.length > 0 && (
                                        <div className="replies-list">
                                            {comment.replies.map((reply, rIdx) => (
                                                <div key={rIdx} className="reply-item">
                                                    <span className="reply-author">{reply.user?.username || 'User'}</span>
                                                    <span className="reply-text">{reply.text}</span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PostCard;
