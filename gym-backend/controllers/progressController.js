import { supabase } from "../config/supabaseClient.js";
import { sendError, sendSuccess } from "../utils/response.js";

/**
 * Add progress entry for authenticated user.
 */
export const addProgress = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { weight, date } = req.body;
    if (weight === undefined || !date) {
      return sendError(res, 400, "weight and date are required");
    }

    const numericWeight = Number(weight);
    if (Number.isNaN(numericWeight)) return sendError(res, 400, "weight must be numeric");

    const { data, error } = await supabase
      .from("progress")
      .insert({ user_id: req.user.id, weight: numericWeight, date })
      .select("*")
      .single();

    if (error) return sendError(res, 400, "Unable to add progress entry");
    return sendSuccess(res, 201, "Progress added successfully", data);
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

export const logProgress = async (req, res) => {
  try {
    const { user_id, weight_kg, body_fat_percent, chest_cm, waist_cm, hips_cm, notes } = req.body;
    if (!user_id) return sendError(res, 400, "user_id is required");
    if (!isUuid(user_id)) return sendError(res, 400, "Invalid user id");

    const { data, error } = await supabase
      .from("progress_logs")
      .insert({ user_id, weight_kg, body_fat_percent, chest_cm, waist_cm, hips_cm, notes })
      .select()
      .single();
    if (error) return sendError(res, 400, "Unable to log progress");
    return sendSuccess(res, 201, "Progress logged successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Get all progress entries for authenticated user.
 */
export const getProgress = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { data, error } = await supabase
      .from("progress")
      .select("*")
      .eq("user_id", req.user.id)
      .order("date", { ascending: false });

    if (error) return sendError(res, 400, "Unable to fetch progress entries");
    return sendSuccess(res, 200, "Progress entries fetched successfully", data ?? []);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Get progress summary for authenticated user.
 */
export const getProgressSummary = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { data, error } = await supabase
      .from("progress")
      .select("weight, date")
      .eq("user_id", req.user.id)
      .order("date", { ascending: true });

    if (error) return sendError(res, 400, "Unable to fetch progress summary");
    if (!data || data.length === 0) {
      return sendSuccess(res, 200, "Progress summary fetched successfully", {
        currentWeight: null,
        startingWeight: null,
        totalChange: null,
      });
    }

    const startingWeight = Number(data[0].weight);
    const currentWeight = Number(data[data.length - 1].weight);

    return sendSuccess(res, 200, "Progress summary fetched successfully", {
      currentWeight,
      startingWeight,
      totalChange: currentWeight - startingWeight,
    });
export const getProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const { data, error } = await supabase
      .from("progress_logs")
      .select("*")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false });
    if (error) return sendError(res, 400, "Unable to fetch progress");
    return sendSuccess(res, 200, "Progress fetched successfully", data ?? []);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const getLatestProgress = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const { data, error } = await supabase
      .from("progress_logs")
      .select("*")
      .eq("user_id", userId)
      .order("logged_at", { ascending: false })
      .limit(1)
      .maybeSingle();
    if (error) return sendError(res, 400, "Unable to fetch latest progress");
    return sendSuccess(res, 200, "Latest progress fetched successfully", data ?? {});
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const deleteProgress = async (req, res) => {
  try {
    const { progressId } = req.params;
    if (!isUuid(progressId)) return sendError(res, 400, "Invalid progress id");
    const { error } = await supabase.from("progress_logs").delete().eq("id", progressId);
    if (error) return sendError(res, 404, "Progress log not found");
    return sendSuccess(res, 200, "Progress log deleted successfully");
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
