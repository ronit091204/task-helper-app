import User from '../models/User';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

exports.register = async (req, res) => {
  try {
    const { username, email, password, role, location } = req.body;
    const user = new User({
      username,
      email,
      password,
      role,
      location: {
        type: 'Point',
        coordinates: location
      }
    });
    await user.save();
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.status(201).json({ token, user: { id: user._id, username, email, role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

exports.login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);
    res.json({ token, user: { id: user._id, username: user.username, email, role: user.role } });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
