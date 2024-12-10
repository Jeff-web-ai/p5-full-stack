import mongoose from "mongoose";

const requestSchema = new mongoose.Schema(
  {
    requestorID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    storeID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    feedbackID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Feedback",
    },
    serviceID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
    jobID: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
    fullName: {
      type: String,
      require: true,
    },
    email: {
      type: String,
      require: true,
    },
    contactNumber: {
      type: String,
      require: true,
    },
    landmark: {
      type: String,
      require: true,
    },
    address: {
      type: String,
      require: true,
    },
    date: {
      type: String,
      require: true,
    },
    problemDetails: {
      type: String,
      require: true,
    },
    images: {
      public_id: {
        type: String,
      },
      url: {
        type: String,
      },
    },
    status: {
      type: String,
      enum: ["Open", "In-progress", "Resolved"],
      default: "Open",
      require: true,
    },
  },
  { timestamps: true }
);

const RequestModel = mongoose.model("Request", requestSchema);
export default RequestModel;
