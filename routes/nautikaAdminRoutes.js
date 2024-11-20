import express from "express";
import path from "path";
import fs from "fs";
import Busboy from "busboy";
import {
  getDashboardData,
  createBlog,
  updateBlog,
  deleteBlog,
  getAllBlogs,
  getBlogById,
  getBlogBySlug,
  testAPI,
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

router.get("/blog/:slug", getBlogBySlug);

router.get("/blogs/testAPI", testAPI);

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

router.post("/intro/upload-image", (req, res) => {
  const bb = new Busboy({ headers: req.headers });
  const uploadPath = path.join("__dirname", "..", "uploads");

  bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const filePath = path.join(
      uploadPath,
      `${Date.now()}${path.extname(filename)}`
    );
    file.pipe(fs.createWriteStream(filePath));

    file.on("end", () => {
      console.log(`File ${filename} uploaded successfully.`);
      const fileUrl = `/uploads/${path.basename(filePath)}`;
      res.status(200).json({ message: "File uploaded successfully.", fileUrl });
    });
  });

  bb.on("finish", () => {
    // No need to send a response here as it is handled in the 'file' event
  });

  req.pipe(bb);
});

// Upload gallery data with image
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

router.post("/gallery/upload", (req, res) => {
  const bb = new Busboy({ headers: req.headers });
  const uploadPath = path.join("__dirname", "..", "uploads");

  let title = "";
  let description = "";

  // Handle form fields
  bb.on("field", (fieldname, value) => {
    if (fieldname === "title") {
      title = value;
    } else if (fieldname === "description") {
      description = value;
    }
  });

  // Handle file uploads
  bb.on("file", (fieldname, file, filename, encoding, mimetype) => {
    const filePath = path.join(
      uploadPath,
      `${Date.now()}${path.extname(filename)}`
    );
    file.pipe(fs.createWriteStream(filePath));

    file.on("end", () => {
      console.log(`File ${filename} uploaded successfully.`);
      const fileUrl = `/uploads/${path.basename(filePath)}`;

      // Save gallery data into the database
      const newGalleryItem = new galleryModels({
        title,
        description,
        imageUrl: fileUrl,
      });

      newGalleryItem
        .save()
        .then((savedGalleryItem) => {
          res.status(201).json({
            status: true,
            message: "Gallery item uploaded successfully.",
            data: savedGalleryItem,
          });
        })
        .catch((error) => {
          res.status(500).json({ message: error.message });
        });
    });
  });

  // Finish handling
  bb.on("finish", () => {
    console.log("Upload finished");
  });

  req.pipe(bb);
});

// Get list of gallery items
router.get("/gallery", async (req, res) => {
  try {
    const galleryItems = await galleryModels.find(); // Fetch all gallery items from the database
    res.status(200).json({
      status: true,
      message: "Gallery items fetched successfully.",
      data: galleryItems,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

export default router;
