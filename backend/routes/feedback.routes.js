import express from "express";
import {
  getFeedbacks,
  getFeedbackByID,
  createFeedback,
  updateFeedback,
  deleteFeedback,
  addFeedbackToRequest,
  getFeedbackByCurrentUser,
} from "../controllers/feedback.controller.js";
import { isAuthenticated } from "../middlewares/auth.js";

const feedbackRouter = express.Router();

// Create Feedback
feedbackRouter.post("/create-feedback", isAuthenticated, createFeedback);

// Get all feedbacks
feedbackRouter.get("/get-all-feedbacks", isAuthenticated, getFeedbacks);

// Get feedback by ID
feedbackRouter.get(
  "/get-feedback-by-id/:feedbackID",
  isAuthenticated,
  getFeedbackByID
);

// Get feedback by current user
feedbackRouter.get(
  "/get-feedback-by-user",
  isAuthenticated,
  getFeedbackByCurrentUser
);

// Update a feedback by ID
feedbackRouter.put(
  "/update-feedback/:feedbackID",
  isAuthenticated,
  updateFeedback
);

// Attach feedback id to request
feedbackRouter.patch(
  "/attach-feedback-to-request/:requestID",
  isAuthenticated,
  addFeedbackToRequest
);

// Delete a feedback by ID
feedbackRouter.delete(
  "/delete-feedback/:feedbackID",
  isAuthenticated,
  deleteFeedback
);

export default feedbackRouter;
