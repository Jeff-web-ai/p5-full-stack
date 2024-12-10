import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "../utils/cloudinary.js";
import FeedbackModel from "../models/feedback.model.js";
import RequestModel from "../models/request.model.js";
import UserModel from "../models/user.model.js";
import { updateRequest } from "./request.controller.js";

// Get all feedbacks
export const getFeedbacks = catchAsyncError(async (req, res, next) => {
  try {
    const feedbacks = await FeedbackModel.find();
    res.status(200).json({
      success: true,
      count: feedbacks.length,
      data: feedbacks,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to fetch feedbacks", 500));
  }
});

// Get specific feedback by ID
export const getFeedbackByID = catchAsyncError(async (req, res, next) => {
  try {
    const { feedbackID } = req.params;
    const feedback = await FeedbackModel.findById(feedbackID);

    if (!feedback) {
      return next(new ErrorHandler("Feedback not found", 404));
    }

    res.status(200).json({
      success: true,
      data: feedback,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to fetch feedback", 500));
  }
});

// Get all feedback by current user
export const getFeedbackByCurrentUser = catchAsyncError(
  async (req, res, next) => {
    try {
      const currentUser = req?.user?._id;
      const feedbacks = await FeedbackModel.find({ storeID: currentUser })
        .populate("_id")
        .populate("storeID")
        .populate("ratedByID")
        .populate("requestID")
        .populate("feedbackDescription")
        .populate("feedbackRating");

      if (!feedbacks.length) {
        return res
          .status(404)
          .json({ message: "No feedbacks associated with this user" });
      }
      res.status(200).json({
        success: true,
        count: feedbacks.length,
        data: feedbacks,
      });
    } catch (error) {
      next(new ErrorHandler(error.message || "Unable to fetch feedbacks", 500));
    }
  }
);

// Create a feedback
export const createFeedback = catchAsyncError(async (req, res, next) => {
  try {
    const {
      storeID,
      ratedByID,
      requestID,
      feedbackDescription,
      feedbackRating,
    } = req.body;

    const newFeedback = await FeedbackModel.create({
      storeID,
      ratedByID,
      requestID,
      feedbackDescription,
      feedbackRating,
    });

    res.status(200).json({
      success: true,
      message: "New feedback recorded successfully",
      newFeedback,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to create feedback", 400)
    );
  }
});

// Update a feedback
export const updateFeedback = catchAsyncError(async (req, res, next) => {
  try {
    const { feedbackID } = req.params;
    const updatedFeedback = await FeedbackModel.findByIdAndUpdate(
      feedbackID,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedFeedback) {
      return next(new ErrorHandler("Feedback not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Feedback updated successfully",
      data: updatedFeedback,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to update feedback", 500));
  }
});

// Update the request to have the feedbackID
export const addFeedbackToRequest = catchAsyncError(async (req, res, next) => {
  try {
    const currentUserID = req?.user?._id;
    const { requestID } = req.params;
    console.log(currentUserID);
    console.log(requestID);
    const currentRequest = await RequestModel.findById(requestID);
    console.log(currentRequest);
    const { storeID } = currentRequest;
    const { feedbackDescription, feedbackRating } = req.body;
    const newFeedback = await FeedbackModel.create({
      storeID: storeID,
      ratedByID: currentUserID,
      requestID: requestID,
      feedbackDescription: feedbackDescription,
      feedbackRating: feedbackRating,
    });

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestID,
      { feedbackID: newFeedback._id },
      { new: true }
    ).populate("feedbackID");

    if (!updatedRequest) {
      return res.status(404).json({ message: "Feedback not found" });
    }

    res.status(200).json({
      success: true,
      message: "New feedback recorded successfully",
      newFeedback,
    });
  } catch (error) {
    next(
      new ErrorHandler(error.message || "Error adding feedback to request", 500)
    );
  }
});

// Delete a feedback
export const deleteFeedback = catchAsyncError(async (req, res, next) => {
  try {
    const { feedbackID } = req.params;
    const deletedFeedback = await FeedbackModel.findByIdAndDelete(feedbackID);

    if (!deletedFeedback) {
      return next(new ErrorHandler("Feedback not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Feedback deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to delete feedback", 500));
  }
});
