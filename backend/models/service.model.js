import mongoose from "mongoose";

const serviceSchema = new mongoose.Schema({
  serviceName: {
    type: String,
    required: true,
  },
  storeID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  ],
  jobID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Job",
    },
  ],
});

const ServiceModel = mongoose.model("Service", serviceSchema);

export default ServiceModel;
