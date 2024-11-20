import mongoose from "mongoose";

const Schema = mongoose.Schema;

const blogSchema = new Schema(
  {
    title: {
      type: String,
      required: true,
    },
    content: {
      type: Buffer,
      required: true,
    },
    slug: {
      type: String,
      required: true,
      unique: true,
    },
    readTime: {
      type: String,
      required: true,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    categoryName: {
      type: String,
      required: true,
    },
    status: {
      type: String,
      enum: ["Published", "Draft"],
      default: "Draft",
    },
    image: {
      type: String,
      required: false,
    },
    faqs: [
      {
        question: String,
        answer: String,
      },
    ],
    createdDate: {
      type: Date,
      default: Date.now,
    },
    updatedDate: {
      type: Date,
      default: Date.now,
    },
    // Optional meta fields
    metaTitle: {
      type: String,
      required: false,
    },
    metaDescription: {
      type: String,
      required: false,
    },
    metaKeywords: {
      type: String,
      required: false,
    },
    videoUrl: {
      type: String,
      required: false,
    },
    shortDescription: {
      type: String,
      required: false,
    },

    tags: {
      type: [String], // Array of strings for tags
      required: false,
    },
  },
  { timestamps: true }
);

blogSchema.pre("save", function (next) {
  if (!this.slug) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-zA-Z0-9]/g, "-")
      .replace(/-+/g, "-");
  }
  next();
});

export default mongoose.model("NautikaBlog", blogSchema);
