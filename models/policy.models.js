import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const policySchema = new Schema(
  {
    type: {
      type: String,
      enum: ['terms_conditions', 'privacy_policy', 'refund_policy', 'cancellation_policy'],
      required: true,
      unique: true
    },
    content: {
      type: String,
      required: true
    }
  },
  { timestamps: true }
);

export default mongoose.model('Policy', policySchema);
