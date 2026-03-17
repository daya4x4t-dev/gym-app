import { supabase } from "../config/supabaseClient.js";

// =======================
// GET ALL WORKOUTS
// =======================
export const getWorkouts = async (req, res) => {
  try {
    const { data, error } = await supabase
      .from("workouts")
      .select("*");

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// GET WORKOUT BY ID
// =======================
export const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("workouts")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return res.status(404).json({ error: error.message });
    }

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// CREATE WORKOUT
// =======================
export const createWorkout = async (req, res) => {
  try {
    const { name, description, duration } = req.body;

    const { data, error } = await supabase
      .from("workouts")
      .insert([
        {
          name,
          description,
          duration,
        },
      ])
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.status(201).json({
      message: "Workout created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// UPDATE WORKOUT
// =======================
export const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, description, duration } = req.body;

    const { data, error } = await supabase
      .from("workouts")
      .update({
        name,
        description,
        duration,
      })
      .eq("id", id)
      .select();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Workout updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// =======================
// DELETE WORKOUT
// =======================
export const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    const { error } = await supabase
      .from("workouts")
      .delete()
      .eq("id", id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    res.json({
      message: "Workout deleted successfully",
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};