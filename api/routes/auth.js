import { Router } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import passport from 'passport';
import { sendOtp } from '../utils/mailer.js';
import User from '../models/User.js';
import Otp from '../models/Otp.js';

const router = Router();

const STUDENT_MAIL = /^[\w.+-]+@learner\.manipal\.edu$/i;
const OTP_TTL = 10 * 60 * 1_000; // 10 min in ms
const DEV_SKIP_OTP = process.env.DEV_SKIP_OTP === 'true';

/* ───────── 1 │ request OTP ───────── */
router.post('/request-otp', async (req, res) => {
  const { email = '', role } = req.body;
  const mail = email.trim();

  if (role === 'student' && !STUDENT_MAIL.test(mail))
    return res.status(400).json({ msg: 'student email must be @learner.manipal.edu' });

  const code = Math.floor(100_000 + Math.random() * 900_000).toString();
  const hash = await bcrypt.hash(code, 10);

  await Otp.deleteMany({ email: mail });
  await Otp.create({ email: mail, codeHash: hash, expiresAt: Date.now() + OTP_TTL });

  if (!DEV_SKIP_OTP) {
    await sendOtp(mail, code);
  }
  res.json({ ok: true, dev: DEV_SKIP_OTP ? 'OTP skipped in dev mode' : undefined });
});

/* ───────── 2 │ sign-up ───────── */
router.post('/signup', async (req, res) => {
  const { email = '', otp, password = '', role } = req.body;
  const mail = email.trim();

  // Prevent duplicate users
  if (await User.findOne({ email: mail }))
    return res.status(409).json({ msg: 'User already exists' });

  // DEV: skip OTP check if enabled
  if (!DEV_SKIP_OTP) {
    const row = await Otp.findOne({ email: mail });
    if (!row)                         return res.status(400).json({ msg: 'OTP not requested' });
    if (row.expiresAt < Date.now())   return res.status(400).json({ msg: 'OTP expired' });
    if (!(await bcrypt.compare(otp, row.codeHash)))
      return res.status(400).json({ msg: 'OTP wrong' });
  }

  // derive student extras
  const extras = {};
  if (role === 'student') {
    const y = mail.match(/(\d{4})@learner\.manipal\.edu$/i)?.[1];
    if (y) {
      const join   = Number(y);
      const now    = new Date();
      const acadYr = now.getFullYear() + (now.getMonth() >= 6 ? 1 : 0);
      extras.yearOfJoin  = join;
      extras.yearOfStudy = Math.max(1, acadYr - join);
    }
  }

  if (password.length < 8)
    return res.status(400).json({ msg: 'password too short (min 8 chars)' });

  const passHash = await bcrypt.hash(password, 12);
  await User.create({
    ...req.body,
    ...extras,
    email: mail,
    passwordHash: passHash,
    approved: role !== 'admin' // Only students auto-approved
  });

  await Otp.deleteMany({ email: mail });
  res.status(201).json({ ok: true });
});

/* ───────── 3 │ login ───────── */
router.post('/login', async (req, res) => {
  const { email = '', password = '' } = req.body;
  const user = await User.findOne({ email: email.trim() });

  if (!user || !(await bcrypt.compare(password, user.passwordHash)))
    return res.status(401).json({ msg: 'Wrong email or password' });

  if (user.role === 'admin' && !user.approved)
    return res.status(403).json({ msg: 'waiting admin approval' });

  const token = jwt.sign(
    { id: user._id, role: user.role, name: user.name },
    process.env.JWT_SECRET,
    { expiresIn: '7d' }
  );

  res.json({ token });
});

/* ───────── 4 │ Google OAuth (Passport) ───────── */
router.get('/google',
  passport.authenticate('google', { scope: ['profile', 'email'] })
);

router.get('/google/callback',
  passport.authenticate('google', { failureRedirect: '/login', session: false }),
  (req, res) => {
    const token = jwt.sign(
      { id: req.user.id, email: req.user.email, role: req.user.role },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    );
    res.redirect(`http://localhost:5173/social-success?token=${token}`);
  }
);

export default router;
