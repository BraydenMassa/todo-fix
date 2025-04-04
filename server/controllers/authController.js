import jwt from "jsonwebtoken";
import { sql } from "../database/dbConfig.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";
dotenv.config();

const createAccessToken = (user) => {
  return jwt.sign(
    { id: user.userId, email: user.email },
    process.env.ACCESS_TOKEN_SECRET,
    {
      expiresIn: "30m",
    }
  );
};

export const registerUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [existingUser] =
      await sql`SELECT user_id FROM users WHERE email = ${email}`;

    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }
    // Encrypt password and save user to DB
    const hashedPassword = await bcrypt.hash(password, 10);
    const [newUser] =
      await sql`INSERT INTO users(email, password) VALUES(${email}, ${hashedPassword}) RETURNING user_id`;
    // const accessToken = createAccessToken(newUser);

    // // Set access token to response http only cookie
    // res.cookie("accessToken", accessToken, {
    //   httpOnly: true,
    //   sameSite: "none",
    //   secure: true,
    //   partitioned: true,
    // });
    // Successful registration, return access token
    return res.status(201).json({ userId: newUser.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error registering user" });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    const [user] = await sql`SELECT * from users WHERE email = ${email}`;

    if (!user) {
      return res.status(404).json({ error: "User not found with that email" });
    }
    const passwordsMatch = await bcrypt.compare(password, user.password);
    if (!passwordsMatch) {
      return res.status(400).json({ error: "Incorrect password" });
    }
    delete user.password; // Delete password to hide from response
    const accessToken = createAccessToken(user);

    // Set access token to response http only cookie
    res.cookie("accessToken", accessToken, {
      httpOnly: true,
      sameSite: "none",
      secure: true,
      partitioned: true,
    });
    // Successful login, return access token
    return res.status(200).json({ accessToken, userId: user.userId });
  } catch (err) {
    console.error(err);
    return res.status(500).json({ error: "Server error logging in user" });
  }
};

export const logoutUser = async (req, res) => {
  res.clearCookie("accessToken", {
    httpOnly: true,
    sameSite: "none",
    secure: true,
  });
  return res.status(200).json({ message: "User logged out" });
};

export const validateAccessToken = async (req, res) => {
  const accessToken = req.cookies.accessToken;
  try {
    const decoded = jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET);
    const [existingUser] =
      await sql`SELECT user_id FROM users WHERE user_id = ${decoded.id}`;

    if (!existingUser) {
      return res
        .status(403)
        .json({ error: "Invalid access token", isAuthenticated: false });
    }
    return res.status(200).json({ isAuthenticated: true });
  } catch (err) {
    console.error(err);
    return res
      .status(500)
      .json({ error: "Server error validating auth", isAuthenticated: false });
  }
};
