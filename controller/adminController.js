import Admin from "../models/admin.models.js";
import jwt from "jsonwebtoken";
import responseHelper from "../helpers/response.helper.js";
import hashPassword from "../middleware/hashPassword.js";
import { MESSAGE } from "../helpers/message.helper.js";
import User from "../models/user.models.js";
import introModels from "../models/intro.models.js";
import interactionModels from "../models/interaction.models.js";
import commentsModels from "../models/comments.models.js";
import categoryModels from "../models/category.models.js";
import blogModels from "../models/blog.models.js";

const { send200, send403, send400, send401, send404, send500 } = responseHelper;

// Login for Super Admin
const loginSuperAdmin = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return send400(res, {
      status: false,
      message: MESSAGE.FIELDS_REQUIRED,
    });
  }

  try {
    const admin = await Admin.findOne({ email });

    if (!admin || admin.role !== "SUPER_ADMIN") {
      return send404(res, {
        status: false,
        message: MESSAGE.USER_NOT_FOUND,
      });
    }

    const validPass = await hashPassword.compare(password, admin.password);

    if (!validPass) {
      return send400(res, {
        status: false,
        message: MESSAGE.LOGIN_ERROR,
      });
    }

    const token = jwt.sign(
      { _id: admin._id },
      process.env.JWT_SECRET
    );

    res.header("auth-token", token).status(200).json({
      status: true,
      token,
      message: MESSAGE.LOGIN_SUCCESS,
      data: admin,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Create a Super Admin
const createSuperAdmin = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) {
      return send400(res, {
        status: false,
        message: MESSAGE.FIELDS_REQUIRED,
      });
    }

    // Ensure that the Super Admin account doesn't already exist
    const existingAdmin = await Admin.findOne({ role: "SUPER_ADMIN" });
    if (existingAdmin) {
      return send400(res, {
        status: false,
        message: MESSAGE.SUPER_ADMIN_EXISTS,
      });
    }

    // Encrypt the password
    const encryptedPassword = await hashPassword.encrypt(password);

    // Create the Super Admin
    const newAdmin = new Admin({
      email,
      fullName,
      password: encryptedPassword,
      role: "SUPER_ADMIN",
    });

    const admin = await newAdmin.save();

    res.status(201).json({
      status: true,
      message: MESSAGE.SUPER_ADMIN_CREATED,
      data: admin,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Create a Sub-Admin
const createSubAdmin = async (req, res) => {
  const { email, fullName, password } = req.body;

  try {
    if (!email || !fullName || !password) {
      return send400(res, {
        status: false,
        message: MESSAGE.FIELDS_REQUIRED,
      });
    }

    const adminExists = await Admin.findOne({ email });

    if (adminExists) {
      return send400(res, {
        status: false,
        message: MESSAGE.USER_EXISTS,
      });
    }

    const encryptedPassword = await hashPassword.encrypt(password);

    const newAdmin = new Admin({
      email,
      fullName,
      password: encryptedPassword,
      role: "SUB_ADMIN",
    });

    const admin = await newAdmin.save();

    res.status(201).json({
      status: true,
      message: MESSAGE.ADMIN_CREATED,
      data: admin,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Get All Admins
const getAllAdmins = async (req, res) => {
  try {
    const admins = await Admin.find();
    res.status(200).json({
      status: true,
      message: MESSAGE.ADMINS_FETCHED,
      data: admins,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Update Admin Status (Activate/Deactivate)
const updateAdminStatus = async (req, res) => {
  const { adminId } = req.params;
  const { status } = req.body; // Expected to be a boolean or string like "active" / "inactive"

  try {
    if (!status) {
      return send400(res, {
        status: false,
        message: MESSAGE.STATUS_REQUIRED,
      });
    }

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { status },
      { new: true }
    );

    if (!updatedAdmin) {
      return send404(res, {
        status: false,
        message: MESSAGE.ADMIN_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: true,
      message: MESSAGE.STATUS_UPDATED,
      data: updatedAdmin,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Reset Admin Password
const resetAdminPassword = async (req, res) => {
  const { adminId } = req.params;
  const { newPassword } = req.body;

  try {
    if (!newPassword) {
      return send400(res, {
        status: false,
        message: MESSAGE.PASSWORD_REQUIRED,
      });
    }

    const encryptedPassword = await hashPassword.encrypt(newPassword);

    const updatedAdmin = await Admin.findByIdAndUpdate(
      adminId,
      { password: encryptedPassword },
      { new: true }
    );

    if (!updatedAdmin) {
      return send404(res, {
        status: false,
        message: MESSAGE.ADMIN_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: true,
      message: MESSAGE.PASSWORD_RESET,
      data: updatedAdmin,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Delete an Admin
const deleteAdmin = async (req, res) => {
  const { adminId } = req.params;

  try {
    const deletedAdmin = await Admin.findByIdAndDelete(adminId);

    if (!deletedAdmin) {
      return send404(res, {
        status: false,
        message: MESSAGE.ADMIN_NOT_FOUND,
      });
    }

    res.status(200).json({
      status: true,
      message: MESSAGE.ADMIN_DELETED,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};


// Get All Users
const getAllUsers = async (req, res) => {
  try {
    const users = await User.find();
    res.status(200).json({
      status: true,
      message: "Users fetched successfully.",
      data: users,
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};

// Update User
const updateUser = async (req, res) => {
  const { userId } = req.params;
  const {
    role, email, fullName, password, wallet, overallProfit, todayProfit,
    userPicture, totalInvested, otp, isProfileComplete, currency,
    joinedOn, profileStatus, phoneNumber, isPhoneNumberVerified
  } = req.query; // Extracting data from query parameters

  const updateFields = {};

  // Only include fields that are defined in req.query
  const allowedFields = [
    'role', 'email', 'fullName', 'password', 'wallet', 'overallProfit',
    'todayProfit', 'userPicture', 'totalInvested', 'otp', 'isProfileComplete',
    'currency', 'joinedOn', 'profileStatus', 'phoneNumber', 'isPhoneNumberVerified'
  ];

  allowedFields.forEach(field => {
    if (req.query[field] !== undefined && req.query[field] !== 'null') {
      // Convert string 'null' to actual null if necessary
      updateFields[field] = req.query[field] === 'null' ? null : req.query[field];
    }
  });

  try {
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: updateFields },
      { new: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        status: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "User updated successfully.",
      data: updatedUser,
    });
  } catch (error) {
    console.error("Update error:", error); // Log the error for debugging
    return res.status(500).json({
      status: false,
      message: error.message,
    });
  }
};



// Delete User
const deleteUser = async (req, res) => {
  const { userId } = req.params;

  try {
    const deletedUser = await User.findByIdAndDelete(userId);

    if (!deletedUser) {
      return send404(res, {
        status: false,
        message: "User not found.",
      });
    }

    res.status(200).json({
      status: true,
      message: "User deleted successfully.",
    });
  } catch (error) {
    return send500(res, {
      status: false,
      message: error.message,
    });
  }
};



// Add intro details
const addIntroDetails = async (req, res) => {
  try {
    const { introTitle, introDescription, introHashtags, introBanner } = req.body;
    const newIntro = new introModels({ introTitle, introDescription, introHashtags, introBanner });
    const savedIntro = await newIntro.save();
    res.status(201).json(savedIntro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Update intro details
const updateIntroDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const { introTitle, introDescription, introHashtags, introBanner } = req.body;
    const updatedIntro = await introModels.findByIdAndUpdate(
      id,
      { introTitle, introDescription, introHashtags, introBanner },
      { new: true }
    );
    if (!updatedIntro) return res.status(404).json({ message: "Intro not found" });
    res.json(updatedIntro);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllIntroDetails = async (req, res) => {
  try {
    const introDetails = await introModels.find(); // Fetch all intro details
    res.json(introDetails);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

//delete intro api
const deleteIntroDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedIntro = await introModels.findByIdAndDelete(id); // Delete intro detail by ID
    if (!deletedIntro) return res.status(404).json({ message: "Intro not found" });
    res.json({ message: "Intro deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// Upload intro banner image
export const uploadIntroImage = (req, res) => {
  console.log('Request Headers:', req.headers);
  console.log('Request Body:', req.body);
  console.log('File:', req.file);

  if (!req.file) {
    return res.status(400).send('No file uploaded.');
  }

  const fileUrl = `/uploads/${req.file.filename}`;
  res.status(200).json({
    message: 'File uploaded successfully',
    fileUrl: fileUrl
  });
};

// new




export const createBlog = async (req, res) => {
  try {
    const { image, heading, description, readTime, author, hashtags, keywords, category, content } = req.body;

    // Validate category
    const categoryExists = await categoryModels.findById(category);
    if (!categoryExists) {
      return res.status(400).json({ error: 'Invalid category ID.' });
    }

    const newBlog = new Blog({
      image,
      heading,
      description,
      readTime,
      author,
      hashtags,
      keywords,
      category,
      content,
      postId: new mongoose.Types.ObjectId(), // Generate a unique ID
    });

    await newBlog.save();
    res.status(201).json(newBlog);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const updateBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedBlog = await blogModels.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(200).json(updatedBlog);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const deleteBlog = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedBlog = await blogModels.findByIdAndDelete(id);
    if (!deletedBlog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(200).json({ message: 'Blog deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const getBlogById = async (req, res) => {
  try {
    const { id } = req.params;
    const blog = await blogModels.findById(id).populate('category');
    if (!blog) {
      return res.status(404).json({ error: 'Blog not found.' });
    }
    res.status(200).json(blog);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};





export const getAllBlogs = async (req, res) => {
  try {
    const blogs = await blogModels.find().sort({ publicationDate: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};



export const getDashboardData = async (req, res) => {
  try {
    // Dashboard data example
    const totalBlogs = await blogModels.countDocuments();
    const totalCategories = await Category.countDocuments();

    res.status(200).json({ totalBlogs, totalCategories });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};



export const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await blogModels.find({ category: categoryId }).sort({ publicationDate: -1 });
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const getTop10BlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await blogModels.find({ category: categoryId }).sort({ publicationDate: -1 }).limit(10);
    res.status(200).json(blogs);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};

export const createCategory = async (req, res) => {
  try {
    const { name, description, keywords, image } = req.body;

    const newCategory = new categoryModels({ name, description, keywords, image });
    await newCategory.save();
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const updateData = req.body;

    const updatedCategory = await categoryModels.findByIdAndUpdate(id, updateData, { new: true });
    if (!updatedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).json(updatedCategory);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;

    const deletedCategory = await categoryModels.findByIdAndDelete(id);
    if (!deletedCategory) {
      return res.status(404).json({ error: 'Category not found.' });
    }
    res.status(200).json({ message: 'Category deleted successfully.' });
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const getAllCategories = async (req, res) => {
  try {
    const categories = await categoryModels.find();
    res.status(200).json(categories);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};


export const postComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { userId, content } = req.body;

    const newComment = new commentsModels({ postId, userId, content });
    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};



export const getCommentsForBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await commentsModels.find({ postId }).populate('userId');
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};

export const interactWithBlog = async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, type } = req.body;

    const newInteraction = new interactionModels({ userId, postId: id, type });
    await newInteraction.save();
    res.status(201).json(newInteraction);
  } catch (error) {
    res.status(500).json({ error: 'Server error, please try again.' });
  }
};



const adminController = {
  loginSuperAdmin,
  createSuperAdmin,  // Export createSuperAdmin
  createSubAdmin,
  getAllAdmins,
  updateAdminStatus,
  resetAdminPassword,
  deleteAdmin,
  getAllUsers,
  updateUser,
  deleteUser,
  addIntroDetails,
  updateIntroDetails,
  uploadIntroImage,
  getAllIntroDetails,
  deleteIntroDetails,

  interactWithBlog,
  getCommentsForBlog,
  postComment,
  getAllCategories,
  deleteCategory,
  updateCategory,
  createCategory,
  getTop10BlogsByCategory,
  getBlogsByCategory,
  getDashboardData,
  getAllBlogs,
  getBlogById, deleteBlog, updateBlog, createBlog
};

export default adminController;
