import mongoose from "mongoose";
export const ReviewSchema = new mongoose.Schema({
  _id: {
    type: String,
  },
  comment: {
    type: String,
    required: true,
  },
  dateAdded: {
    type: Date,
    default: Date.now(),
  },
  source: {
    type: String,
    enum: ["FACEBOOK", "TWITTER", "BOT"],
  },
  sentiment: {
    type: String,
    enum: ["POSITIVE", "NEUTRAL", "NEGATIVE"],
  },
});
