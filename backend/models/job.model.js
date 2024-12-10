import mongoose from "mongoose";

const jobSchema = new mongoose.Schema({
  jobName: {
    type: String,
    required: true,
  },
  jobDescription: {
    type: String,
    required: true,
  },
  serviceID: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
    },
  ],
});

const JobModel = mongoose.model("Job", jobSchema);

export default JobModel;
