import mongoose from "mongoose";

const Schema = mongoose.Schema;

const faqSchema = new Schema(
  {
    question: {
      type: String,
      required: true,
    },
    answer: {
      type: String,
      required: true,
    },
  },
  { timestamps: true } // Automatically create 'createdAt' and 'updatedAt' fields
);

// Exporting the FAQ model
export default mongoose.model("FAQNautika", faqSchema);
