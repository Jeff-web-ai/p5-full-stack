import jwt from "jsonwebtoken";
import { catchAsyncError } from "../middlewares/catchAsyncErrors.js";
import ErrorHandler from "../utils/ErrorHandler.js";
import UserModel from "../models/user.model.js";
import cloudinary from "../utils/cloudinary.js";
import {
  accessTokenOptions,
  refreshTokenOptions,
  sendToken,
} from "../utils/jwt.js";
// import { getCompletedRequests } from "./request.controller.js";
import { getUserById } from "../services/user.service.js";
import { getAllCompletedReq } from "../services/completed.req.service.js";

// Register new user
export const addUserByRole = catchAsyncError(async (req, res, next) => {
  try {
    const { name, email, contactNumber, password, role, address, serviceID } =
      req.body;

    if ((!name || !email || !contactNumber || !password || !address, !role)) {
      return next(new ErrorHandler("One of the required fields is empty", 400));
    }

    const userExists = await UserModel.findOne({ email });
    if (userExists) {
      return next(new ErrorHandler("Email already exists", 400));
    }

    let userAvatar;
    if (req.file) {
      const myCloud = await cloudinary.uploader.upload(req.file.path, {
        folder: "User",
      });

      userAvatar = {
        public_id: myCloud.public_id,
        url: myCloud.secure_url,
      };
    }

    const newUser = await UserModel.create({
      name,
      email,
      password,
      contactNumber,
      avatar: userAvatar,
      role,
      serviceID,
    });

    res.status(201).json({
      success: true,
      message: "New user registered successfully",
      newUser,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Register for a non-user
export const customerRegistration = catchAsyncError(async (req, res, next) => {
  const { name, email, contactNumber, password, address } = req.body;

  if (!name || !email || !contactNumber || !password || !address) {
    return next(new ErrorHandler("All fields are required", 400));
  }

  const userExists = await UserModel.findOne({ email });
  if (userExists) {
    return next(new ErrorHandler("Email already exists", 400));
  }

  let userAvatar;
  if (req.file) {
    const myCloud = await cloudinary.uploader.upload(req.file.path, {
      folder: "User",
    });

    userAvatar = {
      public_id: myCloud.public_id,
      url: myCloud.secure_url,
    };
  }

  const newUser = await UserModel.create({
    name,
    email,
    password,
    contactNumber,
    address,
    avatar: userAvatar,
    role: "customer",
  });

  res.status(201).json({
    success: true,
    message: `Account created`,
    newUser,
  });
});

// Login User
export const loginUser = catchAsyncError(async (req, res, next) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return new ErrorHandler("Please enter email and password", 400);
    }

    const user = await UserModel.findOne({ email }).select("+password");
    if (!user) {
      return next(new ErrorHandler(`No user with the email of ${email}`));
    }

    const isPasswordMatch = await user.comparePassword(password);
    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid email or password", 400));
    }

    sendToken(user, 200, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// logout user
export const logoutUser = catchAsyncError(async (req, res, next) => {
  try {
    res.cookie("access_token", "", { maxAge: 1 });
    res.cookie("refresh_token", "", { maxAge: 1 });

    const userId = req.user._id;

    res.status(200).json({
      success: true,
      message: "Logged out successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Update access token
export const updateAccessToken = catchAsyncError(async (req, res, next) => {
  try {
    const refresh_token = req.cookies.refresh_token;

    const message = "Could not refresh token";

    const decoded = jwt.verify(refresh_token, process.env.REFRESH_TOKEN);

    if (!decoded) {
      return next(new ErrorHandler(message, 400));
    }

    const user = await UserModel.findById(decoded.id);

    if (!user) {
      return next(
        new ErrorHandler("Please login to access this resource", 400)
      );
    }

    const accessToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.ACCESS_TOKEN,
      {
        expiresIn: `${process.env.ACCESS_TOKEN_EXPIRE}h`,
      }
    );
    const refreshToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.REFRESH_TOKEN,
      {
        expiresIn: `${process.env.REFRESH_TOKEN_EXPIRE}`,
      }
    );

    req.user = user;

    res.cookie("access_token", accessToken, accessTokenOptions);
    res.cookie("refresh_token", refreshToken, refreshTokenOptions);

    res.status(200).json({
      success: true,
      accessToken,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get user info
export const getUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req.user._id;
    // getAllCompletedReq(userId, res);
    getUserById(userId, res);
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all customer -- only for admin
export const getCustomers = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req?.user?._id;

    if (!userId) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }

    const user = await UserModel.findById(userId);

    if (user.role !== "super_admin") {
      return next(
        new ErrorHandler(
          `${user.role} role is not allowed to access this resource`,
          400
        )
      );
    }

    const customers = await UserModel.find({ role: "customer" }).populate(
      "serviceLogID"
    );

    res.status(200).json({
      success: true,
      customers,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get all store Owner -- only for admin
export const getStoreOwners = catchAsyncError(async (req, res, next) => {
  try {
    const userId = req?.user?._id;

    if (!userId) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }

    const user = await UserModel.findById(userId);

    if (user.role !== "super_admin") {
      return next(
        new ErrorHandler(
          `${user.role} role is not allowed to access this resource`,
          400
        )
      );
    }

    const storeOwners = await UserModel.find({ role: "store_owner" })
      .populate("serviceLogID")
      .populate("serviceID")
      .populate("acceptedServicesID");

    res.status(200).json({
      success: true,
      storeOwners,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get single user Info -- only for Admin
export const getSingleUserInfo = catchAsyncError(async (req, res, next) => {
  try {
    const { userId } = req.params;

    const userInfo = await UserModel.findById(userId)
      .populate("serviceLogID")
      .populate("serviceID")
      .populate("acceptedServicesID");

    if (!userInfo) {
      return next(new ErrorHandler("No user found", 404));
    }

    res.status(200).json({
      success: true,
      userInfo,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// Get user info
export const updateUserInfo = catchAsyncError(async (req, res, next) => {
  const currentUserID = req?.user?._id;
  const updateData = req.body;

  try {
    // Validate input to prevent sensitive field updates
    const restrictedFields = ["role"];
    for (const field of Object.keys(updateData)) {
      if (restrictedFields.includes(field)) {
        return res.status(400).json({
          success: false,
          message: `Cannot update restricted field: ${field}`,
        });
      }
    }

    // Find the user and update the fields
    const updatedUser = await UserModel.findByIdAndUpdate(
      currentUserID,
      { $set: updateData },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "User updated successfully",
      user: updatedUser,
    });
  } catch (error) {
    next(new ErrorHandler(error.message || "Unable to update user", 500));
  }
});

// Update user password
export const updateUserPassword = catchAsyncError(async (req, res, next) => {
  try {
    const { oldPassword, newPassword } = req.body;

    const userId = req.user._id;

    if (!oldPassword && !newPassword) {
      return next(new ErrorHandler("Please enter old or new password", 400));
    }

    if (oldPassword === newPassword) {
      return next(
        new ErrorHandler(
          "You entered an old password, please enter something unique",
          400
        )
      );
    }

    const user = await UserModel.findById(userId).select("+password");

    if (user?.password === undefined) {
      return next(new ErrorHandler("Invalid User", 400));
    }

    const isPasswordMatch = await user?.comparePassword(oldPassword);

    if (!isPasswordMatch) {
      return next(new ErrorHandler("Invalid Old Password", 400));
    }

    user.password = newPassword;

    await user?.save();

    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});

// delete user -- only for admin
export const deleteUser = catchAsyncError(async (req, res, next) => {
  try {
    const { userId } = req.params;

    if (!userId) {
      return next(new ErrorHandler("Invalid user ID", 400));
    }

    const user = await UserModel.findByIdAndDelete(userId);

    if (!user) {
      return next(new ErrorHandler("Something went wrong!", 400));
    }

    res.status(200).json({
      success: true,
      message: "User deleted successfully",
    });
  } catch (error) {
    return next(new ErrorHandler(error.message, 400));
  }
});
