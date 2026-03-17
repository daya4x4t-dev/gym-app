import { supabase } from "../config/supabaseClient.js";
import { sendError, sendSuccess } from "../utils/response.js";
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

const safeAuthMessage = "Authentication request failed";

/**
 * Register a new user and create linked profile.
 */
export const signup = async (req, res) => {
  try {
    const { email, password, name, username } = req.body;
    const resolvedName = String(name || username || "").trim();

    if (!email || !password || !resolvedName) {
      return sendError(res, 400, "Email, password and name are required");
 * Register a new user account.
 */
export const signup = async (req, res) => {
  try {
    const { email, password, username, name } = req.body;
    const finalUsername = String(username || name || "").trim();

    if (!email || !password || !finalUsername) {
      return sendError(res, 400, "Email, password and username are required");
    }

    const { data, error } = await supabase.auth.signUp({
      email: String(email).trim().toLowerCase(),
      password: String(password),
      options: {
        data: { name: resolvedName },
      },
    });

    if (error || !data.user) {
      return sendError(res, 400, safeAuthMessage);
    }

    const { error: profileError } = await supabase.from("profiles").upsert({
      id: data.user.id,
      name: resolvedName,
      email: String(email).trim().toLowerCase(),
      created_at: new Date().toISOString(),
    });

    if (profileError) {
      return sendError(res, 500, "User created but profile setup failed");
    }

    return sendSuccess(res, 201, "User registered successfully", {
      user: {
        id: data.user.id,
        email: data.user.email,
      },
    });
      options: { data: { username: finalUsername } },
    });

    if (error) {
      return sendError(res, 400, safeAuthMessage);
    }

    return sendSuccess(
      res,
      201,
      "User registered successfully. Please verify your email.",
      { user: data.user }
    );
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Login user.
 * Log in with email and password.
 */
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return sendError(res, 400, "Email and password are required");
    }

    const { data, error } = await supabase.auth.signInWithPassword({
      email: String(email).trim().toLowerCase(),
      password: String(password),
    });

    if (error || !data.user || !data.session) {
    if (error || !data.session) {
      return sendError(res, 401, "Invalid email or password");
    }

    return sendSuccess(res, 200, "Login successful", {
      token: data.session.access_token,
      user: {
        id: data.user.id,
        email: data.user.email,
      },
      session: data.session,
      user: data.user,
      token: data.session.access_token,
    });
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Send reset password email.
 * Request password reset email.
 */
export const forgotPassword = async (req, res) => {
  try {
    const { email } = req.body;
    if (!email) return sendError(res, 400, "Email is required");

    const redirectTo = process.env.PASSWORD_RESET_URL;
    if (!redirectTo) return sendError(res, 500, "Password reset URL is not configured");

    const { error } = await supabase.auth.resetPasswordForEmail(String(email).trim().toLowerCase(), { redirectTo });
    if (error) return sendError(res, 400, safeAuthMessage);

    return sendSuccess(res, 200, "Password reset email sent");
    if (!email) {
      return sendError(res, 400, "Email is required");
    }

    const redirectTo = process.env.PASSWORD_RESET_URL;
    if (!redirectTo) {
      return sendError(res, 500, "Password reset URL is not configured");
    }

    const { error } = await supabase.auth.resetPasswordForEmail(
      String(email).trim().toLowerCase(),
      { redirectTo }
    );

    if (error) {
      return sendError(res, 400, safeAuthMessage);
    }

    return sendSuccess(res, 200, "Password reset email sent.");
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Verify OTP.
 * Verify email OTP token.
 */
export const verifyOtp = async (req, res) => {
  try {
    const { email, token } = req.body;
    if (!email || !token) return sendError(res, 400, "Email and token are required");
    if (!email || !token) {
      return sendError(res, 400, "Email and OTP token are required");
    }

    const { data, error } = await supabase.auth.verifyOtp({
      email: String(email).trim().toLowerCase(),
      token: String(token).trim(),
      type: "email",
    });

    if (error) return sendError(res, 400, safeAuthMessage);
    return sendSuccess(res, 200, "OTP verified", data);
    if (error) {
      return sendError(res, 400, safeAuthMessage);
    }

    return sendSuccess(res, 200, "OTP verified successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Reset password using access token.
 */
export const resetPassword = async (req, res) => {
  try {
    const { password, accessToken } = req.body;
    if (!password || !accessToken) return sendError(res, 400, "Password and access token are required");

    const { data: userData, error: userError } = await supabase.auth.getUser(String(accessToken));
    if (userError || !userData.user) return sendError(res, 401, "Invalid or expired token");

    if (!password || !accessToken) {
      return sendError(res, 400, "Password and access token are required");
    }

    const { data: userData, error: userError } = await supabase.auth.getUser(
      String(accessToken)
    );
    if (userError || !userData.user) {
      return sendError(res, 401, "Invalid or expired token");
    }

    const { error: sessionError } = await supabase.auth.setSession({
      access_token: String(accessToken),
      refresh_token: String(accessToken),
    });
    if (sessionError) return sendError(res, 401, "Invalid or expired token");

    const { error } = await supabase.auth.updateUser({ password: String(password) });
    if (error) return sendError(res, 400, safeAuthMessage);
    if (sessionError) {
      return sendError(res, 401, "Invalid or expired token");
    }

    const { error } = await supabase.auth.updateUser({
      password: String(password),
    });

    if (error) {
      return sendError(res, 400, safeAuthMessage);
    }

    return sendSuccess(res, 200, "Password updated successfully");
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Get profile for authenticated user.
 */
export const getProfile = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");
 * Get profile by userId query parameter.
 */
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.query;
    if (!userId || !isUuid(String(userId))) {
      return sendError(res, 400, "A valid userId is required");
    }

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !data) return sendError(res, 404, "Profile not found");
    if (error || !data) {
      return sendError(res, 404, "Profile not found");
    }

    return sendSuccess(res, 200, "Profile fetched successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
