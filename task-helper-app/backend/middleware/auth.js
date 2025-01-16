import jwt from 'jsonwebtoken';
import User from '../models/User';

module.exports = async (req, res, next) => {
  try {
    const token = req.header('Authorization').replace('Bearer ', '');
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      throw new Error();
    }
    
    req.user = user;
next();
} catch (error) {
  console.error('Authentication Error:', error); // Optionally log the error for debugging purposes
  res.status(401).json({
    message: 'Please authenticate',
    error: error.message || 'An error occurred during authentication', // Send the error message if available
  });
}
};