const supabase = require('../config/supabaseClient');

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const token = authHeader.split(' ')[1];

    // Validate the JWT access token with Supabase Auth.
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    req.user = user;
    req.accessToken = token;
    next();
  } catch (err) {
    return res.status(500).json({ error: 'Failed to authenticate user', details: err.message });
  }
};

module.exports = authMiddleware;
