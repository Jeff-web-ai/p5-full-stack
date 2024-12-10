import JobModel from "../models/job.model.js";
import UserModel from "../models/user.model.js";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";

// add new job
export const addJob = catchAsyncError(async (req, res, next) => {
  try {
    const { jobName, jobDescription, serviceID } = req.body;

    if (!jobName || !jobDescription) {
      return next(new ErrorHandler("Name and description are required", 400));
    }

    const newJob = await JobModel.create({
      jobName,
      jobDescription,
      serviceID,
    });

    res.status(201).json({
      success: true,
      message: "New job is successfully created",
      newJob,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all jobs
export const getAllJobs = catchAsyncError(async (req, res, next) => {
  try {
    const jobs = await JobModel.find().populate("serviceID");

    if (jobs.length === 0) {
      return res.status(200).json({
        success: true,
        message: "No jobs found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Jobs are successfully retrieved",
      jobs,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get single Job -- only for admin
export const getSingleJob = catchAsyncError(async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await JobModel.findById(jobId).populate("serviceID");

    if (!job) {
      return next(new ErrorHandler("Job not found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Job successfully retrieved",
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update Job -- only for admin
export const updateJob = catchAsyncError(async (req, res, next) => {
  try {
    const { jobId } = req.params;

    const { jobName, jobDescription, serviceID } = req.body;

    const updatedJob = {
      jobName,
      jobDescription,
      serviceID,
    };

    const job = await JobModel.findByIdAndUpdate(jobId, updatedJob, {
      new: true,
      runValidators: true,
    });

    if (!job) {
      return next(new ErrorHandler("No job found", 404));
    }

    res.status(200).send({
      success: true,
      message: "Job is successfully updated",
      job,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Delete Job only for admin
export const deleteJob = catchAsyncError(async (req, res, next) => {
  try {
    const jobId = req.params.id;

    const job = await JobModel.findByIdAndDelete(jobId);

    if (!job) {
      return next(new ErrorHandler("No job found", 404));
    }

    res.status(200).json({
      success: true,
      message: "Job is successfully deleted",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
