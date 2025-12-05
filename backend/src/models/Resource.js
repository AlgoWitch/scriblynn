import mongoose from 'mongoose';

const resourceSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true
  },
  description: {
    type: String,
    required: [true, 'Description is required']
  },
  type: {
    type: String,
    required: [true, 'Type is required'],
    enum: ['Roadmap', 'Notes', 'Book', 'Tutorial', 'Tool', 'Other']
  },
  link: {
    type: String,
    required: [true, 'Link is required'],
    trim: true
  },
  author: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  savedBy: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  tags: [String]
}, {
  timestamps: true
});

const Resource = mongoose.model('Resource', resourceSchema);

export default Resource;
