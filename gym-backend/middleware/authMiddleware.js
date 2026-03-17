import { supabase } from "../config/supabaseClient.js";

const authMiddleware = async (req, res, next) => {
  try {
    const token = req.headers.authorization?.replace("Bearer ", "");
    if (!token) {
      return res.status(401).json({ success: false, message: "Unauthorized", data: {} });
    }

    const { data, error } = await supabase.auth.getUser(token);
    if (error || !data.user) {
      return res.status(401).json({ success: false, message: "Invalid or expired token", data: {} });
    }

    req.user = data.user;
    return next();
  } catch (_error) {
    return res.status(500).json({ success: false, message: "Authentication failed", data: {} });
  }
};

export default authMiddleware;
