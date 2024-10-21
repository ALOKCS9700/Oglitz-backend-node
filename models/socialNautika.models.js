import mongoose from "mongoose";

const Schema = mongoose.Schema;

const socialSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    url: {
      type: String,
      required: true,
    },
    image: {
      type: String, // URL or path to the image
      required: true,
    },
  },
  { timestamps: true } // Automatically create 'createdAt' and 'updatedAt' fields
);

export default mongoose.model("SocialNautika", socialSchema);
