const express = require("express");
const router = express.Router();

const {
  createFarmerMessage,
  getOfficerMessages,
  getFarmerMessages,
  assignChat,
  replyMessage,
  markChatDone,
} = require("../controllers/messageController");

const { protect } = require("../middleware/authMiddleware");

router.post("/", protect, createFarmerMessage);
router.get("/officer", protect, getOfficerMessages);
router.get("/farmer", protect, getFarmerMessages);
router.patch("/:id/assign", protect, assignChat);
router.post("/:id/reply", protect, replyMessage);
router.patch("/:id/done", protect, markChatDone);

module.exports = router;