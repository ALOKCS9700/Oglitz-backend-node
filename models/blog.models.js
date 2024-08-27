import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const blogSchema = new Schema({
  image: {
    type: String,
    required: true,
  },
  heading: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  readTime: {
    type: String,
    required: true,
  },
  author: {
    type: String,
    required: true,
  },
  hashtags: [String],  // Array of hashtags
  keywords: [String],  // Array of keywords
  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Category',
    required: true,
  },
  publicationDate: {
    type: Date,
    default: Date.now,
  },
  postId: {
    type: String,
    unique: true,
    required: true,
  },
  content: {
    type: String,
    required: true,
  }
}, { timestamps: true });

export default mongoose.model('Blog', blogSchema);
