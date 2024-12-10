import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema({
  storeID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  ratedByID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    require: true,
  },
  requestID: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Request",
    require: true,
  },
  feedbackDescription: {
    type: String,
    require: true,
  },
  feedbackRating: {
    type: Number,
    require: true,
  },
});

const FeedbackModel = mongoose.model("Feedback", feedbackSchema);
export default FeedbackModel;
