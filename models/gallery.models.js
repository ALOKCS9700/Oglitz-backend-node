import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      default: "",
    },
    tag: {
      type: String,
      default: "",
    },
    content: {
      type: String,
      default: "",
    },
    options: {
      type: [String], // Array of options
      default: [],
    },
    imageUrl: {
      type: String, // Store the URL of the uploaded image
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Gallery", gallerySchema);
