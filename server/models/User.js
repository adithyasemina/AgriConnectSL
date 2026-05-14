const mongoose = require("mongoose");

const userSchema = new mongoose.Schema(
  {
    firstName: { type: String, required: true, trim: true },
    lastName: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true, trim: true },
    password: { type: String, required: true },

    role: {
      type: String,
      enum: ["farmer", "officer", "admin"],
      default: "farmer",
    },

    province: {
      type: String,
      required: function () {
        return this.role === "farmer" || this.role === "officer";
      },
      trim: true,
    },

    district: {
      type: String,
      required: function () {
        return this.role === "farmer" || this.role === "officer";
      },
      trim: true,
    },

    isActive: { type: Boolean, default: true },
    isBlocked: { type: Boolean, default: false },
    blockedReason: { type: String, default: "" },
    blockedAt: { type: Date, default: null },
    blockedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);