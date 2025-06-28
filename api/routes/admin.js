import { Router } from 'express';
import { admin, boss } from '../middleware/auth.js';
import User from '../models/User.js';
import Event from '../models/Event.js';
import Registration from '../models/Registration.js';

const router = Router();

/* ───── boss: list un-approved club admins ───── */
router.get('/pending-clubs', boss, async (req, res) => {
  try {
    const pending = await User.find({ role: 'admin', approved: false });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching pending clubs', error: err.message });
  }
});

/* ───── boss: approve a club admin ───── */
router.post('/approve-user/:id', boss, async (req, res) => {
  try {
    const u = await User.findByIdAndUpdate(
      req.params.id,
      { approved: true },
      { new: true }
    );
    if (!u) return res.status(404).json({ msg: 'User not found' });
    res.json({ ok: true });
  } catch (err) {
    res.status(500).json({ msg: 'Error approving user', error: err.message });
  }
});

/* ───── boss: list all users (for AllUsersPage) ───── */
router.get('/users', boss, async (req, res) => {
  try {
    const users = await User.find().select('-passwordHash');
    res.json(users);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching users', error: err.message });
  }
});

/* ───── boss: list all pending event requests ───── */
router.get('/pending-events', boss, async (req, res) => {
  try {
    const pending = await Event.find({ status: 'pending_approval' }).sort({ dateTime: 1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching pending events', error: err.message });
  }
});

/* ───── boss: approve/reject/request changes for an event ───── */
router.post('/event-action/:id', boss, async (req, res) => {
  try {
    const { action, feedback } = req.body;
    const event = await Event.findById(req.params.id);
    if (!event) return res.status(404).json({ msg: 'Event not found' });

    if (action === 'approve') {
      event.status = 'approved';
      event.feedback = '';
    } else if (action === 'reject') {
      event.status = 'rejected';
      event.feedback = feedback || '';
    } else if (action === 'changes') {
      event.status = 'changes_requested';
      event.feedback = feedback || '';
    } else {
      return res.status(400).json({ msg: 'Invalid action' });
    }
    await event.save();
    res.json({ msg: 'Event updated', event });
  } catch (err) {
    res.status(400).json({ msg: 'Failed to update event', error: err.message });
  }
});

/* ───── boss/admin: quick stats ───── */
router.get('/stats', admin, async (req, res) => {
  try {
    const [events, regs, users, badges] = await Promise.all([
      Event.countDocuments(),
      Registration.countDocuments(),
      User.countDocuments(),
      User.aggregate([{ $unwind: "$badges" }, { $count: "count" }])
    ]);
    res.json({
      events,
      registrations: regs,
      users,
      badges: badges[0]?.count || 0
    });
  } catch (err) {
    res.status(500).json({ msg: 'Error fetching stats', error: err.message });
  }
});

export default router;
