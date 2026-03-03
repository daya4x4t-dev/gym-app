const supabase = require('../config/supabaseClient');

const isValidEmail = (email) => typeof email === 'string' && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

const signup = async (req, res) => {
  try {
    const { email, password, name } = req.body;

    if (!isValidEmail(email) || !password || password.length < 6 || !name) {
      return res.status(400).json({ error: 'Valid email, name and password (min 6 chars) are required' });
    }

    const { data, error } = await supabase.auth.signUp({ email, password });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data.user) {
      const { error: profileError } = await supabase.from('users').insert({
        id: data.user.id,
        email,
        name,
      });

      if (profileError) {
        return res.status(400).json({
          error: 'User created in auth but profile creation failed',
          details: profileError.message,
        });
      }
    }

    return res.status(201).json({ message: 'Signup successful', data });
  } catch (err) {
    return res.status(500).json({ error: 'Signup failed', details: err.message });
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({ error: 'Valid email and password are required' });
    }

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      return res.status(401).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Login successful', data });
  } catch (err) {
    return res.status(500).json({ error: 'Login failed', details: err.message });
  }
};

const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({ error: 'A valid email is required' });
    }

    const { error } = await supabase.auth.resetPasswordForEmail(email);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Password reset email sent' });
  } catch (err) {
    return res.status(500).json({ error: 'Forgot password request failed', details: err.message });
  }
};

const resetPassword = async (req, res) => {
  try {
    const { newPassword } = req.body;
    const authHeader = req.headers.authorization;

    if (!newPassword || newPassword.length < 6) {
      return res.status(400).json({ error: 'newPassword with minimum 6 characters is required' });
    }

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization token is required' });
    }

    const accessToken = authHeader.split(' ')[1];

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser(accessToken);

    if (userError || !user) {
      return res.status(401).json({ error: 'Invalid or expired token' });
    }

    // Call Supabase Auth REST API directly with the user's access token to change password.
    const response = await fetch(`${process.env.SUPABASE_URL}/auth/v1/user`, {
      method: 'PUT',
      headers: {
        apikey: process.env.SUPABASE_ANON_KEY,
        Authorization: `Bearer ${accessToken}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ password: newPassword }),
    });

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: result.error_description || result.msg || 'Failed to update password',
      });
    }

    return res.status(200).json({ message: 'Password updated successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Reset password failed', details: err.message });
  }
};

const getProfile = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('id, email, name, created_at')
      .eq('id', req.user.id)
      .single();

    if (error) {
      return res.status(404).json({ error: 'Profile not found', details: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch profile', details: err.message });
  }
};

module.exports = {
  signup,
  login,
  forgotPassword,
  resetPassword,
  getProfile,
};
