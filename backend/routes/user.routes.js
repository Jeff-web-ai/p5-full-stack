import express from "express";
import {
  addUserByRole,
  customerRegistration,
  loginUser,
  logoutUser,
  updateAccessToken,
  getUserInfo,
  getCustomers,
  getStoreOwners,
  getSingleUserInfo,
  updateUserInfo,
  deleteUser,
  updateUserPassword,
} from "../controllers/user.controller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";
import upload from "../middlewares/multerConfig.js";

const userRouter = express.Router();

userRouter.post(
  "/register",
  upload.single("avatar"),
  isAuthenticated,
  authorizeRoles("super_admin"),
  addUserByRole
);

userRouter.post(
  "/register-non-user",
  upload.single("avatar"),
  customerRegistration
);

userRouter.post("/login", loginUser);

userRouter.get("/logout", isAuthenticated, logoutUser);

userRouter.get("/refresh-token", updateAccessToken);

userRouter.get("/me", isAuthenticated, getUserInfo);

userRouter.get(
  "/get-all-customers",
  isAuthenticated,
  authorizeRoles("super_admin"),
  getCustomers
);

userRouter.get(
  "/get-all-store-owners",
  isAuthenticated,
  authorizeRoles("super_admin"),
  getStoreOwners
);

userRouter.get(
  "/get-user-info/:userId",
  isAuthenticated,
  authorizeRoles("super_admin"),
  getSingleUserInfo
);

userRouter.put("/update-user-info/:userId", isAuthenticated, updateUserInfo);

userRouter.put("/update-user-password", isAuthenticated, updateUserPassword);

userRouter.delete(
  "/delete-user/:userId",
  isAuthenticated,
  authorizeRoles("super_admin"),
  deleteUser
);

export default userRouter;
