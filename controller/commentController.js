import NautikaComment from "../models/comment.model.js";

// Post a Comment
export const postComment = async (req, res) => {
  try {
    const { postId } = req.params; // Blog post ID
    const { userId, content } = req.body; // Assuming userId is passed with the comment

    const newComment = new NautikaComment({
      postId,
      userId,
      content,
    });

    await newComment.save();
    res.status(201).json(newComment);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};

// Get Comments for a Blog
export const getCommentsForBlog = async (req, res) => {
  try {
    const { postId } = req.params;
    const comments = await NautikaComment.find({ postId }).populate(
      "userId",
      "name"
    ); // Assuming user model has a 'name' field
    res.status(200).json(comments);
  } catch (error) {
    res.status(500).json({ error: `Server error: ${error.message}` });
  }
};
