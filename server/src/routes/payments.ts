import { Router, Response } from 'express';
import Razorpay from 'razorpay';
import crypto from 'crypto';
import { User } from '../models/User.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = Router();

// Create Razorpay instance helper
const getRazorpayInstance = () => {
  const keyId = process.env.RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret || keyId.includes('here') || keySecret.includes('here') || keyId.trim() === '' || keySecret.trim() === '') {
    return null; // Run in Demo mode
  }
  
  try {
    return new Razorpay({
      key_id: keyId,
      key_secret: keySecret,
    });
  } catch (err) {
    console.error('Error initializing Razorpay:', err);
    return null;
  }
};

// Create Order endpoint
router.post('/order', auth, async (req: AuthRequest, res: Response) => {
  const { amount } = req.body; // amount in INR (e.g. 100 for 100 credits)

  if (!amount || typeof amount !== 'number' || amount <= 0) {
    return res.status(400).json({ error: 'Please provide a valid payment amount.' });
  }

  try {
    const razorpay = getRazorpayInstance();
    
    if (!razorpay) {
      // Demo Mode: Generate a mock order ID
      const mockOrderId = 'order_mock_' + crypto.randomBytes(8).toString('hex');
      return res.status(200).json({
        isDemo: true,
        orderId: mockOrderId,
        amount: amount * 100, // paise
        currency: 'INR',
        keyId: 'rzp_test_demo_key_id',
      });
    }

    // Real Mode: Create an actual order using the SDK
    const order = await razorpay.orders.create({
      amount: amount * 100, // amount in paise
      currency: 'INR',
      receipt: `receipt_${crypto.randomBytes(6).toString('hex')}`,
    });

    return res.status(200).json({
      isDemo: false,
      orderId: order.id,
      amount: order.amount,
      currency: order.currency,
      keyId: process.env.RAZORPAY_KEY_ID,
    });
  } catch (error) {
    console.error('Create order error:', error);
    return res.status(500).json({ error: 'Failed to create payment order.' });
  }
});

// Verify Payment endpoint
router.post('/verify', auth, async (req: AuthRequest, res: Response) => {
  const { razorpay_payment_id, razorpay_order_id, razorpay_signature, amount, isDemo } = req.body;

  if (!req.user) {
    return res.status(401).json({ error: 'Not authenticated.' });
  }

  try {
    const user = await User.findById(req.user.id);
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    if (isDemo) {
      // Demo Mode: Bypasses cryptographic verification and credits wallet directly
      user.walletBalance = (user.walletBalance || 0) + Number(amount);
      await user.save();

      return res.status(200).json({
        message: 'Payment simulation successful. Credits added.',
        walletBalance: user.walletBalance,
      });
    }

    const razorpay = getRazorpayInstance();
    if (!razorpay) {
      return res.status(400).json({ error: 'Server key credentials are not configured.' });
    }

    // Verify signature
    const hmac = crypto.createHmac('sha256', process.env.RAZORPAY_KEY_SECRET!);
    hmac.update(`${razorpay_order_id}|${razorpay_payment_id}`);
    const generated_signature = hmac.digest('hex');

    if (generated_signature !== razorpay_signature) {
      return res.status(400).json({ error: 'Invalid payment signature. Transaction verification failed.' });
    }

    // Success! Credit the wallet
    user.walletBalance = (user.walletBalance || 0) + Number(amount);
    await user.save();

    return res.status(200).json({
      message: 'Payment verified successfully. Credits added.',
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error('Verify payment error:', error);
    return res.status(500).json({ error: 'An error occurred during payment verification.' });
  }
});

export const paymentsRouter = router;
export default paymentsRouter;
