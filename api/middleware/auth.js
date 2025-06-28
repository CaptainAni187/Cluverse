import jwt from 'jsonwebtoken';

/**
 * Authenticate user by JWT in Authorization header or cookie.
 * Sets req.user if valid.
 */
export const auth = (req, res, next) => {
  // Support Bearer token or token cookie (for SSR or future use)
  let token = null;
  const header = req.headers.authorization;
  if (header && header.startsWith('Bearer ')) {
    token = header.split(' ')[1];
  } else if (req.cookies && req.cookies.token) {
    token = req.cookies.token;
  }
  if (!token) return res.status(401).json({ msg: 'No token, authorization denied' });

  jwt.verify(token, process.env.JWT_SECRET, (err, payload) => {
    if (err) return res.status(403).json({ msg: 'Invalid or expired token' });
    req.user = payload;
    next();
  });
};

/**
 * Restrict route to admins (and bosses).
 */
export const admin = [auth, (req, res, next) => {
  if (req.user.role !== 'admin' && req.user.role !== 'boss')
    return res.status(403).json({ msg: 'Admin access required' });
  next();
}];

/**
 * Restrict route to bosses only.
 */
export const boss = [auth, (req, res, next) => {
  if (req.user.role !== 'boss')
    return res.status(403).json({ msg: 'Boss access required' });
  next();
}];

/**
 * Restrict route to students only.
 */
export const student = [auth, (req, res, next) => {
  if (req.user.role !== 'student')
    return res.status(403).json({ msg: 'Student access required' });
  next();
}];

/**
 * Restrict route to a specific role (string or array).
 * Usage: app.get('/some', requireRole('boss'), handler)
 */
export const requireRole = (roles) => [
  auth,
  (req, res, next) => {
    const allowed = Array.isArray(roles) ? roles : [roles];
    if (!allowed.includes(req.user.role))
      return res.status(403).json({ msg: `Requires role: ${allowed.join(', ')}` });
    next();
  }
];
