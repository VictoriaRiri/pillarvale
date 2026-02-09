const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'pillarvale-secret-key-2024';

const authMiddleware = (req, res, next) => {
  // Skip auth for public routes
  const publicRoutes = ['/health', '/api/auth/login', '/api/auth/register', '/api/auth/verify'];
  if (publicRoutes.includes(req.path)) {
    return next();
  }

  const token = req.headers.authorization?.split(' ')[1];
  
  if (!token) {
    return res.status(401).json({ error: 'No token provided' });
  }
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(401).json({ error: 'Invalid token' });
  }
};

module.exports = authMiddleware;
