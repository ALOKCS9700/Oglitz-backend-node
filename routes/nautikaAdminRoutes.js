import express from "express";
import {
  getDashboardData,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogsByCategory,
  loginSuperAdmin,
  searchBlogsByCategoryAndText,
  createTestimonial,
  updateTestimonial,
  deleteTestimonial,
  createGallery,
  updateGallery,
  deleteGallery,
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
router.post("/login", loginSuperAdmin);

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


//testimoneal api
// CRUD routes for Testimonial
router.post("/testimonials", createTestimonial); // Create a testimonial
router.put("/testimonials/:id", updateTestimonial); // Update a testimonial by ID
router.delete("/testimonials/:id", deleteTestimonial); // Delete a testimonial by ID




// Gallery Routes
router.post("/galleries", createGallery); // Create a new gallery
router.put("/galleries/:id", updateGallery); // Update a gallery by ID
router.delete("/galleries/:id", deleteGallery); // Delete a gallery by ID

export default router;
