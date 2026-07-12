import mongoose from 'mongoose';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import bcrypt from 'bcryptjs';
import { User } from '../../server/src/models/User.ts';
import { Ticket } from '../../server/src/models/Ticket.ts';

type ApiEvent = {
  httpMethod?: string;
  body?: string | null;
  headers?: Record<string, string | undefined>;
  path?: string;
  rawUrl?: string;
};

type ApiResponse = {
  statusCode: number;
  headers: Record<string, string>;
  body: string;
};

let connectionPromise: Promise<typeof mongoose> | null = null;

function json(statusCode: number, payload: unknown): ApiResponse {
  return {
    statusCode,
    headers: {
      'Content-Type': 'application/json',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Methods': 'GET,POST,OPTIONS',
    },
    body: JSON.stringify(payload),
  };
}

async function connectDB() {
  if (mongoose.connection.readyState === 1) {
    return mongoose;
  }

  if (!connectionPromise) {
    const uri = process.env.MONGODB_URI;
    if (!uri) {
      throw new Error('MONGODB_URI is not configured.');
    }
    connectionPromise = mongoose.connect(uri);
  }

  return connectionPromise;
}

function getPath(event: ApiEvent) {
  const rawUrl = event.rawUrl || `https://example.com${event.path || '/'}`;
  const path = new URL(rawUrl).pathname;
  return path
    .replace(/^\/\.netlify\/functions\/api/, '')
    .replace(/^\/api/, '')
    .replace(/\/+$/, '') || '/';
}

function parseBody(event: ApiEvent) {
  if (!event.body) {
    return {};
  }

  try {
    return JSON.parse(event.body);
  } catch {
    return null;
  }
}

function isValidEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function getToken(event: ApiEvent) {
  const authHeader = event.headers?.authorization || event.headers?.Authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return null;
  }

  return authHeader.split(' ')[1] || null;
}

function calculatePrice(from: string, to: string): number {
  if (from === to) return 0;
  const diff = Math.abs(from.length - to.length);
  return 10 + (diff % 5) * 5;
}

async function getAuthenticatedUserId(event: ApiEvent) {
  const token = getToken(event);
  if (!token) {
    return null;
  }

  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error('JWT_SECRET is not configured.');
  }

  const decoded = jwt.verify(token, secret) as { id?: string };
  return decoded.id || null;
}

export async function handler(event: ApiEvent): Promise<ApiResponse> {
  if ((event.httpMethod || 'GET') === 'OPTIONS') {
    return json(204, {});
  }

  const path = getPath(event);
  const method = (event.httpMethod || 'GET').toUpperCase();
  const body = parseBody(event);

  try {
    await connectDB();
  } catch (error) {
    console.error('Database connection error:', error);
    return json(500, { error: 'Database connection failed.' });
  }

  if (path === '/' && method === 'GET') {
    return json(200, {
      name: 'Metro Nexus Secure API',
      status: 'healthy',
      version: '1.0.0',
    });
  }

  if (path === '/auth/signup' && method === 'POST') {
    const { username, email, password } = body || {};

    if (!username || typeof username !== 'string' || username.trim().length < 3) {
      return json(400, { error: 'Username must be at least 3 characters long.' });
    }
    if (!email || typeof email !== 'string' || !isValidEmail(email)) {
      return json(400, { error: 'Please provide a valid email address.' });
    }
    if (!password || typeof password !== 'string' || password.length < 6) {
      return json(400, { error: 'Password must be at least 6 characters long.' });
    }

    try {
      const existingUser = await User.findOne({
        $or: [{ email: email.toLowerCase() }, { username: username.trim() }],
      });

      if (existingUser) {
        return json(400, { error: 'Username or Email is already registered.' });
      }

      const user = new User({
        username: username.trim(),
        email: email.toLowerCase(),
        password,
      });
      await user.save();

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return json(500, { error: 'JWT Secret is not configured.' });
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

      return json(201, {
        message: 'Signup successful.',
        token,
        user,
      });
    } catch (error) {
      console.error('Signup error:', error);
      return json(500, { error: 'An error occurred during signup.' });
    }
  }

  if (path === '/auth/login' && method === 'POST') {
    const { email, password } = body || {};

    if (!email || !password) {
      return json(400, { error: 'Please provide both email and password.' });
    }

    try {
      const user = await User.findOne({ email: String(email).toLowerCase() });
      if (!user) {
        return json(400, { error: 'Invalid email or password.' });
      }

      const isMatch = await bcrypt.compare(String(password), (user as any).password);
      if (!isMatch) {
        return json(400, { error: 'Invalid email or password.' });
      }

      const secret = process.env.JWT_SECRET;
      if (!secret) {
        return json(500, { error: 'JWT Secret is not configured.' });
      }

      const token = jwt.sign({ id: user._id }, secret, { expiresIn: '7d' });

      return json(200, {
        message: 'Login successful.',
        token,
        user,
      });
    } catch (error) {
      console.error('Login error:', error);
      return json(500, { error: 'An error occurred during login.' });
    }
  }

  if (path === '/auth/me' && method === 'GET') {
    try {
      const userId = await getAuthenticatedUserId(event);
      if (!userId) {
        return json(401, { error: 'Not authenticated.' });
      }

      const user = await User.findById(userId);
      if (!user) {
        return json(404, { error: 'User not found.' });
      }

      return json(200, user);
    } catch (error) {
      console.error('Get profile error:', error);
      return json(500, { error: 'An error occurred fetching profile.' });
    }
  }

  if (path === '/tickets' && method === 'GET') {
    try {
      const userId = await getAuthenticatedUserId(event);
      if (!userId) {
        return json(401, { error: 'Not authenticated.' });
      }

      const tickets = await Ticket.find({ userId }).sort({ purchaseDate: -1 });
      return json(200, tickets);
    } catch (error) {
      console.error('Get tickets error:', error);
      return json(500, { error: 'An error occurred fetching tickets.' });
    }
  }

  if (path === '/tickets/purchase' && method === 'POST') {
    const { fromStation, toStation } = body || {};

    if (!fromStation || !toStation) {
      return json(400, { error: 'Please provide both starting and destination stations.' });
    }

    try {
      const userId = await getAuthenticatedUserId(event);
      if (!userId) {
        return json(401, { error: 'Not authenticated.' });
      }

      const user = await User.findById(userId) as any;
      if (!user) {
        return json(404, { error: 'User not found.' });
      }

      const price = calculatePrice(String(fromStation), String(toStation));
      if (price > user.walletBalance) {
        return json(400, {
          error: `Insufficient funds. Ticket costs ${price} Credits, but you only have ${user.walletBalance} Credits.`,
        });
      }

      user.walletBalance -= price;
      await user.save();

      const verificationCode = 'MN-' + crypto.randomBytes(4).toString('hex').toUpperCase();

      const ticket = new Ticket({
        userId: user._id,
        fromStation,
        toStation,
        price,
        status: 'active',
        verificationCode,
      });
      await ticket.save();

      return json(201, {
        message: 'Ticket purchased successfully.',
        ticket,
        walletBalance: user.walletBalance,
      });
    } catch (error) {
      console.error('Purchase ticket error:', error);
      return json(500, { error: 'An error occurred during ticket purchase.' });
    }
  }

  const useTicketMatch = path.match(/^\/tickets\/([^/]+)\/use$/);
  if (useTicketMatch && method === 'POST') {
    try {
      const userId = await getAuthenticatedUserId(event);
      if (!userId) {
        return json(401, { error: 'Not authenticated.' });
      }

      const ticket = await Ticket.findOne({ _id: useTicketMatch[1], userId });
      if (!ticket) {
        return json(404, { error: 'Ticket not found or access denied.' });
      }

      if (ticket.status !== 'active') {
        return json(400, { error: `Ticket cannot be used. It is already ${ticket.status}.` });
      }

      ticket.status = 'used';
      await ticket.save();

      return json(200, {
        message: 'Ticket successfully boarded.',
        ticket,
      });
    } catch (error) {
      console.error('Use ticket error:', error);
      return json(500, { error: 'An error occurred while using the ticket.' });
    }
  }

  return json(404, { error: 'Endpoint not found.' });
}