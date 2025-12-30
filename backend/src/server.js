import express from "express";

const app = express();

// Middleware
app.use(express.json());

// Health check route
app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// Start server
const PORT = 1010;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
