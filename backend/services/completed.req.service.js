import UserModel from "../models/user.model.js";
import RequestModel from "../models/request.model.js";

export const getAllCompletedReq = async (id, res) => {
  const completedRequests = await UserModel.findById(id).select("serviceLogID");

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
};
