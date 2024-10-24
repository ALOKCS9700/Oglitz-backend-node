import mongoose from "mongoose";

const { Schema } = mongoose;

const islandImageSchema = new Schema(
  {
    image_title: {
      type: String,
      required: true,
    },
    image_desc: {
      type: String,
      required: true,
    },
    image_url: {
      type: String,
      required: true,
    },
    islandId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Island",
      required: true,
    },
  },
  { timestamps: true }
);

export default mongoose.model("IslandImage", islandImageSchema);
