import { catchAsyncError } from "./catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import jwt from "jsonwebtoken";
import userModel from "../models/user.model.js";

// Authenticated Users
export const isAuthenticated = catchAsyncError(async (req, res, next) => {
  const authHeader = req.headers.authorization;

  if (!authHeader || !authHeader.startsWith("Bearer ")) {
    return next(new ErrorHandler("Please login to access this resource", 400));
  }

  const token = authHeader.split(" ")[1];

  const decoded = jwt.verify(token, process.env.ACCESS_TOKEN);

  if (!decoded) {
    return next(
      new ErrorHandler("Access token is not valid. Please try again.", 400)
    );
  }

  const user = await userModel.findById(decoded.id);

  req.user = user;

  next();
});

// Validate user roles
export const authorizeRoles = (...roles) => {
  return (req, res, next) => {
    if (!roles.includes(req.user?.role || "")) {
      return next(
        new ErrorHandler(
          `Role: ${req.user?.role} is not allowed to access this resource`,
          404
        )
      );
    }
    next();
  };
};
