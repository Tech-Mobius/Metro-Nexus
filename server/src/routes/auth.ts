import { Router, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User } from '../models/User.js';
import { auth, AuthRequest } from '../middleware/auth.js';
import { authLimiter } from '../middleware/rateLimiter.js';

const router = Router();


function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}


router.post('/signup', authLimiter, async (req, res) => {
  const { username, email, password } = req.body;

  
  if (!username || typeof username !== 'string' || username.trim().length < 3) {
    return res.status(400).json({ error: 'Username must be at least 3 characters long.' });
  }
  if (!email || typeof email !== 'string' || !isValidEmail(email)) {
    return res.status(400).json({ error: 'Please provide a valid email address.' });
  }
  if (!password || typeof password !== 'string' || password.length < 6) {
    return res.status(400).json({ error: 'Password must be at least 6 characters long.' });
  }

  try {
    
    const existingUser = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
    });
    if (existingUser) {
      return res.status(400).json({ error: 'Username or Email is already registered.' });
    }

    
    const user = new User({
      username: username.trim(),
      email: email.toLowerCase(),
      password,
    });
    await user.save();

    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT Secret is not configured.' });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

    return res.status(201).json({
      message: 'Signup successful.',
      token,
      user,
    });
  } catch (error) {
    console.error('Signup error:', error);
    return res.status(500).json({ error: 'An error occurred during signup.' });
  }
});


router.post('/login', authLimiter, async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: 'Please provide both email and password.' });
  }

  try {
    const user = await User.findOne({ email: email.toLowerCase() });
    if (!user) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    const isMatch = await (user as any).comparePassword(password);
    if (!isMatch) {
      return res.status(400).json({ error: 'Invalid email or password.' });
    }

    
    const secret = process.env.JWT_SECRET;
    if (!secret) {
      return res.status(500).json({ error: 'JWT Secret is not configured.' });
    }
    const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

    return res.status(200).json({
      message: 'Login successful.',
      token,
      user,
    });
  } catch (error) {
    console.error('Login error:', error);
    return res.status(500).json({ error: 'An error occurred during login.' });
  }
});


router.get('/me', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }
    return res.status(200).json(user);
  } catch (error) {
    console.error('Get profile error:', error);
    return res.status(500).json({ error: 'An error occurred fetching profile.' });
  }
});

export const authRouter = router;
export default authRouter;
