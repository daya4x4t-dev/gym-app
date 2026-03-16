const supabase = require('../config/supabaseClient');

const isValidEmail = (email) =>
  typeof email === 'string' &&
  /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

/*
================================
SIGNUP
POST /auth/signup
================================
*/
const signup = async (req, res) => {
  try {

    const { email, password, name } = req.body;

    if (!isValidEmail(email) || !password || password.length < 6 || !name) {
      return res.status(400).json({
        error: "Valid email, name and password (min 6 chars) required"
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password
    });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    if (data.user) {

      const { error: profileError } = await supabase
        .from("users")
        .insert({
          id: data.user.id,
          email,
          name
        });

      if (profileError) {
        return res.status(400).json({
          error: "User created but profile failed",
          details: profileError.message
        });
      }

    }

    res.status(201).json({
      message: "Signup successful",
      data
    });

  } catch (err) {

    res.status(500).json({
      error: "Signup failed",
      details: err.message
    });

  }
};

/*
================================
LOGIN
POST /auth/login
================================
*/
const login = async (req, res) => {

  try {

    const { email, password } = req.body;

    if (!isValidEmail(email) || !password) {
      return res.status(400).json({
        error: "Email and password required"
      });
    }

    const { data, error } =
      await supabase.auth.signInWithPassword({
        email,
        password
      });

    if (error) {
      return res.status(401).json({
        error: error.message
      });
    }

    res.status(200).json({
      message: "Login successful",
      data
    });

  } catch (err) {

    res.status(500).json({
      error: "Login failed",
      details: err.message
    });

  }

};

/*
================================
FORGOT PASSWORD (SEND OTP)
POST /auth/forgot-password
================================
*/
const forgotPassword = async (req, res) => {

  try {

    const { email } = req.body;

    if (!isValidEmail(email)) {
      return res.status(400).json({
        error: "Valid email required"
      });
    }

    const { error } =
      await supabase.auth.signInWithOtp({
        email
      });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(200).json({
      message: "OTP sent to email"
    });

  } catch (err) {

    res.status(500).json({
      error: "Failed to send OTP",
      details: err.message
    });

  }

};

/*
================================
VERIFY OTP
POST /auth/verify-otp
================================
*/
const verifyOtp = async (req, res) => {

  try {

    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        error: "Email and OTP required"
      });
    }

    const { data, error } =
      await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: "email"
      });

    if (error) {
      return res.status(400).json({
        error: error.message
      });
    }

    res.status(200).json({
      message: "OTP verified",
      session: data.session
    });

  } catch (err) {

    res.status(500).json({
      error: "OTP verification failed",
      details: err.message
    });

  }

};

/*
================================
RESET PASSWORD
POST /auth/reset-password
================================
*/
const resetPassword = async (req, res) => {

  try {

    const { newPassword } = req.body;

    const authHeader = req.headers.authorization;

    if (!authHeader) {
      return res.status(401).json({
        error: "Authorization token required"
      });
    }

    const token = authHeader.split(" ")[1];

    const response = await fetch(
      `${process.env.SUPABASE_URL}/auth/v1/user`,
      {
        method: "PUT",
        headers: {
          apikey: process.env.SUPABASE_ANON_KEY,
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          password: newPassword
        })
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return res.status(400).json({
        error: result.error_description
      });
    }

    res.status(200).json({
      message: "Password updated successfully"
    });

  } catch (err) {

    res.status(500).json({
      error: "Reset password failed",
      details: err.message
    });

  }

};

/*
================================
GET PROFILE
================================
*/
const getProfile = async (req, res) => {

  try {

    const { data, error } =
      await supabase
        .from("users")
        .select("*")
        .eq("id", req.user.id)
        .single();

    if (error) {
      return res.status(404).json({
        error: "Profile not found"
      });
    }

    res.status(200).json({ data });

  } catch (err) {

    res.status(500).json({
      error: "Failed to fetch profile"
    });

  }

};

module.exports = {
  signup,
  login,
  forgotPassword,
  verifyOtp,
  resetPassword,
  getProfile
};