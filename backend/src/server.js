// import express from "express";
// import path from "path";
// import { clerkMiddleware } from "@clerk/express";
// import { serve } from "inngest/express";
// import cors from "cors";

// import { functions, inngest } from "./config/inngest.js";

// import { ENV } from "./config/env.js";
// import { connectDB } from "./config/db.js";

// import adminRoutes from "./routes/admin.route.js";
// import userRoutes from "./routes/user.route.js";
// import orderRoutes from "./routes/order.route.js";
// import reviewRoutes from "./routes/review.route.js";
// import productRoutes from "./routes/product.route.js";
// import cartRoutes from "./routes/cart.route.js";
// // import paymentRoutes from "./routes/payment.route.js";

// const app = express();

// const __dirname = path.resolve();

// // special handling: Stripe webhook needs raw body BEFORE any body parsing middleware
// // apply raw body parser conditionally only to webhook endpoint

// // app.use(
// //   "/api/payment",
// //   (req, res, next) => {
// //     if (req.originalUrl === "/api/payment/webhook") {
// //       express.raw({ type: "application/json" })(req, res, next);
// //     } else {
// //       express.json()(req, res, next); // parse json for non-webhook routes
// //     }
// //   },
// //   paymentRoutes
// // );

// app.use(express.json());
// app.use(clerkMiddleware()); // adds auth object under the req => req.auth
// app.use(cors({ origin: ENV.CLIENT_URL, credentials: true })); // credentials: true allows the browser to send the cookies to the server with the request

// app.use("/api/inngest", serve({ client: inngest, functions }));

// app.use("/api/admin", adminRoutes);
// app.use("/api/users", userRoutes);
// app.use("/api/orders", orderRoutes);
// app.use("/api/reviews", reviewRoutes);
// app.use("/api/products", productRoutes);
// app.use("/api/cart", cartRoutes);

// app.get("/api/health", (req, res) => {
//   res.status(200).json({ message: "Success" });
// });

// // make our app ready for deployment
// if (ENV.NODE_ENV === "production") {
//   app.use(express.static(path.join(__dirname, "../admin/dist")));

//   app.get("/{*any}", (req, res) => {
//     res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
//   });
// }

// const startServer = async () => {
//   await connectDB();
//   app.listen(ENV.PORT, () => {
//     console.log("Server is up and running on port:", ENV.PORT);
//   });
// };

// startServer();






import express from "express";
import path from "path";
import { clerkMiddleware } from "@clerk/express";
import { serve } from "inngest/express";
import cors from "cors";

import { functions, inngest } from "./config/inngest.js";
import { ENV } from "./config/env.js";
import { connectDB } from "./config/db.js";

import adminRoutes from "./routes/admin.route.js";
import userRoutes from "./routes/user.route.js";
import orderRoutes from "./routes/order.route.js";
import reviewRoutes from "./routes/review.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
// import paymentRoutes from "./routes/payment.route.js";

const app = express();
const __dirname = path.resolve();

// ================================
// 🔹 FIX: DISABLE ETAG & CONDITIONAL RESPONSES
// Prevent Express from returning 304 Not Modified
// This ensures React frontend always receives JSON data
// ================================
app.disable("etag"); // disables ETag generation
app.use((req, res, next) => {
  res.setHeader("Cache-Control", "no-store, no-cache, must-revalidate, proxy-revalidate");
  res.setHeader("Pragma", "no-cache");
  res.setHeader("Expires", "0");
  res.removeHeader("ETag"); // remove if already set
  res.removeHeader("Last-Modified"); // remove if already set
  next();
});

// ================================
// 🔹 MIDDLEWARE
// ================================
app.use(express.json());
app.use(clerkMiddleware()); // adds auth object under req => req.auth
app.use(cors({ origin: ENV.CLIENT_URL, credentials: true }));

app.use("/api/inngest", serve({ client: inngest, functions }));

app.use("/api/admin", adminRoutes);
app.use("/api/users", userRoutes);
app.use("/api/orders", orderRoutes);
app.use("/api/reviews", reviewRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);

// app.use(
//   "/api/payment",
//   (req, res, next) => {
//     if (req.originalUrl === "/api/payment/webhook") {
//       express.raw({ type: "application/json" })(req, res, next);
//     } else {
//       express.json()(req, res, next);
//     }
//   },
//   paymentRoutes
// );

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Success" });
});

// ================================
// 🔹 SERVE FRONTEND IN PRODUCTION
// ================================
if (ENV.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "../admin/dist")));

  app.get("/{*any}", (req, res) => {
    res.sendFile(path.join(__dirname, "../admin", "dist", "index.html"));
  });
}

// ================================
// 🔹 START SERVER
// ================================
const startServer = async () => {
  await connectDB();
  app.listen(ENV.PORT, () => {
    console.log("Server is up and running on port:", ENV.PORT);
  });
};

startServer();
