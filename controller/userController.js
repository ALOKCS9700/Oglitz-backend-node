import User from "../models/user.models.js";
import jwt from "jsonwebtoken";
import responseHelper from "../helpers/response.helper.js";
import hashPassword from "../middleware/hashPassword.js";
import { MESSAGE } from "../helpers/message.helper.js";
import generateOtp from "../utils/generateOtp.js";
import nodemailer from 'nodemailer';
import { google } from 'googleapis';
import introModels from "../models/intro.models.js";
import blogModels from "../models/blog.models.js";
import interactionModels from "../models/interaction.models.js";
import commentsModels from "../models/comments.models.js";
const { send200, send403, send400, send401, send404, send500 } = responseHelper;

const register = async (req, res) => {
  const { fullName, email, password } = req.body;
  try {
    if (!fullName || !email || !password) {
      return send400(res, {
        status: false,
        message: MESSAGE.FIELDS_REQUIRED,
      });
    }
    const userExists = await User.findOne({ email });
    if (userExists) {
      return send400(res, {
        status: false,
        message: MESSAGE.USER_EXISTS,
      });
    }
    const encryptedPassword = await hashPassword.encrypt(password);
    const newUser = new User({
      fullName,
      email,
      password: encryptedPassword,
    });
    const user = await newUser.save();
    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res
      .header("auth-token", token)
      .status(201)
      .json({
        status: true,
        token: token,
        message: `${MESSAGE.USER_REGISTERED}. ${MESSAGE.VERIFY_NUMBER}`,
        data: user,
      });
  } catch (error) {
    return send400(res, {
      status: false,
      message: error.message,
    });
  }
};
const validateEmail = (email) => {
  const re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@(([^<>()[\]\.,;:\s@"]+\.)+[^<>()[\]\.,;:\s@"]{2,})$/i;
  return re.test(String(email).toLowerCase());
};
const CLIENT_ID = '497105170769-jovr105n48s95l213oq6n470el356ml1.apps.googleusercontent.com';
const CLIENT_SECRET = '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';
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFRESH_TOKEN = '1//04MXrIC-7Nw25CgYIARAAGAQSNwF-L9IrfQ7VVNAcO9xVLkb6_fOCg24Qdaj0D3tv0lmv9oqwP7JTvR2eN8gbR_eeNVGoejOl_Hs';

const oAuth2Client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oAuth2Client.setCredentials({ refresh_token: REFRESH_TOKEN });

const sendOtp = async (req, res) => {
  const { email, userId,name } = req.body;

  try {
    const newOtp = generateOtp(4);
    await User.findOneAndUpdate(
      { _id: userId },
      { $set: { otp: newOtp, email } }
    );
    const { token: accessToken } = await oAuth2Client.getAccessToken();

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        type: 'OAuth2',
        user: 'eyalokmani@gmail.com',
        clientId: CLIENT_ID,
        clientSecret: CLIENT_SECRET,
        refreshToken: REFRESH_TOKEN,
        accessToken: accessToken,
      },
    });

    const mailOptions = {
      from: 'eyalokmani@gmail.com',
      to: email,
      subject: 'Your OTP for Tradex Pro',
      html: `

<html>
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f4f4f4;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: auto;
            background: #ffffff;
            padding: 20px;
            border-radius: 5px;
            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
        }
        h1 {
            font-size: 24px;
            color: #333;
        }
        p {
            font-size: 16px;
            color: #555;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #007BFF;
        }
        .footer {
            margin-top: 20px;
            font-size: 14px;
            color: #777;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Hi ${name?name:'User'},</h1>
        <p>Your OTP code is:</p>
        <p class="otp-code">${newOtp}</p>
        <p>Please enter this code to verify your identity.</p>
        <div class="footer">
            <p>Thank you for using our service!</p>
        </div>
    </div>
</body>
</html>

      `,
    };
    

    // Send email
    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        console.log('Error sending email:', error);
        return send400(res, { status: false, message: error.message });
      } else {
        console.log('Email sent:', info);
        return send200(res, { status: true, message: MESSAGE.OTP_SENT });
      }
    });
  } catch (error) {
    console.log('Error:', error);
    return send400(res, { status: false, message: error.message });
  }
};

const verifyOtp = async (req, res) => {
  const { otp } = req.body;
  const userId = req.user._id;
  try {
    const user = await User.findOne({
      _id: userId,
    });
    if (!user) {
      return send404(res, {
        status: false,
        message: MESSAGE.USER_NOT_FOUND,
      });
    }
    if (!otp) {
      return send400(res, {
        status: false,
        message: MESSAGE.ENTER_OTP,
      });
    }
    if (otp !== user.otp) {
      return send400(res, {
        status: false,
        message: MESSAGE.INVALID_OTP,
      });
    }
    await User.findOneAndUpdate(
      { _id: userId },
      {
        $set: {
          isProfileComplete: true,
          new: true,
          otp: null,
          joinedOn: new Date(),
          isPhoneNumberVerified: true,
        },
      }
    );
 

    res.header("auth-token", token).status(200).json({
      status: true,
      token: token,
      message: MESSAGE.PHONE_VERIFICATION,
      data,
    });
  } catch (error) {
    return send400(res, {
      status: false,
      message: error.message,
    });
  }
};
const getUserProfile = async (req, res) => {
  const userId = req.user._id;
  try {
    const user = await User.findOne({ _id: userId });
    if (!user) {
      return send404(res, {
        status: false,
        message: MESSAGE.USER_NOT_FOUND,
      });
    }
    return send200(res, {
      status: true,
      message: MESSAGE.USER_PROFILE,
      data: user,
    });
  } catch (error) {
    return send400(res, {
      status: false,
      message: error.message,
    });
  }
};
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return send400(res, {
      status: false,
      message: MESSAGE.FIELDS_REQUIRED,
    });
  }

  try {
    const user = await User.findOne({ email });

    if (!user) {
      return send404(res, {
        status: false,
        message: MESSAGE.USER_NOT_FOUND,
      });
    }

    const validPass = await hashPassword.compare(password, user.password);

    if (!validPass) {
      return send400(res, {
        status: false,
        message: MESSAGE.LOGIN_ERROR,
      });
    }

    const token = jwt.sign(
      {
        _id: user._id,
      },
      process.env.JWT_SECRET
    );

    res.header("auth-token", token).status(200).json({
      status: true,
      token,
      message: MESSAGE.LOGIN_SUCCESS,
      data: user,
    });
  } catch (error) {
    return send400(res, {
      status: false,
      message: error.message,
    });
  }
};



const getIntro = async (req, res) => {
  try {
    // Fetch introductory information from the database
    const intro = await introModels.findOne({});

    if (!intro) {
      return send404(res, {
        status: false,
        message: MESSAGE.INTRO_NOT_FOUND,
      });
    }

    // Respond with the introductory information
    return send200(res, {
      status: true,
      message: 'Introduction data retrieved successfully',
      data: intro,
    });
  } catch (error) {
    // Handle any errors
    return send400(res, {
      status: false,
      message: MESSAGE.INTERNAL_ERROR,
    });
  }
};



//new

export const getBlogsByCategory = async (req, res) => {
  try {
    const { categoryId } = req.params;
    const blogs = await blogModels.find({ category: categoryId }).sort({ publicationDate: -1 });
    res.status(200).json(blogs);
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


export const searchBlogs = async (req, res) => {
  try {
    const { query } = req.query;
    const blogs = await blogModels.find({ heading: { $regex: query, $options: 'i' } }).sort({ publicationDate: -1 });
    res.status(200).json(blogs);
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



const userController = {
  register,
  sendOtp,
  verifyOtp,
  getUserProfile,
  login,
  getIntro,
  getBlogsByCategory,getBlogById,getAllBlogs,searchBlogs,postComment,getCommentsForBlog,interactWithBlog 
};

export default userController;
