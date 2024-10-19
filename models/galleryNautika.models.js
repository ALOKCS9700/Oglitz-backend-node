import mongoose from "mongoose";

const Schema = mongoose.Schema;

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    images: {
      type: [String], // Array of image URLs
      required: true, // This field is required
    },
    video_url: {
      type: String, // Optional field for a video
      required: false,
    },
    coverImage: {
      type: String,
      required: true, // This field is required
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("GalleryNautika", gallerySchema);
