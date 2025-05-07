import asyncHandler from 'express-async-handler';
import authMiddleware from './authMiddleware.js';

const adminMiddleware = asyncHandler(async (req, res, next) => {
  await authMiddleware(req, res, async () => {
    if (req.user && req.user.isAdmin) {
      next();
    } else {
      res.status(403).json({ message: 'Admin access required' });
    }
  });
});

export default adminMiddleware;
