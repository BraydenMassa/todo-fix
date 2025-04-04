import express from "express";

const router = express.Router();

// Import controller functions
import {
  loginUser,
  registerUser,
  logoutUser,
  validateAccessToken,
} from "../controllers/authController.js";
import validatePassword from "../middlewares/validatePassword.js";
import validateEmail from "../middlewares/validateEmail.js";

// Register route
router.post("/register", validateEmail, validatePassword, registerUser);

// Login route
router.post("/login", loginUser);

// Logout route
router.post("/logout", logoutUser);

// Access token verification
router.get("/validate-auth", validateAccessToken);

export default router;
