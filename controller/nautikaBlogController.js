import NautikaBlog from "../models/blogs.models.js";
import NautikaCategory from "../models/category.models.js";
import mongoose from "mongoose";
import testimonelModes from "../models/testimonel.modes.js";
import galleryNautikaModels from "../models/galleryNautika.models.js";

// Get Dashboard Data
export const getDashboardData = async (req, res) => {
  try {
    const totalBlogs = await NautikaBlog.countDocuments();
    const totalCategories = await NautikaCategory.countDocuments();
    const recentBlogs = await NautikaBlog.find()
      .sort({ createdDate: -1 })
      .limit(5);
    const recentCategories = await NautikaCategory.find()
      .sort({ createdDate: -1 })
      .limit(5);

    const topCategory = await NautikaBlog.aggregate([
      { $group: { _id: "$categoryId", count: { $sum: 1 } } },
      { $sort: { count: -1 } },
      { $limit: 1 },
    ]);

    res
      .status(200)
      .json({
        totalBlogs,
        totalCategories,
        recentBlogs,
        recentCategories,
        topCategory,
      });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Create Blog
export const createBlog = async (req, res) => {
  try {
    const {
      title,
      content,
      readTime,
      categoryId,
      categoryName,
      status,
      image,
      faqs,
      metaTitle, // Add this line
      metaDescription, // Add this line
      metaKeywords, // Add this line
      videoUrl,
    } = req.body;

    const newBlog = new NautikaBlog({
      title,
      content,
      readTime,
      categoryId,
      categoryName,
      status,
      image,
      faqs,
      metaTitle, // Add this line
      metaDescription, // Add this line
      metaKeywords, // Add this line
      videoUrl,
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// Update Blog
export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedDate = Date.now();

    const updatedBlog = await NautikaBlog.findByIdAndUpdate(id, updateData, {
      new: true,
    });
    if (!updatedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// Delete Blog
export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedBlog = await NautikaBlog.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json({ message: "Blog deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// Get All Blogs
export const getAllBlogs = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch blogs with pagination
    const blogs = await NautikaBlog.find()
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit);

    // Count total number of documents
    const total = await NautikaBlog.countDocuments();

    // Respond with the blogs and additional pagination info
    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Calculate total pages
      blogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Get Blog by ID
export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await NautikaBlog.findById(id);
    if (!blog) {
      return res.status(404).json({ error: "Blog not found" });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get Blogs by Category
export const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch blogs by category with pagination
    const blogs = await NautikaBlog.find({ categoryId })
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit);

    // Count total number of documents for the category
    const total = await NautikaBlog.countDocuments({ categoryId });

    // Respond with the blogs and additional pagination info
    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Calculate total pages
      blogs,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Search Blogs by Category and Text
export const searchBlogsByCategoryAndText = async (req, res) => {
  try {
    const { categoryId, searchText } = req.body; // Using req.body instead of req.query

    // Build query object based on presence of categoryId and searchText
    const query = {};

    if (categoryId) {
      query.categoryId = categoryId;
    }

    if (searchText) {
      query.$or = [
        { title: { $regex: searchText, $options: "i" } },
        { content: { $regex: searchText, $options: "i" } },
      ];
    }

    const blogs = await NautikaBlog.find(query).sort({ createdDate: -1 });

    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// testimonial 
// Create a new testimonial
export const createTestimonial = async (req, res) => {
  try {
    const testimonial = new testimonelModes(req.body);
    await testimonial.save();
    res.status(201).json(testimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Get all testimonials with pagination
export const getAllTestimonials = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const skip = (page - 1) * limit; // Number of items to skip

    const totalCount = await testimonelModes.countDocuments(); // Total number of testimonials
    const testimonials = await testimonelModes
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sorting by creation date in descending order

    res.status(200).json({
      testimonials,
      page,
      totalPages: Math.ceil(totalCount / limit),
      count: totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a testimonial by ID
export const getTestimonialById = async (req, res) => {
  try {
    const testimonial = await testimonelModes.findById(req.params.id);
    if (!testimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }
    res.status(200).json(testimonial);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a testimonial by ID
export const updateTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedTestimonial = await testimonelModes.findByIdAndUpdate(
      id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json(updatedTestimonial);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a testimonial by ID
export const deleteTestimonial = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedTestimonial = await testimonelModes.findByIdAndDelete(id);

    if (!deletedTestimonial) {
      return res.status(404).json({ message: "Testimonial not found" });
    }

    res.status(200).json({ message: "Testimonial deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};





//Gallery
// Create a new gallery
export const createGallery = async (req, res) => {
  try {
    // Destructure properties from the request body
    const {
      title,
      images,
      video_url,  // Optional
      coverImage,
    } = req.body;

    // Create a new gallery instance with destructured values
    const gallery = new galleryNautikaModels({
      title,
      images, // Expecting an array of image URLs
      video_url, // Optional
      coverImage,
    });

    // Save the gallery to the database
    await gallery.save();
    res.status(201).json(gallery);
  } catch (error) {
    console.error("Error creating gallery:", error.message); // Log error for debugging
    res.status(400).json({ message: error.message });
  }
};
// Get all galleries with pagination
export const getAllGalleries = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1; // Current page number
    const limit = parseInt(req.query.limit) || 10; // Number of items per page
    const skip = (page - 1) * limit; // Number of items to skip

    const totalCount = await galleryNautikaModels.countDocuments(); // Total number of galleries
    const galleries = await galleryNautikaModels
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 }); // Sorting by creation date in descending order

    res.status(200).json({
      galleries,
      page,
      totalPages: Math.ceil(totalCount / limit),
      count: totalCount,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get a gallery by ID
export const getGalleryById = async (req, res) => {
  try {
    const gallery = await galleryNautikaModels.findById(req.params.id);
    if (!gallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.status(200).json(gallery);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update a gallery by ID
export const updateGallery = async (req, res) => {
  try {
    const updatedGallery = await galleryNautikaModels.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedGallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }

    res.status(200).json(updatedGallery);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Delete a gallery by ID
export const deleteGallery = async (req, res) => {
  try {
    const deletedGallery = await galleryNautikaModels.findByIdAndDelete(
      req.params.id
    );
    if (!deletedGallery) {
      return res.status(404).json({ message: "Gallery not found" });
    }
    res.status(200).json({ message: "Gallery deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};