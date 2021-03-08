import mongoose from "mongoose";
import { nanoid } from "nanoid";
export const UserSchema = new mongoose.Schema({
  _id: {
    type: String,
    default: (_) => nanoid(),
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: {
    type: String,
    required: true,
  },
  role: {
    type: String,
    enum: ["ORG", "ADMIN"],
    required: true,
  },
});
