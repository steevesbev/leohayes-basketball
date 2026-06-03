const jwt = require('jsonwebtoken');
const { getDB } = require('../db');

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization'];
  const token = authHeader && authHeader.split(' ')[1];

  if (!token) return res.status(401).json({ error: 'Access token required' });

  jwt.verify(token, process.env.JWT_SECRET || 'leohayes-secret-change-me', (err, user) => {
    if (err) return res.status(403).json({ error: 'Invalid or expired token' });

    // Verify user still active
    const db = getDB();
    const dbUser = db.prepare('SELECT id, role, active FROM users WHERE id = ?').get(user.id);
    if (!dbUser || !dbUser.active) {
      return res.status(403).json({ error: 'Account disabled' });
    }

    req.user = { ...user, role: dbUser.role };
    next();
  });
}

function requireAdmin(req, res, next) {
  if (req.user?.role !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
}

module.exports = { authenticateToken, requireAdmin };
