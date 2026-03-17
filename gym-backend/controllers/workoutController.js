import { supabase } from "../config/supabaseClient.js";
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

export const createWorkout = async (req, res) => {
  try {
    const { user_id, exercise_name, sets, reps, weight_kg, notes, workout_date } = req.body;
    if (!user_id || !exercise_name) return sendError(res, 400, "user_id and exercise_name are required");
    if (!isUuid(user_id)) return sendError(res, 400, "Invalid user id");

    const { data, error } = await supabase
      .from("workouts")
      .insert({ user_id, exercise_name, sets, reps, weight_kg, notes, workout_date })
      .select()
      .single();
    if (error) return sendError(res, 400, "Unable to create workout");
    return sendSuccess(res, 201, "Workout logged successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const getWorkouts = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .order("workout_date", { ascending: false });
    if (error) return sendError(res, 400, "Unable to fetch workouts");
    return sendSuccess(res, 200, "Workouts fetched successfully", data ?? []);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const getWorkoutById = async (req, res) => {
  try {
    const { userId, workoutId } = req.params;
    if (!isUuid(userId) || !isUuid(workoutId)) return sendError(res, 400, "Invalid ids");
    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("user_id", userId)
      .eq("id", workoutId)
      .single();
    if (error || !data) return sendError(res, 404, "Workout not found");
    return sendSuccess(res, 200, "Workout fetched successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const updateWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    if (!isUuid(workoutId)) return sendError(res, 400, "Invalid workout id");
    const allowed = ["exercise_name", "sets", "reps", "weight_kg", "notes", "workout_date"];
    const payload = Object.fromEntries(
      Object.entries(req.body).filter(([key, value]) => allowed.includes(key) && value !== undefined)
    );
    if (!Object.keys(payload).length) return sendError(res, 400, "No valid fields to update");

    const { data, error } = await supabase.from("workouts").update(payload).eq("id", workoutId).select().single();
    if (error || !data) return sendError(res, 404, "Workout not found");
    return sendSuccess(res, 200, "Workout updated successfully", data);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

export const deleteWorkout = async (req, res) => {
  try {
    const { workoutId } = req.params;
    if (!isUuid(workoutId)) return sendError(res, 400, "Invalid workout id");
    const { error } = await supabase.from("workouts").delete().eq("id", workoutId);
    if (error) return sendError(res, 404, "Workout not found");
    return sendSuccess(res, 200, "Workout deleted successfully");
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
