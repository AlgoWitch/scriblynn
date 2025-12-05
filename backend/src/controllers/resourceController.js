import Resource from '../models/Resource.js';

// @desc    Create a new resource
// @route   POST /api/resources
export const createResource = async (req, res) => {
  try {
    const { title, description, type, link, tags } = req.body;

    const resource = await Resource.create({
      title,
      description,
      type,
      link,
      tags,
      author: req.user.id
    });

    const populatedResource = await Resource.findById(resource._id).populate('author', 'username profilePicture');
    res.status(201).json(populatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all resources
// @route   GET /api/resources
// @desc    Get all resources
// @route   GET /api/resources
export const getResources = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const search = req.query.search || '';
    const author = req.query.author || '';
    const savedBy = req.query.savedBy || '';
    const skip = (page - 1) * limit;

    const query = {};

    if (search) {
      const searchRegex = new RegExp(search, 'i');
      query.$or = [
        { title: searchRegex },
        { description: searchRegex },
        { type: searchRegex }
      ];
    }

    if (author) {
      query.author = author;
    }

    if (savedBy) {
      query.savedBy = savedBy;
    }

    const totalResources = await Resource.countDocuments(query);
    const totalPages = Math.ceil(totalResources / limit);

    const resources = await Resource.find(query)
      .populate('author', 'username profilePicture')
      .sort({ title: 1 })
      .skip(skip)
      .limit(limit);

    res.json({
      resources,
      currentPage: page,
      totalPages,
      totalResources
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get resource by ID
// @route   GET /api/resources/:id
export const getResourceById = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id)
      .populate('author', 'username profilePicture');

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update resource
// @route   PUT /api/resources/:id
export const updateResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is author
    if (resource.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    const updatedResource = await Resource.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    ).populate('author', 'username profilePicture');

    res.json(updatedResource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete resource
// @route   DELETE /api/resources/:id
export const deleteResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    // Check if user is author
    if (resource.author.toString() !== req.user.id) {
      return res.status(401).json({ message: 'Not authorized' });
    }

    await resource.deleteOne();
    res.json({ message: 'Resource deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Save/unsave resource
// @route   POST /api/resources/:id/save
export const saveResource = async (req, res) => {
  try {
    const resource = await Resource.findById(req.params.id);

    if (!resource) {
      return res.status(404).json({ message: 'Resource not found' });
    }

    const isSaved = resource.savedBy.includes(req.user.id);

    if (isSaved) {
      resource.savedBy = resource.savedBy.filter(id => id.toString() !== req.user.id);
    } else {
      resource.savedBy.push(req.user.id);
    }

    await resource.save();
    res.json(resource);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's uploaded resources
// @route   GET /api/resources/user/uploads
export const getUserUploads = async (req, res) => {
  try {
    const resources = await Resource.find({ author: req.user.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's saved resources
// @route   GET /api/resources/user/saved
export const getUserSaved = async (req, res) => {
  try {
    const resources = await Resource.find({ savedBy: req.user.id })
      .populate('author', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(resources);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
