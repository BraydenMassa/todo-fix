import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import fs from "fs";
import https from "https";
dotenv.config();

// Setting up express server
const app = express();
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  })
);

// Configure middlewares
app.use(express.json());
app.use(cookieParser());

// Import routes
import authRoutes from "./routes/authRoutes.js";

app.use("/api/auth/", authRoutes);

// Define the path to the SSL certificate and key files
const options = {
  key: fs.readFileSync("./ssl/key.pem"), // Path to your private key file
  cert: fs.readFileSync("./ssl/cert.pem"), // Path to your certificate file
};

const PORT = process.env.EXPRESS_PORT || 4000;

// Start the HTTPS server on port 3000
https.createServer(options, app).listen(PORT, () => {
  console.log(`HTTPS server running on port ${PORT}`);
});
