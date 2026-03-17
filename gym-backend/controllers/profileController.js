import { supabase } from "../config/supabaseClient.js";

// Create Profile
export const createProfile = async (req, res) => {
  try {
    const { id, full_name, age, height, weight, phone } = req.body;

    const { data, error } = await supabase
      .from("profiles")
      .insert([
        {
          id,
          full_name,
          age,
          height,
          weight,
          phone,
        },
      ]);

    if (error) return res.status(400).json({ error: error.message });

    res.status(201).json({
      message: "Profile created successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Get Profile
export const getProfile = async (req, res) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", id)
      .single();

    if (error) return res.status(404).json({ error: error.message });

    res.json(data);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// Update Profile
export const updateProfile = async (req, res) => {
  try {
    const { id } = req.params;
    const { full_name, age, height, weight, phone } = req.body;

    const { data, error } = await supabase
      .from("profiles")
      .update({
        full_name,
        age,
        height,
        weight,
        phone,
      })
      .eq("id", id);

    if (error) return res.status(400).json({ error: error.message });

    res.json({
      message: "Profile updated successfully",
      data,
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};