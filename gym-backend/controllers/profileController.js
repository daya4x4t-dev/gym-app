import { supabase } from "../config/supabaseClient.js";
import { sendError, sendSuccess } from "../utils/response.js";

/**
 * Fetch profile for authenticated user.
 */
export const getMyProfile = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { data, error } = await supabase
      .from("profiles")
      .select("id, name, email, created_at")
      .eq("id", req.user.id)
      .single();

    if (error || !data) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile fetched successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Update profile for authenticated user.
 */
export const updateMyProfile = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { name } = req.body;
    if (name !== undefined && String(name).trim().length === 0) {
      return sendError(res, 400, "Name cannot be empty");
    }

    const payload = {};
    if (name !== undefined) payload.name = String(name).trim();

    if (!Object.keys(payload).length) {
      return sendError(res, 400, "No valid fields provided");
    }

    const { data, error } = await supabase
      .from("profiles")
      .update(payload)
      .eq("id", req.user.id)
      .select("id, name, email, created_at")
      .single();

    if (error || !data) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile updated successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
