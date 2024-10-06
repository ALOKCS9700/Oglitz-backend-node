import express from "express";
import {
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
  searchBlogsByCategoryAndText,
} from "../controller/nautikaBlogController.js";
import {
  getAllCategories,
  getCategoryById,
  searchCategoriesByText,
} from "../controller/nautikaBlogCategoryController.js";

const router = express.Router();

// Public Blog APIs
router.get("/blogs", getAllBlogs); // Fetch all blogs
router.get("/blogs/:id", getBlogById); // Fetch blog by ID
router.get("/blogs/category/:categoryId", getBlogsByCategory); // Fetch blogs by category
router.post("/blogs/search", searchBlogsByCategoryAndText); // Search blogs

// Public Category APIs
router.get("/categories", getAllCategories); // Fetch all categories
router.get("/categories/:id", getCategoryById); // Fetch category by ID
router.get("/categories/search", searchCategoriesByText); // Search categories

export default router;
