import mongoose from "mongoose";
export const DatastoreSchema = new mongoose.Schema({
  _id: {
    type: String,
    required: true,
  },
  datastoreType: {
    type: String,
    enum: ["MONGODB", "COSMOSDB", "SHAREPOINT"],
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
    autopopulate: true,
  },
  mongoConnectionString: {
    type: String,
  },
  cosmosEndpoint: {
    type: String,
  },
  cosmosKey: {
    type: String,
  },
});

DatastoreSchema.plugin(require("mongoose-autopopulate"));
