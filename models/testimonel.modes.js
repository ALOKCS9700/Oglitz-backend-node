import mongoose from "mongoose";

const Schema = mongoose.Schema;

const testimonialSchema = new Schema(
  {
    type: {
      type: String,
      enum: ["text", "video"],
      required: true,
    },
    coverImage: {
      type: String,
      required: true,
    },
    text: {
      type: String,
      required: function () {
        return this.type === "text";
      },
    },
    video_url: {
      type: String,
      required: function () {
        return this.type === "video";
      },
    },
    name: {
      type: String,
      required: true,
    },
    dateCreated: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Testimonial", testimonialSchema);
