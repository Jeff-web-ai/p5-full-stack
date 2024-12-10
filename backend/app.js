import express from "express";
import cors from "cors";
import morgan from "morgan";
import dotenv from "dotenv";

dotenv.config();

// middlewares
import { ErrorMiddleware } from "./middlewares/error.js";

// db
import connectDB from "./utils/db.js";

// routes
import userRouter from "./routes/user.routes.js";
import jobRouter from "./routes/job.routes.js";
import serviceRouter from "./routes/service.routes.js";
import requestRouter from "./routes/request.routes.js";
import feedbackRouter from "./routes/feedback.routes.js";

const app = express();
const PORT = process.env.PORT || 5001;

// HTTP logging
app.use(morgan("dev"));

// Boday parser
app.use(express.urlencoded({ extended: true }));
app.use(express.json({ limit: "50mb" }));

// CORS configuration
app.use(
  cors({
    origin: ["https://servicesync.onrender.com"],
  })
);

app.listen(PORT, () => {
  console.log(`Server running at port ${PORT}`);
  connectDB();
});

// API routes
app.use(
  "/api/v1/",
  userRouter,
  jobRouter,
  serviceRouter,
  requestRouter,
  feedbackRouter
);

// API testing
app.get("/test", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Api is working",
  });
});

// Unknown route
app.all("*", (req, res, next) => {
  const err = new Error(`Route ${req.originalUrl} not found`);
  err.statusCode = 404;
  next(err);
});

app.use(ErrorMiddleware);
