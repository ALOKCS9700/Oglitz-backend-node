import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
      type: String,
      required: true,
      unique: true,
    },
    description: {
      type: String,
      required: true,
    },
    keywords: [String],  // Array of keywords
    image: {
      type: String,
      required: true,
    }
  }, { timestamps: true });
  
  export default mongoose.model('Category', categorySchema);
  