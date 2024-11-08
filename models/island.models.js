import mongoose from "mongoose";

const { Schema } = mongoose;

const popularBeachSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
  },
  content: {
    type: String,
    required: true,
  },
});

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
    cover_image: {
      type: String,
      required: false, // Optional if not mandatory
    },
    popular_beaches: {
      type: [popularBeachSchema], // Updated to an array of objects
      required: true,
    },
    things_to_do: {
      type: [String],
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
    tags: {
      type: String, // Comma-separated string
      required: false,
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
