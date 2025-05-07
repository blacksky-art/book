import express from 'express';
import User from '../models/User.js';
import asyncHandler from 'express-async-handler';
import jwt from 'jsonwebtoken';

const userRoutes = express.Router();

// Generate JWT token
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

//register
const registerUser = asyncHandler(async (req,res) => {
  const {name , email , password}
} )
//login
const loginUser = asyncHandler(async (req,res) => {
  const {email,password} = req.body;
  const user = await User.findOne({email});

  if(user && (await user.matchPassword(password))){
    user.firstLogin = false;
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      googleImage: user.googleImage,
      googleId: user.googleId,
      isAdmin: user.isAdmin,
      token: generateToken(user._id),
      active: user.active,
      firstLogin: user.firstLogin,
      created:user.createdAt,
    })
  } else {
    res.status(401).send('Invalid Email or password');
    throw new Error('User not found');
  }
});
//verify email

//password reset request

userRoutes('/login').post(loginUser);

export default userRoutes;
