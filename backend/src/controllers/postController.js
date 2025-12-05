import Post from '../models/Post.js';

// @desc    Create a new post
// @route   POST /api/posts
export const createPost = async (req, res) => {
  try {
    const { title, content, tags, image, anonymous } = req.body;
    
    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      tags,
      image,
      anonymous: anonymous || false
    });

    const populatedPost = await Post.findById(post._id).populate('author', 'username profilePicture');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts
// @route   GET /api/posts
// @desc    Get all posts (public feed)
// @route   GET /api/posts
export const getPosts = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const tag = req.query.tag || '';
    const author = req.query.author || '';
    const skip = (page - 1) * limit;

    // Build query
    const query = {
      $or: [{ community: { $exists: false } }, { community: null }]
    };

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$and = [
        {
          $or: [
            { title: searchRegex },
            { content: searchRegex }
          ]
        }
      ];
    }

    if (tag) {
      query.tags = tag;
    }

    if (author) {
      query.author = author;
    }

    const totalPosts = await Post.countDocuments(query);
    const totalPages = Math.ceil(totalPosts / limit);

    const posts = await Post.find(query)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('comments.replies.user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);
    
    res.json({
      posts,
      currentPage: page,
      totalPages,
      totalPosts
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get post by ID
// @route   GET /api/posts/:id
export const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('comments.replies.user', 'username profilePicture');
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update post
// @route   PUT /api/posts/:id
export const updatePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    const updatedPost = await Post.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'username profilePicture');
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
export const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    // Check if user is author
    if (post.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }
    
    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike post
// @route   POST /api/posts/:id/like
export const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const isLiked = post.likes.includes(req.user.id);
    
    if (isLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user.id);
    } else {
      post.likes.push(req.user.id);
    }
    
    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add comment to post
// @route   POST /api/posts/:id/comment
export const addComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    post.comments.push({
      user: req.user.id,
      text: req.body.text
    });
    
    await post.save();
    
    const updatedPost = await Post.findById(post._id)
      .populate('author', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .populate('comments.replies.user', 'username profilePicture');
    
    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike comment
// @route   PUT /api/posts/:id/comment/:commentId/like
export const likeComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    const isLiked = comment.likes.includes(req.user.id);
    if (isLiked) {
      comment.likes = comment.likes.filter(id => id.toString() !== req.user.id);
    } else {
      comment.likes.push(req.user.id);
    }

    await post.save();
    
    const updatedPost = await Post.findById(post._id)
       .populate('author', 'username profilePicture')
       .populate('comments.user', 'username profilePicture')
       .populate('comments.replies.user', 'username profilePicture');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Reply to comment
// @route   POST /api/posts/:id/comment/:commentId/reply
export const replyToComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) return res.status(404).json({ message: 'Post not found' });

    const comment = post.comments.id(req.params.commentId);
    if (!comment) return res.status(404).json({ message: 'Comment not found' });

    comment.replies.push({
      user: req.user.id,
      text: req.body.text
    });

    await post.save();

    const updatedPost = await Post.findById(post._id)
       .populate('author', 'username profilePicture')
       .populate('comments.user', 'username profilePicture')
       .populate('comments.replies.user', 'username profilePicture');

    res.json(updatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};