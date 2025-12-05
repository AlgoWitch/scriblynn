import Community from '../models/Community.js';
import Post from '../models/Post.js';

// @desc    Create a new community
// @route   POST /api/communities
export const createCommunity = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    const community = await Community.create({
      name,
      description,
      admin: req.user.id,
      members: [req.user.id],
      image
    });

    const populatedCommunity = await Community.findById(community._id).populate('admin', 'username');
    res.status(201).json(populatedCommunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all communities
// @route   GET /api/communities
export const getCommunities = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const type = req.query.type || ''; // 'created', 'subscribed', 'recommended'
    const userId = req.query.userId || '';
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { name: searchRegex },
        { description: searchRegex }
      ];
    }

    if (userId) {
      if (type === 'created') {
        query.admin = userId;
      } else if (type === 'subscribed') {
        query.members = userId;
      } else if (type === 'recommended') {
        query.admin = { $ne: userId };
        query.members = { $ne: userId };
      }
    }

    const totalCommunities = await Community.countDocuments(query);
    const totalPages = Math.ceil(totalCommunities / limit);

    const communities = await Community.find(query)
      .populate('admin', 'username')
      .populate('members', 'username')
      .sort({ name: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      communities,
      currentPage: page,
      totalPages,
      totalCommunities
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get community by ID
// @route   GET /api/communities/:id
export const getCommunityById = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id)
      .populate('admin', 'username')
      .populate('members', 'username')
      .populate('posts');

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    res.json(community);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update community
// @route   PUT /api/communities/:id
export const updateCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if user is admin
    if (community.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedCommunity = await Community.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('admin', 'username');

    res.json(updatedCommunity);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete community
// @route   DELETE /api/communities/:id
export const deleteCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);

    if (!community) {
      return res.status(404).json({ message: 'Community not found' });
    }

    // Check if user is admin
    if (community.admin.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await community.deleteOne();
    res.json({ message: 'Community deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join a community
// @route   POST /api/communities/:id/join
export const joinCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const isMember = community.members.some(m => m.toString() === req.user.id);
    if (isMember) return res.status(400).json({ message: 'Already a member' });

    community.members.push(req.user.id);
    await community.save();

    const populated = await Community.findById(community._id).populate('members', 'username').populate('admin', 'username');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave/unjoin a community
// @route   POST /api/communities/:id/leave
export const leaveCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    community.members = community.members.filter(m => m.toString() !== req.user.id);
    await community.save();

    const populated = await Community.findById(community._id).populate('members', 'username').populate('admin', 'username');
    res.json(populated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create a post inside a community
// @route   POST /api/communities/:id/posts
export const addPostToCommunity = async (req, res) => {
  try {
    const community = await Community.findById(req.params.id);
    if (!community) return res.status(404).json({ message: 'Community not found' });

    const { title, content, tags, anonymous, image } = req.body;

    const post = await Post.create({
      title,
      content,
      author: req.user.id,
      tags,
      image,
      anonymous: anonymous || false,
      community: community._id
    });

    // add post to community
    community.posts.push(post._id);
    await community.save();

    const populatedPost = await Post.findById(post._id).populate('author', 'username profilePicture');
    res.status(201).json(populatedPost);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
