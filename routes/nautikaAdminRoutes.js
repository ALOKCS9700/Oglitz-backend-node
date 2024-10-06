import express from "express";
import {
  getDashboardData,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
  searchBlogsByCategoryAndText,
} from "../controller/nautikaBlogController.js";
import {
  createCategory,
  updateCategory,
  deleteCategory,
  getAllCategories,
  getCategoryById,
  searchCategoriesByText,
} from "../controller/nautikaBlogCategoryController.js";

const router = express.Router();

// Dashboard
router.get("/dashboard", getDashboardData);

// Blog APIs
router.post("/blogs", createBlog);
router.put("/blogs/:id", updateBlog);
router.delete("/blogs/:id", deleteBlog);
router.get("/blogs", getAllBlogs);
router.get("/blogs/:id", getBlogById);
router.get("/blogs/category/:categoryId", getBlogsByCategory);
router.get("/blogs/search", searchBlogsByCategoryAndText);

// Category APIs
router.post("/categories", createCategory);
router.put("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);
router.get("/categories", getAllCategories);
router.get("/categories/:id", getCategoryById);
router.get("/categories/search", searchCategoriesByText);

export default router;
