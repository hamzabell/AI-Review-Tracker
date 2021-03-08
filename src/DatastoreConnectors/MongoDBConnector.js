import mongoose from "mongoose";
import { ReviewSchema } from "../DBSchemas/client";

export default async (connectionString) => {
  const connection = await mongoose.createConnection(connectionString);

  const ReviewsModel = connection.model("Review", ReviewSchema);

  return {
    createReview: async (data) => {
      const review = await ReviewsModel.create(data);
      return review;
    },
    getAll: async () => {
      const reviews = await ReviewsModel.find();
      return reviews;
    },
  };
};
