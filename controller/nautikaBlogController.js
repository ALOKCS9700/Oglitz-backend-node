import NautikaBlog from "../models/blogs.models.js";
import NautikaCategory from "../models/category.models.js";
import mongoose from "mongoose";

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
    const blogs = await NautikaBlog.find().sort({ createdDate: -1 });
    res.status(200).json(blogs);
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
    const blogs = await NautikaBlog.find({ categoryId }).sort({
      createdDate: -1,
    });
    res.status(200).json(blogs);
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


