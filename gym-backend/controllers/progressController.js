const supabase = require('../config/supabaseClient');

const addProgress = async (req, res) => {
  try {
    const { workout_id, date, calories_burned } = req.body;

    if (!workout_id || !date || calories_burned === undefined) {
      return res.status(400).json({ error: 'workout_id, date and calories_burned are required' });
    }

    if (Number.isNaN(Number(workout_id)) || Number.isNaN(Number(calories_burned))) {
      return res.status(400).json({ error: 'workout_id and calories_burned must be numeric' });
    }

    const payload = {
      user_id: req.user.id,
      workout_id: Number(workout_id),
      date,
      calories_burned: Number(calories_burned),
    };

    const { data, error } = await supabase.from('progress').insert(payload).select().single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Progress saved', data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to save progress', details: err.message });
  }
};

const getProgressByUserId = async (req, res) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return res.status(400).json({ error: 'userId is required' });
    }

    // Basic ownership guard: users can only read their own progress.
    if (req.user.id !== userId) {
      return res.status(403).json({ error: 'Forbidden: cannot access another user\'s progress' });
    }

    const { data, error } = await supabase
      .from('progress')
      .select('id, user_id, workout_id, date, calories_burned')
      .eq('user_id', userId)
      .order('date', { ascending: false });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch progress', details: err.message });
  }
};

module.exports = {
  addProgress,
  getProgressByUserId,
};
