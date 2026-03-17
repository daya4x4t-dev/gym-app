import { supabase } from "../config/supabaseClient.js";
import { isUuid, sendError, sendSuccess } from "../utils/response.js";

export const getStats = async (req, res) => {
  try {
    const { userId } = req.params;
    if (!isUuid(userId)) return sendError(res, 400, "Invalid user id");

    const { count: totalWorkouts, error: totalError } = await supabase
      .from("workouts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId);

    if (totalError) return sendError(res, 400, "Unable to fetch stats");

    const startOfWeek = new Date();
    startOfWeek.setDate(startOfWeek.getDate() - startOfWeek.getDay());

    const { count: thisWeekWorkouts, error: weekError } = await supabase
      .from("workouts")
      .select("id", { count: "exact", head: true })
      .eq("user_id", userId)
      .gte("workout_date", startOfWeek.toISOString().split("T")[0]);

    if (weekError) return sendError(res, 400, "Unable to fetch stats");

    return sendSuccess(res, 200, "Stats fetched successfully", {
      totalWorkouts: totalWorkouts || 0,
      thisWeek: thisWeekWorkouts || 0,
      streak: thisWeekWorkouts || 0,
    });
  } catch (_error) {
    return sendError(res, 500, "Internal server error");
  }
};
