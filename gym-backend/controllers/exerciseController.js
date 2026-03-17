import { supabase } from "../config/supabaseClient.js";
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

export const getExercises = async (req, res) => {
  try {
    const { muscle } = req.query;
    let query = supabase.from("exercises").select("*").order("name", { ascending: true });
    if (muscle) query = query.ilike("muscle_group", String(muscle));
    const { data, error } = await query;
    if (error) return sendError(res, 400, "Unable to fetch exercises");
    return sendSuccess(res, 200, "Exercises fetched successfully", data ?? []);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const getExerciseById = async (req, res) => {
  try {
    const { id } = req.params;
    if (!isUuid(id)) return sendError(res, 400, "Invalid exercise id");
    const { data, error } = await supabase.from("exercises").select("*").eq("id", id).single();
    if (error || !data) return sendError(res, 404, "Exercise not found");
    return sendSuccess(res, 200, "Exercise fetched successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
