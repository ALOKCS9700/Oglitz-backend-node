import mongoose from "mongoose";

const Schema = mongoose.Schema;

const teamSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    designation: {
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

export default mongoose.model("TeamNautika", teamSchema);
