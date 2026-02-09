const express = require('express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcryptjs');
const cors = require('cors');

const app = express();
app.use(express.json());
app.use(cors());

const JWT_SECRET = process.env.JWT_SECRET || 'pillarvale-secret-key-2024';
const users = []; // In production, use PostgreSQL

// Register endpoint
app.post('/api/auth/register', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    users.push({ email, password: hashedPassword });
    
    res.json({ message: 'User registered successfully', email });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login endpoint
app.post('/api/auth/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password required' });
    }
    
    const user = users.find(u => u.email === email);
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: '24h' });
    res.json({ 
      message: 'Login successful',
      token,
      user: { email }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

// Verify token endpoint
app.post('/api/auth/verify', (req, res) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.json({ valid: false, error: 'No token provided' });
    }
    
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ valid: true, user: decoded });
  } catch (error) {
    res.json({ valid: false, error: 'Invalid token' });
  }
});

// Public health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'running', 
    service: 'auth-service',
    timestamp: new Date().toISOString()
  });
});

// Protected test endpoint
app.get('/api/protected', (req, res) => {
  const token = req.headers.authorization?.split(' ')[1];
  
  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    res.json({ 
      message: 'Access granted',
      user: decoded,
      data: 'This is protected data'
    });
  } catch (error) {
    res.status(401).json({ error: 'Access denied' });
  }
});

const PORT = process.env.PORT || 3006;
app.listen(PORT, () => {
  console.log(`✅ Auth service running on port ${PORT}`);
});
