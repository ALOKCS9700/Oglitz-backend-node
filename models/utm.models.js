import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const utmSchema = new Schema(
  {
    source: {
      type: String,
      required: true
    },
    medium: {
      type: String,
      required: true
    },
    campaign: {
      type: String,
      required: true
    },
    term: {
      type: String,
      required: false
    },
    content: {
      type: String,
      required: false
    }
  },
  { timestamps: true }
);

export default mongoose.model('UTM', utmSchema);
