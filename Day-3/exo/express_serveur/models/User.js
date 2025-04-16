import { Schema, model } from "mongoose";

const userSchema = new Schema({
  email: {
    type: String,
    require: true,
    unique: true,
  },
  password: String,
  isAdmin: {
    type: Boolean,
    default: false,
  },
  created_at: {
    type: Date,
    default: Date.now,
  },
});

export const User = model("User", userSchema);
