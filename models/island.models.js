import mongoose from "mongoose";

const { Schema } = mongoose;

const islandSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    about: {
      type: String,
      required: true,
    },
    best_time: {
      type: String,
      required: true,
    },
    popular_beaches: {
      type: [String], // Array of beach names
      required: true,
    },
    things_to_do: {
      type: [String], // Array of activities
      required: true,
    },
    extra_content: {
      type: String,
      required: false,
    },
    images: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "IslandImage",
      },
    ],
    meta: {
      title: {
        type: String,
        required: false,
      },
      description: {
        type: String,
        required: false,
      },
    },
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
  },
  { timestamps: true }
);

export default mongoose.model("Island", islandSchema);
