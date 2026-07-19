import jwt from 'jsonwebtoken';
import User from '../models/user.js';

export const protect = async (req, res, next) => {
  let token;
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer')) {
    try {
      token = req.headers.authorization.split(' ')[1];
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      req.user = await User.findById(decoded.id).select('-password');
      if (!req.user) {
        return res.status(401).json({ message: 'Authorization Failed. User not found.' });
      }
      next();
    } catch (error) {
      return res.status(401).json({ message: 'Token is invalid or expired.' });
    }
  }
  if (!token) {
    return res.status(401).json({ message: 'Access Denied. Missing Token Bearer.' });
  }
};

export const adminOnly = (req, res, next) => {
  if (req.user && req.user.role === 'admin') {
    next();
  } else {
    res.status(403).json({ message: 'Forbidden. Access restricted exclusively to Administrators.' });
  }
};