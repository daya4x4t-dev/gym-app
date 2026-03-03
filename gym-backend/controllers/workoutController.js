const supabase = require('../config/supabaseClient');

const isValidWorkoutPayload = ({ title, description, difficulty, duration }) => {
  if (!title || !description || !difficulty || duration === undefined) return false;
  if (typeof title !== 'string' || typeof description !== 'string' || typeof difficulty !== 'string') return false;
  if (!Number.isFinite(Number(duration)) || Number(duration) <= 0) return false;
  return true;
};

const getWorkouts = async (_req, res) => {
  try {
    const { data, error } = await supabase.from('workouts').select('*').order('id', { ascending: true });

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch workouts', details: err.message });
  }
};

const getWorkoutById = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid workout id is required' });
    }

    const { data, error } = await supabase.from('workouts').select('*').eq('id', id).single();

    if (error) {
      return res.status(404).json({ error: 'Workout not found', details: error.message });
    }

    return res.status(200).json({ data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to fetch workout', details: err.message });
  }
};

const createWorkout = async (req, res) => {
  try {
    if (!isValidWorkoutPayload(req.body)) {
      return res.status(400).json({
        error: 'title, description, difficulty and duration (> 0) are required',
      });
    }

    const payload = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      difficulty: req.body.difficulty.trim(),
      duration: Number(req.body.duration),
    };

    const { data, error } = await supabase.from('workouts').insert(payload).select().single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(201).json({ message: 'Workout created', data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to create workout', details: err.message });
  }
};

const updateWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid workout id is required' });
    }

    if (!isValidWorkoutPayload(req.body)) {
      return res.status(400).json({
        error: 'title, description, difficulty and duration (> 0) are required',
      });
    }

    const payload = {
      title: req.body.title.trim(),
      description: req.body.description.trim(),
      difficulty: req.body.difficulty.trim(),
      duration: Number(req.body.duration),
    };

    const { data, error } = await supabase
      .from('workouts')
      .update(payload)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Workout updated', data });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to update workout', details: err.message });
  }
};

const deleteWorkout = async (req, res) => {
  try {
    const { id } = req.params;

    if (!id || Number.isNaN(Number(id))) {
      return res.status(400).json({ error: 'Valid workout id is required' });
    }

    const { error } = await supabase.from('workouts').delete().eq('id', id);

    if (error) {
      return res.status(400).json({ error: error.message });
    }

    return res.status(200).json({ message: 'Workout deleted successfully' });
  } catch (err) {
    return res.status(500).json({ error: 'Failed to delete workout', details: err.message });
  }
};

module.exports = {
  getWorkouts,
  getWorkoutById,
  createWorkout,
  updateWorkout,
  deleteWorkout,
};
