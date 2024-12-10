import express from "express";
import {
  getRequests,
  getRequestByID,
  getOpenRequests,
  getUserRequests,
  getAcceptedRequests,
  getCompletedRequests,
  createRequest,
  updateRequest,
  deleteRequest,
  completeRequest,
  acceptRequest,
} from "../controllers/request.controller.js";
import upload from "../middlewares/multerConfig.js";
import { isAuthenticated } from "../middlewares/auth.js";

const requestRouter = express.Router();

// Create a request
requestRouter.post(
  "/create-request",
  upload.single("images"),
  isAuthenticated,
  createRequest
);

// Get all requests
requestRouter.get("/get-all-requests", isAuthenticated, getRequests);

// Get request by ID
requestRouter.get(
  "/get-request-by-id/:requestID",
  isAuthenticated,
  getRequestByID
);

// Get Open Request based on current user
requestRouter.get("/get-open-requests", isAuthenticated, getOpenRequests);

// Get users request
requestRouter.get("/get-users-request", isAuthenticated, getUserRequests);

// Get accepted requests
requestRouter.get(
  "/get-accepted-requests",
  isAuthenticated,
  getAcceptedRequests
);

// Get completed requests
requestRouter.get(
  "/get-completed-requests",
  isAuthenticated,
  getCompletedRequests
);

// Update a request
requestRouter.put(
  "/update-request/:requestID",
  upload.single("images"),
  isAuthenticated,
  updateRequest
);

// Accept a request
requestRouter.patch(
  "/accept-request/:requestID",
  isAuthenticated,
  acceptRequest
);

// Complete a request
requestRouter.patch(
  "/complete-request/:requestID",
  isAuthenticated,
  completeRequest
);

// Delete a request.
requestRouter.delete(
  "/delete-request/:requestID",
  isAuthenticated,
  deleteRequest
);

export default requestRouter;
