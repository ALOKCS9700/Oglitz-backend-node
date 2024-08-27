import mongoose from "mongoose";

const Schema = mongoose.Schema;

const commentSchema = new Schema({
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    content: {
      type: String,
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }, { timestamps: true });
  
  export default mongoose.model('Comment', commentSchema);
  