import { supabase } from "../config/supabaseClient.js";
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

/**
 * Create a workout for authenticated user.
 */
export const createWorkout = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { title, exercises, duration, created_at } = req.body;
    if (!title || !Array.isArray(exercises)) {
      return sendError(res, 400, "title and exercises array are required");
    }

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
      .insert({
        user_id: req.user.id,
        title: String(title).trim(),
        exercises,
        duration: duration ?? null,
        created_at: created_at ?? new Date().toISOString(),
      })
      .select("*")
      .single();

    if (error) return sendError(res, 400, "Unable to create workout");
    return sendSuccess(res, 201, "Workout created successfully", data);
      .eq("user_id", userId)
      .order("workout_date", { ascending: false });
    if (error) return sendError(res, 400, "Unable to fetch workouts");
    return sendSuccess(res, 200, "Workouts fetched successfully", data ?? []);
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};

/**
 * Get workouts for authenticated user with pagination + filtering.
 */
export const getWorkouts = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const page = Math.max(1, Number(req.query.page) || 1);
    const limit = Math.min(100, Math.max(1, Number(req.query.limit) || 10));
    const from = (page - 1) * limit;
    const to = from + limit - 1;
    const sort = req.query.sort === "asc" ? { ascending: true } : { ascending: false };
    const { fromDate, toDate } = req.query;

    let query = supabase
      .from("workouts")
      .select("*", { count: "exact" })
      .eq("user_id", req.user.id)
      .order("created_at", sort)
      .range(from, to);

    if (fromDate) query = query.gte("created_at", fromDate);
    if (toDate) query = query.lte("created_at", toDate);

    const { data, error, count } = await query;
    if (error) return sendError(res, 400, "Unable to fetch workouts");

    return sendSuccess(res, 200, "Workouts fetched successfully", {
      items: data ?? [],
      pagination: { page, limit, total: count || 0 },
    });
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

/**
 * Update workout if owned by authenticated user.
 */
export const updateWorkout = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { id } = req.params;
    if (!isUuid(id)) return sendError(res, 400, "Invalid workout id");

    const { title, exercises, duration } = req.body;
    const payload = {};

    if (title !== undefined) payload.title = String(title).trim();
    if (exercises !== undefined) {
      if (!Array.isArray(exercises)) return sendError(res, 400, "exercises must be an array");
      payload.exercises = exercises;
    }
    if (duration !== undefined) payload.duration = duration;

    if (!Object.keys(payload).length) return sendError(res, 400, "No valid fields provided");

    const { data, error } = await supabase
      .from("workouts")
      .update(payload)
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select("*")
      .single();

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

/**
 * Delete workout if owned by authenticated user.
 */
export const deleteWorkout = async (req, res) => {
  try {
    if (!req.user?.id) return sendError(res, 401, "Unauthorized");

    const { id } = req.params;
    if (!isUuid(id)) return sendError(res, 400, "Invalid workout id");

    const { data, error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", id)
      .eq("user_id", req.user.id)
      .select("id")
      .maybeSingle();

    if (error || !data) return sendError(res, 404, "Workout not found");
    return sendSuccess(res, 200, "Workout deleted successfully", data);
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
