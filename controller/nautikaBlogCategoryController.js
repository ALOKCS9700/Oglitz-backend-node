import NautikaCategory from "../models/category.models.js";
// Create Category
export const createCategory = async (req, res) => {
  try {
    const { name, description, image } = req.body;

    // Check if all required fields are present
    if (!name || !description || !image) {
      return res
        .status(400)
        .json({ error: "All fields are required (name, description, image)." });
    }

    const newCategory = new NautikaCategory({
      name,
      description,
      image,
    });

    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};


// Update Category
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;
    updateData.updatedDate = Date.now();

    const updatedCategory = await NautikaCategory.findByIdAndUpdate(
      id,
      updateData,
      { new: true }
    );
    if (!updatedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Get All Categories
export const getAllCategories = async (req, res) => {
  try {
    // Get page and limit from query parameters, with defaults
    const page = parseInt(req.query.page) || 1; // Default to page 1
    const limit = parseInt(req.query.limit) || 10; // Default to 10 items per page

    // Calculate the number of documents to skip
    const skip = (page - 1) * limit;

    // Fetch categories with pagination
    const categories = await NautikaCategory.find()
      .sort({ createdDate: -1 })
      .skip(skip)
      .limit(limit);

    // Count total number of documents
    const total = await NautikaCategory.countDocuments();

    // Respond with the categories and additional pagination info
    res.status(200).json({
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit), // Calculate total pages
      categories,
    });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};


// Get Category by ID
export const getCategoryById = async (req, res) => {
  try {
    const { id } = req.params;
    const category = await NautikaCategory.findById(id);
    if (!category) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json(category);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Search Categories by Text
export const searchCategoriesByText = async (req, res) => {
  try {
    const { searchText } = req.query;
    const categories = await NautikaCategory.find({
      categoryName: { $regex: searchText, $options: "i" },
    }).sort({ createdDate: -1 });
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};

// Delete Category
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCategory = await NautikaCategory.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: "Category not found" });
    }
    res.status(200).json({ message: "Category deleted successfully" });
  } catch (error) {
    res.status(500).json({ error: "Server error" });
  }
};
