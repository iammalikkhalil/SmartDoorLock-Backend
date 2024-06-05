import mongoose from 'mongoose';

const userSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
    },
    name: {
      type: String,
      required: true,
    },
    avatar: {
      type: String,
      required: true,
    },
    cnic: {
      type: String,
      required: true,
    },
    cell1: {
      type: String,
      required: true,
    },
    cell2: {
      type: String,
    },
    address: {
      type: String,
      required: true,
    },
    otp: {
      type: String,
    },
    status: {
      type: String,
      enum: ["active", "inactive", "unverified"],
      default: 'unverified',
    },
    role: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "role",
      required: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("user", userSchema);