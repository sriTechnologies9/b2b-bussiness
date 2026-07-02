import { Router, Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { JWT_SECRET, authenticateToken, AuthenticatedRequest } from '../middleware/auth';

const router = Router();
const prisma = new PrismaClient();

// Helper to generate JWT
function generateToken(user: { id: string; email: string; role: string; name: string }) {
  return jwt.sign(
    { id: user.id, email: user.email, role: user.role, name: user.name },
    JWT_SECRET,
    { expiresIn: '7d' }
  );
}

// POST /api/auth/register
router.post('/register', async (req: Request, res: Response) => {
  try {
    const { name, email, phone, password, role } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email and password are required' });
    }

    const existingUser = await prisma.user.findUnique({
      where: { email }
    });

    if (existingUser) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    const targetRole = role || 'CUSTOMER';
    if ((targetRole === 'OWNER' || targetRole === 'ADMIN') && !email.toLowerCase().endsWith('@compaanynamedelaerss.com')) {
      return res.status(400).json({ error: 'Access Denied: Dealer/Admin registrations require a valid @compaanynamedelaerss.com email address.' });
    }

    if (targetRole === 'ADMIN') {
      const adminCount = await prisma.user.count({ where: { role: 'ADMIN' } });
      if (adminCount >= 2) {
        return res.status(400).json({ error: 'Registration Denied: System limit of 2 Admin profiles has been reached.' });
      }
    }

    // Create user and a default subscription
    const user = await prisma.user.create({
      data: {
        name,
        email,
        phone: phone || '',
        password: await bcrypt.hash(password, 10),
        role: targetRole
      }
    });

    // Subscriptions defaults to FREE
    await prisma.subscription.create({
      data: {
        userId: user.id,
        plan: 'FREE',
        expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000) // 1 year free
      }
    });

    const token = generateToken(user);

    return res.status(201).json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Registration failed: ' + error.message });
  }
});

// POST /api/auth/login
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const user = await prisma.user.findUnique({
      where: { email },
      include: { subscription: true }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: 'Invalid email or password' });
    }

    const token = generateToken(user);

    return res.json({
      token,
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        subscription: user.subscription
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Login failed: ' + error.message });
  }
});

// GET /api/auth/me
router.get('/me', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const user = await prisma.user.findUnique({
      where: { id: req.user.id },
      include: {
        subscription: true,
        businesses: {
          select: {
            id: true,
            name: true,
            slug: true,
            status: true
          }
        }
      }
    });

    if (!user) {
      return res.status(404).json({ error: 'User not found' });
    }

    return res.json({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
        phone: user.phone,
        subscription: user.subscription,
        businesses: user.businesses
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to fetch profile: ' + error.message });
  }
});

// PUT /api/auth/profile - Update user profile (name, email, phone)
router.put('/profile', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { name, email, phone } = req.body;

    // Check if email is being changed and if it's already taken
    if (email && email !== req.user.email) {
      if ((req.user.role === 'OWNER' || req.user.role === 'ADMIN') && !email.toLowerCase().endsWith('@compaanynamedelaerss.com')) {
        return res.status(400).json({ error: 'Access Denied: Dealer/Admin accounts require a @compaanynamedelaerss.com email address.' });
      }

      const existing = await prisma.user.findUnique({ where: { email } });
      if (existing) {
        return res.status(400).json({ error: 'This email is already registered to another account' });
      }
    }

    const updated = await prisma.user.update({
      where: { id: req.user.id },
      data: {
        ...(name !== undefined && { name }),
        ...(email !== undefined && { email }),
        ...(phone !== undefined && { phone })
      },
      include: {
        subscription: true,
        businesses: {
          select: { id: true, name: true, slug: true, status: true }
        }
      }
    });

    // Generate a new token with updated info
    const newToken = generateToken(updated);

    return res.json({
      success: true,
      token: newToken,
      user: {
        id: updated.id,
        name: updated.name,
        email: updated.email,
        role: updated.role,
        phone: updated.phone,
        subscription: updated.subscription,
        businesses: updated.businesses
      }
    });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to update profile: ' + error.message });
  }
});

// PUT /api/auth/password - Change password
router.put('/password', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const { currentPassword, newPassword } = req.body;

    if (!currentPassword || !newPassword) {
      return res.status(400).json({ error: 'Current password and new password are required' });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({ error: 'New password must be at least 6 characters' });
    }

    // Verify current password
    const user = await prisma.user.findUnique({ where: { id: req.user.id } });
    if (!user || !(await bcrypt.compare(currentPassword, user.password))) {
      return res.status(400).json({ error: 'Current password is incorrect' });
    }

    await prisma.user.update({
      where: { id: req.user.id },
      data: { password: await bcrypt.hash(newPassword, 10) }
    });

    return res.json({ success: true, message: 'Password changed successfully' });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to change password: ' + error.message });
  }
});

// POST /api/auth/verify-otp (OTP Sim)
router.post('/verify-otp', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { type, value, code } = req.body; // type: 'email' | 'phone', value: target address, code: otp code
  if (!code || code !== '123456') {
    return res.status(400).json({ success: false, error: 'Invalid verification code' });
  }
  return res.json({ success: true, message: `${type} verified successfully!` });
});

// POST /api/auth/verify-gst (GST verification mock)
router.post('/verify-gst', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  const { gstNumber } = req.body;
  if (!gstNumber || gstNumber.length !== 15) {
    return res.status(400).json({ success: false, error: 'Invalid GST format (15 characters required)' });
  }
  return res.json({
    success: true,
    businessName: 'Mock Certified Company Ltd.',
    address: '123 Tech Park, Phase 2, Hitech City, Hyderabad',
    status: 'ACTIVE'
  });
});

// POST /api/auth/become-dealer - Submit a dealer request
router.post('/become-dealer', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });
    if (req.user.role !== 'CUSTOMER') {
      return res.status(400).json({ error: 'Only regular customers can apply to become dealers.' });
    }

    const { businessName, categoryName, contactEmail, contactPhone } = req.body;

    if (!businessName || !categoryName || !contactEmail || !contactPhone) {
      return res.status(400).json({ error: 'All fields are required.' });
    }

    // Check if there's an active request (PENDING or APPROVED)
    const existingRequest = await prisma.dealerRequest.findFirst({
      where: {
        userId: req.user.id,
        status: { in: ['PENDING', 'APPROVED'] }
      }
    });

    if (existingRequest) {
      return res.status(400).json({ error: 'You already have an active or approved dealer request.' });
    }

    const newRequest = await prisma.dealerRequest.create({
      data: {
        userId: req.user.id,
        businessName,
        categoryName,
        contactEmail,
        contactPhone,
        status: 'PENDING'
      }
    });

    return res.status(201).json({ success: true, request: newRequest });
  } catch (error: any) {
    console.error(error);
    return res.status(500).json({ error: 'Failed to submit dealer request: ' + error.message });
  }
});

// GET /api/auth/dealer-request - Get customer's active dealer request
router.get('/dealer-request', authenticateToken, async (req: AuthenticatedRequest, res: Response) => {
  try {
    if (!req.user) return res.status(401).json({ error: 'Not authenticated' });

    const dealerRequest = await prisma.dealerRequest.findFirst({
      where: { userId: req.user.id },
      orderBy: { createdAt: 'desc' }
    });

    return res.json({ success: true, request: dealerRequest });
  } catch (error: any) {
    console.error(error);
    return res.json({ success: false, error: 'Failed to fetch dealer request: ' + error.message });
  }
});

export default router;
