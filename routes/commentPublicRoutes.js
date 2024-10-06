import express from "express";
import {
  postComment,
  getCommentsForBlog,
} from "../controllers/commentController.js";

const router = express.Router();

// Comment APIs
router.post("/comments/:postId", postComment); // Post a comment for a blog
router.get("/comments/:postId", getCommentsForBlog); // Get comments for a blog

export default router;
