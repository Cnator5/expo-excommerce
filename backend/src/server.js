import express from "express";
import path from "path"
import { ENV } from "./config/env.js";

const app = express();

// Middleware
app.use(express.json());

const __dirname = path.resolve()


// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

//make the mobile app ready for deployment
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

// Start server
app.listen(ENV.PORT, () => {
  console.log("Server is running");
});
