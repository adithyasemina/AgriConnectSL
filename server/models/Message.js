const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema(
  {
    farmerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    farmerName: { type: String, required: true },
    farmerEmail: { type: String, required: true },
    province: { type: String, required: true },
    district: { type: String, required: true },

    status: { type: String, enum: ["open", "done"], default: "open" },

    assignedOfficerId: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    assignedOfficerName: { type: String, default: "" },
    assignedAt: { type: Date, default: null },

    messages: [
      {
        senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
        senderName: { type: String, default: "" },
        senderRole: { type: String, enum: ["farmer", "officer"], required: true },
        text: { type: String, required: true, trim: true },
        createdAt: { type: Date, default: Date.now },
      },
    ],

    closedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    closedAt: { type: Date, default: null },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Message", messageSchema);