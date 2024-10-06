import mongoose from "mongoose";

const Schema = mongoose.Schema;

const categorySchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, "Path `name` is required."],
  },
  description: {
    type: String,
    required: [true, "Path `description` is required."],
  },
  image: {
    type: String,
    required: [true, "Path `image` is required."],
  },
  createdDate: {
    type: Date,
    default: Date.now,
  },
});


export default mongoose.model("NautikaCategory", categorySchema);
