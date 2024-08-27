import mongoose from "mongoose";

const Schema = mongoose.Schema;

const interactionSchema = new Schema({
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    postId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Blog',
      required: true,
    },
    type: {
      type: String,
      enum: ['like', 'share', 'bookmark'],
      required: true,
    },
    timestamp: {
      type: Date,
      default: Date.now,
    }
  }, { timestamps: true });
  
  export default mongoose.model('Interaction', interactionSchema);
  