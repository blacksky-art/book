import jwt from 'jsonwebtoken';
import asyncHandler from 'express-async-handler';
import User from '../models/User.js';

const authMiddleware = async (req, res, next) => {
  try {
      // Get the token from headers
      const token = req.header('Authorization').replace('Bearer ', '');
      if (!token) {
          return res.status(403).json({ message: 'No token provided' });
      }

      // Verify the token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');

      if (!req.user) {
          return res.status(401).json({ message: 'Unauthorized' });
      }

      // Call next middleware
      next();
  } catch (error) {
      res.status(401).json({ message: 'Invalid token' });
  }
};
export default authMiddleware;