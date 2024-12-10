import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import cloudinary from "../utils/cloudinary.js";
import RequestModel from "../models/request.model.js";
import UserModel from "../models/user.model.js";

// Get all requests
export const getRequests = catchAsyncError(async (req, res, next) => {
  try {
    const requests = await RequestModel.find()
      .populate("serviceID")
      .populate("storeID")
      .populate("jobID")
      .populate("feedbackID")
      .populate("requestorID");
    res.status(200).json({
      success: true,
      count: requests.length,
      requests,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to fetch requests", 500));
  }
});

// Get specific request by ID
export const getRequestByID = catchAsyncError(async (req, res, next) => {
  try {
    const { requestID } = req.params;
    const request = await RequestModel.findById(requestID)
      .populate("serviceID")
      .populate("storeID")
      .populate("jobID")
      .populate("feedbackID")
      .populate("requestorID");

    if (!request) {
      return next(new ErrorHandler("Request not found", 404));
    }

    res.status(200).json({
      success: true,
      data: request,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to fetch request", 500));
  }
});

// GET: Get Open Request based on current user.
export const getOpenRequests = catchAsyncError(async (req, res, next) => {
  const currentUserID = req?.user?._id;

  try {
    const userServiceID = await UserModel.findById(currentUserID).select(
      "serviceID"
    );
    if (!userServiceID || !userServiceID.serviceID) {
      return next(
        new ErrorHandler("User does not have a serviceID associated.", 404)
      );
    }
    const serviceID = userServiceID.serviceID;
    const openRequests = await RequestModel.find({
      status: "Open",
      serviceID: serviceID,
    })
      .populate("_id")
      .populate("requestorID")
      .populate("storeID")
      .populate("serviceID")
      .populate("fullName")
      .populate("email")
      .populate("contactNumber")
      .populate("landmark")
      .populate("address")
      .populate("date")
      .populate("problemDetails")
      .populate("images")
      .populate("status");

    res.status(200).json({
      success: true,
      count: openRequests.length,
      requests: openRequests,
    });
  } catch (error) {
    next(
      new ErrorHandler(error.message || "Unable to fetch open requests", 500)
    );
  }
});

// GET: Get all request that is raised by the current user
export const getUserRequests = catchAsyncError(async (req, res, next) => {
  const currentUserID = req?.user?._id;
  try {
    const userRequests = await RequestModel.find({
      status: { $in: ["Open", "In-progress"] },
      requestorID: currentUserID,
    })
      .populate("_id")
      .populate("requestorID")
      .populate("storeID")
      .populate("feedbackID")
      .populate("serviceID")
      .populate("jobID")
      .populate("fullName")
      .populate("email")
      .populate("contactNumber")
      .populate("landmark")
      .populate("address")
      .populate("date")
      .populate("problemDetails")
      .populate("images")
      .populate("status");

    if (!userRequests || userRequests.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No requests found for the current user.",
      });
    }

    res.status(200).json({
      success: true,
      count: userRequests.length,
      requests: userRequests,
    });
  } catch (error) {
    next(
      new ErrorHandler(error.message || "Unable to fetch user requests", 500)
    );
  }
});

// GET: Get all accepted requests
export const getAcceptedRequests = catchAsyncError(async (req, res, next) => {
  const currentUserID = req?.user?._id;
  try {
    const acceptedRequests = await UserModel.findById(currentUserID).select(
      "acceptedServicesID"
    );
    if (!acceptedRequests) {
      return res.status(404).json({
        success: false,
        message: "No requests accepted.",
      });
    }

    const { acceptedServicesID } = acceptedRequests;

    const requests = await RequestModel.find({
      _id: { $in: acceptedServicesID },
    })
      .populate("_id")
      .populate("requestorID")
      .populate("storeID")
      .populate("feedbackID")
      .populate("serviceID")
      .populate("fullName")
      .populate("email")
      .populate("contactNumber")
      .populate("landmark")
      .populate("address")
      .populate("date")
      .populate("problemDetails")
      .populate("images")
      .populate("status");

    res.status(200).json({
      success: true,
      count: acceptedRequests.length,
      requests: requests,
    });
  } catch (error) {
    next(
      new ErrorHandler(
        error.message || "Unable to fetch accepted requests",
        500
      )
    );
  }
});

// GET: Get all completed requests
export const getCompletedRequests = catchAsyncError(async (req, res, next) => {
  const currentUserID = req?.user?._id;
  try {
    const completedRequests = await UserModel.findById(currentUserID).select(
      "serviceLogID"
    );

    if (!completedRequests) {
      return res.status(404).json({
        success: false,
        message: "No completed requests yet",
      });
    }

    const { serviceLogID } = completedRequests;

    const requests = await RequestModel.find({ _id: { $in: serviceLogID } })
      .populate("_id")
      .populate("requestorID")
      .populate("storeID")
      .populate("feedbackID")
      .populate("serviceID")
      .populate("fullName")
      .populate("email")
      .populate("contactNumber")
      .populate("landmark")
      .populate("address")
      .populate("date")
      .populate("problemDetails")
      .populate("images")
      .populate("status");

    res.status(200).json({
      success: true,
      count: completedRequests.length,
      requests: requests,
    });
  } catch (error) {
    next(
      new ErrorHandler(
        error.message || "Unable to fetch completed requests",
        500
      )
    );
  }
});

// Create a request
export const createRequest = catchAsyncError(async (req, res, next) => {
  try {
    const currentUser = await UserModel.findById(req?.user?._id);

    const {
      storeID,
      feedbackID,
      serviceID,
      jobID,
      fullName,
      email,
      contactNumber,
      landmark,
      address,
      date,
      problemDetails,
      status,
    } = req.body;

    let reqImages;

    if (req.file) {
      const myCloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "Request",
      });

      reqImages = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const newRequest = await RequestModel.create({
      requestorID: currentUser._id,
      storeID,
      feedbackID,
      serviceID,
      jobID,
      fullName,
      email,
      contactNumber,
      landmark,
      address,
      date,
      problemDetails,
      images: reqImages,
      status,
    });

    res.status(200).json({
      success: true,
      message: "New request raised successfully",
      newRequest,
    });
  } catch (error) {
    return next(
      new ErrorHandler(error.message || "Failed to create request", 400)
    );
  }
});

// Update a request
export const updateRequest = catchAsyncError(async (req, res, next) => {
  try {
    const { requestID } = req.params;
    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestID,
      req.body,
      { new: true, runValidators: true }
    );

    if (!updatedRequest) {
      return next(new ErrorHandler("Request not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Request updated successfully",
      data: updatedRequest,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to update request", 500));
  }
});

// Accept a request
export const acceptRequest = catchAsyncError(async (req, res, next) => {
  const { requestID } = req.params;
  const currentUserID = req?.user?._id;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserID,
      { $push: { acceptedServicesID: { $each: [requestID] } } },
      { new: true, runValidators: true }
    );

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestID,
      { status: "In-progress", storeID: currentUserID },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Request ${requestID} added under ${currentUserID}`,
      updatedUser,
      updatedRequest,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to accept request", 500));
  }
});

// Complete a request
export const completeRequest = catchAsyncError(async (req, res, next) => {
  const { requestID } = req.params;
  const currentUserID = req?.user?._id;
  try {
    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserID,
      {
        $pull: { acceptedServicesID: requestID },
        $push: { serviceLogID: { $each: [requestID] } },
      },
      { new: true, runValidators: true }
    );

    const updatedRequest = await RequestModel.findByIdAndUpdate(
      requestID,
      { status: "Completed" },
      { storeID: currentUserID },
      { new: true, runValidators: true }
    );
    res.status(200).json({
      success: true,
      message: `Request ${requestID} updated and logged under ${currentUserID}`,
      updatedUser,
      updatedRequest,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to complete request"));
  }
});

// Delete a request
export const deleteRequest = catchAsyncError(async (req, res, next) => {
  try {
    const { requestID } = req.params;
    const deletedRequest = await RequestModel.findByIdAndDelete(requestID);

    if (!deletedRequest) {
      return next(new ErrorHandler("Request not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Request deleted successfully",
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to delete request", 500));
  }
});
