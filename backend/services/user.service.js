import UserModel from "../models/user.model.js";

export const getUserById = async (id, res) => {
  const user = await UserModel.findById(id)
    .populate({
      path: "serviceLogID",
      populate: { path: "jobID", select: "jobName" },
    })
    .populate({
      path: "serviceLogID",
      populate: { path: "serviceID", select: "serviceName" },
    })
    .populate("acceptedServicesID")
    .populate("serviceID");

  if (user) {
    res.status(200).json({
      success: true,
      user,
    });
  }
};
