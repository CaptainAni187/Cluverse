import { Router } from 'express';
import bcrypt from 'bcryptjs';
import { auth } from '../middleware/auth.js';
import User from '../models/User.js';
import Registration from '../models/Registration.js';

const router = Router();

/* GET: Profile + registrations */
router.get('/', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).lean();
    if (!user) return res.status(404).json({ msg: 'User not found' });

    // Get registrations for event list
    const regs = await Registration.find({ user: user._id }).populate('event');
    res.json({
      ...user,
      registrations: regs.map(r => ({
        _id: r._id,
        event: r.event,
        checkedIn: r.checkedIn,
        qr: r.qr,
      })),
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch profile', error: err.message });
  }
});

/* PUT: Update profile (phone, bio, profilePic) */
router.put('/', auth, async (req, res) => {
  try {
    const { phone, bio, profilePic } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user.id,
      { phone, bio, profilePic },
      { new: true }
    );
    if (!user) return res.status(404).json({ msg: 'User not found' });
    res.json(user);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to update profile', error: err.message });
  }
});

/* PUT: Change password */
router.put('/password', auth, async (req, res) => {
  try {
    const { oldPassword, newPassword } = req.body;
    if (!oldPassword || !newPassword)
      return res.status(400).json({ msg: 'Both old and new password required' });

    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ msg: 'User not found' });
    if (!user.passwordHash || !(await bcrypt.compare(oldPassword, user.passwordHash)))
      return res.status(400).json({ msg: 'Incorrect old password' });

    user.passwordHash = await bcrypt.hash(newPassword, 12);
    await user.save();
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to change password', error: err.message });
  }
});

export default router;
