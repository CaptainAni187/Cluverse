import { Router } from 'express';
import QRCode from 'qrcode';
import Registration from '../models/Registration.js';
import Event from '../models/Event.js';
import User from '../models/User.js';
import { auth, admin } from '../middleware/auth.js';

const router = Router();

/* Create/register for event (one per user per event) */
router.post('/:eventId', auth, async (req, res) => {
  try {
    const existing = await Registration.findOne({
      event: req.params.eventId,
      user: req.user.id
    });
    if (existing) return res.status(409).json({ msg: 'Already registered for this event' });

    const reg = await Registration.create({
      event: req.params.eventId,
      user: req.user.id,
      teamName: req.body.teamName || 'Solo',
      members: req.body.members || []
    });
    reg.qr = await QRCode.toDataURL(`REG:${reg._id}`);
    await reg.save();
    res.status(201).json(reg);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to register', error: err.message });
  }
});

/* List all registrations for an event (admin) */
router.get('/event/:eventId', admin, async (req, res) => {
  try {
    const regs = await Registration.find({ event: req.params.eventId })
      .populate('user', 'name email')
      .populate('event', 'title');
    res.json(regs);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch registrations', error: err.message });
  }
});

/* Fetch single registration (owner or admin) */
router.get('/:regId', auth, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.regId)
      .populate('event')
      .populate('user', 'name email');
    if (!reg) return res.status(404).json({ msg: 'Registration not found' });
    if (reg.user._id.toString() !== req.user.id && req.user.role !== 'admin')
      return res.status(403).json({ msg: 'Forbidden' });
    res.json(reg);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch registration', error: err.message });
  }
});

/* Student dashboard: list my registrations */
router.get('/mine', auth, async (req, res) => {
  try {
    const list = await Registration.find({ user: req.user.id }).populate('event');
    res.json(list);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch registrations', error: err.message });
  }
});

/* Door check-in (admin only) */
router.post('/checkin/:regId', admin, async (req, res) => {
  try {
    const reg = await Registration.findById(req.params.regId)
      .populate('event')
      .populate('user', 'name email');
    if (!reg) return res.status(404).json({ msg: 'Registration not found' });
    if (reg.checkedIn) return res.status(400).json({ msg: 'Already checked-in' });
    reg.checkedIn = true;
    await reg.save();
    res.json({
      checkedIn: true,
      event: reg.event,
      user: reg.user,
    });
  } catch (err) {
    res.status(500).json({ msg: 'Failed to check-in', error: err.message });
  }
});

export default router;
