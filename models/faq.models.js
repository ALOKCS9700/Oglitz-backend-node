import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
    appType: {
      type: String,
      enum: ['tech', 'marketplace'],
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model('FAQ', faqSchema);
