import express from "express";
const router = express.Router();
import userController from "../controller/userController.js";
import verifyToken from "../utils/verifyToken.js";
const { register, sendOtp, verifyOtp, getUserProfile, login,getIntro,getBlogsByCategory,getBlogById,getAllBlogs,searchBlogs,postComment,getCommentsForBlog,interactWithBlog } = userController;

router.post("/register", register);
// router.post("/sendotp", sendOtp);
router.post("/sendotp", verifyToken, sendOtp);
router.post("/verifyotp", verifyToken, verifyOtp);
router.get("/getuserprofile", verifyToken, getUserProfile);
router.post("/login", login);
router.get("/getIntro", getIntro);


// Blog Retrieval
router.get('/blogs/category/:categoryId', getBlogsByCategory);
router.get('/blogs/:id', getBlogById);
router.get('/blogs', getAllBlogs);
router.get('/blogs/search', searchBlogs);

// Comment Management
router.post('/comments/:postId', postComment);
router.get('/comments/:postId', getCommentsForBlog);

// Interaction Management
router.post('/interactions/:id', interactWithBlog);



export default router;
