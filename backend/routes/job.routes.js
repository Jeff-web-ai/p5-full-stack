import express from "express";
import {
  addJob,
  getAllJobs,
  getSingleJob,
  updateJob,
  deleteJob,
} from "../controllers/job.contoller.js";
import { isAuthenticated, authorizeRoles } from "../middlewares/auth.js";

const jobRouter = express.Router();

jobRouter.post(
  "/add-job",
  isAuthenticated,
  authorizeRoles("super_admin"),
  addJob
);

jobRouter.get("/get-all-jobs", isAuthenticated, getAllJobs);

jobRouter.get(
  "/get-single-job/:id",
  isAuthenticated,
  authorizeRoles("super_admin"),
  getSingleJob
);

jobRouter.put(
  "/update-job/:jobId",
  isAuthenticated,
  authorizeRoles("super_admin"),
  updateJob
);

jobRouter.delete(
  "/delete-job/:id",
  isAuthenticated,
  authorizeRoles("super_admin"),
  deleteJob
);

export default jobRouter;
