import express from "express";
import {
  addService,
  getAllServices,
  getSingleService,
  updateService,
  deleteService,
} from "../controllers/service.controller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const serviceRouter = express.Router();

serviceRouter.post(
  "/add-service",
  isAuthenticated,
  authorizeRoles("super_admin"),
  addService
);

serviceRouter.get("/get-all-services", isAuthenticated, getAllServices);

serviceRouter.get(
  "/get-single-service/:id",
  isAuthenticated,
  authorizeRoles("super_admin"),
  getSingleService
);

serviceRouter.put(
  "/update-service/:id",
  isAuthenticated,
  authorizeRoles("super_admin"),
  updateService
);

serviceRouter.delete(
  "/delete-service/:id",
  isAuthenticated,
  authorizeRoles("super_admin"),
  deleteService
);

export default serviceRouter;
