import { supabase } from "../config/supabaseClient.js";
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
