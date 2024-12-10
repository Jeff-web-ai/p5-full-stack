import ServiceModel from "../models/service.model.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// add new Service -- admin only
export const addService = catchAsyncError(async (req, res, next) => {
  try {
    const { serviceName, storeID, jobID } = req.body;

    if (!serviceName) {
      return next(new ErrorHandler("Service name is required", 400));
    }

    const newService = await ServiceModel.create({
      serviceName,
      storeID,
      jobID,
    });

    res.status(201).json({
      success: true,
      message: "New service is successfully created",
      newService,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all Service
export const getAllServices = catchAsyncError(async (req, res, next) => {
  try {
    const services = await ServiceModel.find()
      .populate("storeID")
      .populate("jobID");

    if (services.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No services found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Services are successfully retrieved",
      count: services.length,
      services,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get Single service -- only for admin
export const getSingleService = catchAsyncError(async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const service = await ServiceModel.findById(serviceId)
      .populate("storeID")
      .populate("jobID");

    if (!service) {
      return next(new ErrorHandler("Job not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Service successfully retrieved",
      service,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update Service -- only for admin
export const updateService = catchAsyncError(async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const { serviceName, storeID, jobID } = req.body;

    const updatedJob = {
      serviceName,
      storeID,
      jobID,
    };

    const service = await ServiceModel.findByIdAndUpdate(
      serviceId,
      updatedJob,
      {
        new: true,
        runValidators: true,
      }
    );

    if (!service) {
      return next(new ErrorHandler("No job found", 404));
    }

    res.status(200).send({
      success: true,
      message: "Service is successfully updated",
      service,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Delete Service only for admin
export const deleteService = catchAsyncError(async (req, res, next) => {
  try {
    const serviceId = req.params.id;

    const service = await ServiceModel.findByIdAndDelete(serviceId);

    if (!service) {
      return next(new ErrorHandler("No service found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Service is successfully deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
