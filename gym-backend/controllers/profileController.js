import { supabase } from "../config/supabaseClient.js";
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

/** @param {import('express').Request} req @param {import('express').Response} res */
export const createProfile = async (req, res) => {
  try {
    const { id, username, email, bio, age, weight_kg, height_cm, goal } = req.body;
    if (!id || !username || !email) {
      return sendError(res, 400, "id, username and email are required");
    }
    if (!isUuid(id)) return sendError(res, 400, "Invalid user id");

    const { data, error } = await supabase
      .from("profiles")
      .insert({ id, username, email, bio, age, weight_kg, height_cm, goal })
      .select()
      .single();

    if (error) return sendError(res, 400, "Unable to create profile");
    return sendSuccess(res, 201, "Profile created successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single();
    if (error || !data) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile fetched successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const allowed = ["username", "bio", "age", "weight_kg", "height_cm", "goal"];
    const payload = Object.fromEntries(
      Object.entries(req.body).filter(([key, value]) => allowed.includes(key) && value !== undefined)
    );
    if (!Object.keys(payload).length) return sendError(res, 400, "No valid fields to update");
    payload.updated_at = new Date().toISOString();
    const { data, error } = await supabase.from("profiles").update(payload).eq("id", userId).select().single();
    if (error || !data) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile updated successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const deleteProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const { error } = await supabase.from("profiles").delete().eq("id", userId);
    if (error) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile deleted successfully");
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const uploadProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    const { avatar_url, avatar_base64 } = req.body;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const value = avatar_url || avatar_base64;
    if (!value) return sendError(res, 400, "avatar_url or avatar_base64 is required");

    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: value, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();
    if (error || !data) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile photo updated", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const deleteProfilePhoto = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const { data, error } = await supabase
      .from("profiles")
      .update({ avatar_url: null, updated_at: new Date().toISOString() })
      .eq("id", userId)
      .select()
      .single();
    if (error || !data) return sendError(res, 404, "Profile not found");
    return sendSuccess(res, 200, "Profile photo removed", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
