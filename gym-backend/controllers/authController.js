import { supabase } from "../config/supabaseClient.js";

// =======================
// SIGNUP
// =======================
export const signup = async (req, res) => {
  try {
    const { email, password, username } = req.body;

    // ✅ Validate inputs
    if (!email || !password || !username) {
      return res.status(400).json({
        success: false,
        message: "Email, password and username are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username }, // ✅ Save username to metadata
      },
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.status(201).json({
      success: true,
      message: "User registered successfully. Please verify your email.",
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// LOGIN
// =======================
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // ✅ Validate inputs
    if (!email || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required",
      });
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Login successful",
      session: data.session,
      user: data.user,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// FORGOT PASSWORD
// =======================
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;

    // ✅ Validate input
    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    const { data, error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: process.env.PASSWORD_RESET_URL || "http://localhost:3000/reset-password", // ✅ env variable
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Password reset email sent. Please check your inbox.",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// VERIFY OTP
// =======================
export const verifyOtp = async (req, res) => {
  try {
    const { email, token } = req.body;

    // ✅ Validate inputs
    if (!email || !token) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP token are required",
      });
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email,
      token,
      type: "email",
    });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "OTP verified successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// RESET PASSWORD
// =======================
export const resetPassword = async (req, res) => {
  try {
    const { password, accessToken } = req.body;

    // ✅ Validate inputs
    if (!password || !accessToken) {
      return res.status(400).json({
        success: false,
        message: "Password and access token are required",
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        message: "Password must be at least 6 characters",
      });
    }

    // ✅ Set session with access token first
    const { error: sessionError } = await supabase.auth.setSession({
      access_token: accessToken,
      refresh_token: accessToken,
    });

    if (sessionError) {
      return res.status(401).json({
        success: false,
        message: "Invalid or expired token",
      });
    }

    const { data, error } = await supabase.auth.updateUser({ password });

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      message: "Password updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};

// =======================
// GET PROFILE
// =======================
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.query;

    // ✅ Validate input
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required",
      });
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single();

    if (error) {
      return res.status(400).json({
        success: false,
        message: error.message,
      });
    }

    res.json({
      success: true,
      profile: data,
    });
  } catch (err) {
    res.status(500).json({
      success: false,
      message: err.message,
    });
  }
};