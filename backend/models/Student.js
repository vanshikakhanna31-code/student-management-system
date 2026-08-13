const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema(
  {
    studentId: {
      type: String,
      required: true,
      unique: true,
      trim: true
    },
    name: {
      type: String,
      required: true,
      trim: true
    },
    email: {
      type: String,
      required: true,
      trim: true,
      lowercase: true
    },
    phone: {
      type: String,
      required: true,
      trim: true
    },
    dob: {
      type: String,
      required: true
    },
    gender: {
      type: String,
      required: true,
      enum: ["Male", "Female", "Other"]
    },
    course: {
      type: String,
      required: true,
      trim: true
    },
    department: {
      type: String,
      required: true,
      trim: true
    },
    semester: {
      type: String,
      required: true
    },
    address: {
      type: String,
      required: true,
      trim: true
    }
  },
  { timestamps: true }
);

module.exports = mongoose.model("Student", studentSchema);
