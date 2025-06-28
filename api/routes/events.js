import { Router } from 'express';
import Event from '../models/Event.js';
import { admin, boss } from '../middleware/auth.js';

const router = Router();

/*
 * List events with optional filters: status, tags, admin, search, pagination
 * - For public/student views: only show approved events unless admin filter is present
 * - For admin: show all their events (any status)
 */
router.get('/', async (req, res) => {
  try {
    const { status, tag, tags, search, admin: adminId, page, limit } = req.query;
    const filter = {};

    // Only show approved events to public/students unless admin filter is present
    if (adminId) {
      filter.admin = adminId;
      if (status) filter.status = status;
    } else {
      filter.status = 'approved';
    }

    // Tags filter
    if (tags) {
      const tagsArray = Array.isArray(tags) ? tags : tags.split(',');
      filter.tags = { $all: tagsArray };
    } else if (tag) {
      filter.tags = tag;
    }

    if (search) filter.title = new RegExp(search, 'i');

    // Pagination support
    if (page && limit) {
      const skip = (parseInt(page) - 1) * parseInt(limit);
      const events = await Event.find(filter)
        .sort({ dateTime: 1 })
        .skip(skip)
        .limit(parseInt(limit));
      const total = await Event.countDocuments(filter);
      return res.json({
        events,
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total,
          pages: Math.ceil(total / limit),
        },
      });
    } else {
      const events = await Event.find(filter).sort({ dateTime: 1 });
      return res.json(events);
    }
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch events', error: err.message });
  }
});

/*
 * Get single event by id
 * - Allow access if event is approved, or if requester is the event's admin or boss
 */
router.get('/:id', async (req, res) => {
  try {
    const e = await Event.findById(req.params.id);
    if (!e) return res.status(404).json({ msg: 'Event not found' });
    // Optionally, add logic to restrict access to unapproved events
    res.json(e);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch event', error: err.message });
  }
});

/*
 * Create event request (admin only, always pending approval)
 */
router.post('/', admin, async (req, res) => {
  try {
    if (!req.body.title || !req.body.category || !req.body.dateTime) {
      return res.status(400).json({ msg: 'Title, category, and date/time are required' });
    }
    const ev = await Event.create({
      ...req.body,
      status: 'pending_approval',
      createdBy: req.user.id,
      admin: req.user.id,
    });
    res.status(201).json(ev);
  } catch (err) {
    res.status(400).json({ msg: 'Failed to create event', error: err.message });
  }
});

/*
 * Update event (admin only, for resubmission after rejection)
 */
router.put('/:id', admin, async (req, res) => {
  try {
    const updated = await Event.findByIdAndUpdate(
      req.params.id,
      { ...req.body, status: 'pending_approval' }, // set back to pending on resubmission
      { new: true, runValidators: true }
    );
    if (!updated) return res.status(404).json({ msg: 'Event not found' });
    res.json(updated);
  } catch (err) {
    res.status(400).json({ msg: 'Failed to update event', error: err.message });
  }
});

/*
 * List pending event requests for CWO (boss only)
 */
router.get('/pending-requests/all', boss, async (req, res) => {
  try {
    const pending = await Event.find({ status: 'pending_approval' }).sort({ dateTime: 1 });
    res.json(pending);
  } catch (err) {
    res.status(500).json({ msg: 'Failed to fetch pending events', error: err.message });
  }
});

/*
 * CWO: Approve, reject, or request changes for an event
 */
router.post('/action/:id', boss, async (req, res) => {
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

export default router;
