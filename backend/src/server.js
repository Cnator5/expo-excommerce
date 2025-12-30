import express from "express";
import path from "path"
import { clerkMiddleware } from '@clerk/express'

import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

const app = express();

// Middleware
app.use(express.json());

const __dirname = path.resolve()

app.use(clerkMiddleware())


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

const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running");
  });
};

startServer();
