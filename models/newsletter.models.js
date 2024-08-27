import mongoose from 'mongoose';

const Schema = mongoose.Schema;

const newsletterSchema = new Schema(
  {
    email: {
      type: String,
      required: true,
      unique: true,
      validate: {
        validator: function (v) {
          return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
        },
        message: props => `${props.value} is not a valid email!`
      }
    },
    name: {
      type: String,
      required: true
    },
    subscribedAt: {
      type: Date,
      default: Date.now
    }
  },
  { timestamps: true }
);

export default mongoose.model('Newsletter', newsletterSchema);
