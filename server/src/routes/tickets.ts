import { Router, Response } from 'express';
import crypto from 'crypto';
import { Ticket } from '../models/Ticket.js';
import { User } from '../models/User.js';
import { auth, AuthRequest } from '../middleware/auth.js';

const router = Router();


function calculatePrice(from: string, to: string): number {
  if (from === to) return 0;
  
  const diff = Math.abs(from.length - to.length);
  return 10 + (diff % 5) * 5;
}


router.post('/purchase', auth, async (req: AuthRequest, res: Response) => {
  const { fromStation, toStation } = req.body;

  if (!fromStation || !toStation) {
    return res.status(400).json({ error: 'Please provide both starting and destination stations.' });
  }

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const user = await User.findById(req.user.id) as any;
    if (!user) {
      return res.status(404).json({ error: 'User not found.' });
    }

    const price = calculatePrice(fromStation, toStation);
    if (price > user.walletBalance) {
      return res.status(400).json({
        error: `Insufficient funds. Ticket costs ${price} Credits, but you only have ${user.walletBalance} Credits.`,
      });
    }

    // Deduct balance
    user.walletBalance -= price;
    await user.save();

    // Generate secure ticket verification code
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

    return res.status(201).json({
      message: 'Ticket purchased successfully.',
      ticket,
      walletBalance: user.walletBalance,
    });
  } catch (error) {
    console.error('Purchase ticket error:', error);
    return res.status(500).json({ error: 'An error occurred during ticket purchase.' });
  }
});

// Get user tickets
router.get('/', auth, async (req: AuthRequest, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const tickets = await Ticket.find({ userId: req.user.id }).sort({ purchaseDate: -1 });
    return res.status(200).json(tickets);
  } catch (error) {
    console.error('Get tickets error:', error);
    return res.status(500).json({ error: 'An error occurred fetching tickets.' });
  }
});

// Use a ticket
router.post('/:id/use', auth, async (req: AuthRequest, res: Response) => {
  const { id } = req.params;

  try {
    if (!req.user) {
      return res.status(401).json({ error: 'Not authenticated.' });
    }

    const ticket = await Ticket.findOne({ _id: id, userId: req.user.id });
    if (!ticket) {
      return res.status(404).json({ error: 'Ticket not found or access denied.' });
    }

    if (ticket.status !== 'active') {
      return res.status(400).json({ error: `Ticket cannot be used. It is already ${ticket.status}.` });
    }

    ticket.status = 'used';
    await ticket.save();

    return res.status(200).json({
      message: 'Ticket successfully boarded.',
      ticket,
    });
  } catch (error) {
    console.error('Use ticket error:', error);
    return res.status(500).json({ error: 'An error occurred while using the ticket.' });
  }
});

export const ticketsRouter = router;
export default ticketsRouter;
