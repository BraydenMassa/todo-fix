import { sql } from "../database/db_config.js";

export const validateEmailExists = async (req, res, next) => {
  const { email } = req.body;
  if (!email) {
    return res.status(400).json({ error: "Email is required" });
  }
  try {
    const [user] = await sql`SELECT user_id FROM users WHERE email = ${email}`;
    if (!user) {
      return res.status(404).json({ error: "No user with that email" });
    }
    req.user = user;
    next();
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
