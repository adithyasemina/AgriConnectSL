const Message = require("../models/Message");

const getFullName = (user) =>
  `${user.firstName || ""} ${user.lastName || ""}`.trim();

const sortChats = (chats) =>
  chats.sort((a, b) => {
    if (a.status === "open" && b.status === "done") return -1;
    if (a.status === "done" && b.status === "open") return 1;
    return new Date(b.updatedAt) - new Date(a.updatedAt);
  });

exports.createFarmerMessage = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Farmer only" });
    }

    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Message is required" });
    }

    let chat = await Message.findOne({ farmerId: req.user._id });

    if (chat) {
      chat.status = "open";
      chat.closedBy = null;
      chat.closedAt = null;

      chat.assignedOfficerId = null;
      chat.assignedOfficerName = "";
      chat.assignedAt = null;

      chat.messages.push({
        senderId: req.user._id,
        senderName: getFullName(req.user),
        senderRole: "farmer",
        text: text.trim(),
      });

      await chat.save();
    } else {
      chat = await Message.create({
        farmerId: req.user._id,
        farmerName: getFullName(req.user),
        farmerEmail: req.user.email,
        province: req.user.province,
        district: req.user.district,
        status: "open",
        messages: [
          {
            senderId: req.user._id,
            senderName: getFullName(req.user),
            senderRole: "farmer",
            text: text.trim(),
          },
        ],
      });
    }

    // Emit to officers in same province
    const io = req.app.get("io");
    if (io) {
      io.to(`officer:province:${chat.province}`).emit("chat:new-message", {
        chatId: chat._id,
        farmerName: chat.farmerName,
        farmerEmail: chat.farmerEmail,
        province: chat.province,
        district: chat.district,
        status: chat.status,
        lastMessage: chat.messages[chat.messages.length - 1],
        updatedAt: chat.updatedAt,
      });
    }

    return res.status(201).json({
      message: "Message sent successfully",
      chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send message",
      error: error.message,
    });
  }
};

exports.getOfficerMessages = async (req, res) => {
  try {
    if (req.user.role !== "officer") {
      return res.status(403).json({ message: "Officer only" });
    }

    const chats = await Message.find({
      province: req.user.province,
      $or: [
        { status: "done" },
        { assignedOfficerId: null },
        { assignedOfficerId: req.user._id },
      ],
    }).sort({ updatedAt: -1 });

    return res.status(200).json({
      message: "Messages retrieved successfully",
      chats: sortChats(chats),
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve messages",
      error: error.message,
    });
  }
};

exports.getFarmerMessages = async (req, res) => {
  try {
    if (req.user.role !== "farmer") {
      return res.status(403).json({ message: "Farmer only" });
    }

    const chats = await Message.find({ farmerId: req.user._id }).sort({
      updatedAt: -1,
    });

    return res.status(200).json({
      message: "Farmer messages retrieved successfully",
      chats,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to retrieve farmer messages",
      error: error.message,
    });
  }
};

exports.assignChat = async (req, res) => {
  try {
    if (req.user.role !== "officer") {
      return res.status(403).json({ message: "Officer only" });
    }

    const chat = await Message.findOne({
      _id: req.params.id,
      province: req.user.province,
    });

    if (!chat) {
      return res.status(404).json({ message: "Chat not found for your province" });
    }

    if (chat.status === "done") {
      return res.status(400).json({ message: "Done chat cannot be assigned" });
    }

    if (
      chat.assignedOfficerId &&
      chat.assignedOfficerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({ message: "This chat is already assigned" });
    }

    chat.assignedOfficerId = req.user._id;
    chat.assignedOfficerName = getFullName(req.user);
    chat.assignedAt = new Date();

    await chat.save();

    return res.status(200).json({
      message: "Chat assigned successfully",
      chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to assign chat",
      error: error.message,
    });
  }
};

exports.replyMessage = async (req, res) => {
  try {
    const { text } = req.body;

    if (!text || !text.trim()) {
      return res.status(400).json({ message: "Reply message is required" });
    }

    const chat = await Message.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (req.user.role === "officer") {
      if (chat.province !== req.user.province) {
        return res.status(403).json({
          message: "Access denied for this province",
        });
      }

      if (chat.status === "done") {
        chat.status = "open";
        chat.assignedOfficerId = req.user._id;
        chat.assignedOfficerName = getFullName(req.user);
        chat.assignedAt = new Date();
        chat.closedBy = null;
        chat.closedAt = null;
      }

      if (chat.status === "open" && !chat.assignedOfficerId) {
        chat.assignedOfficerId = req.user._id;
        chat.assignedOfficerName = getFullName(req.user);
        chat.assignedAt = new Date();
      }

      if (
        chat.assignedOfficerId &&
        chat.assignedOfficerId.toString() !== req.user._id.toString()
      ) {
        return res.status(403).json({
          message: "This chat is assigned to another officer",
        });
      }
    }

    if (req.user.role === "farmer") {
      if (chat.farmerId.toString() !== req.user._id.toString()) {
        return res.status(403).json({ message: "Access denied" });
      }

      chat.status = "open";
      chat.closedBy = null;
      chat.closedAt = null;
    }

    chat.messages.push({
      senderId: req.user._id,
      senderName: getFullName(req.user),
      senderRole: req.user.role,
      text: text.trim(),
    });

    await chat.save();

    // Emit socket events
    const io = req.app.get("io");
    if (io) {
      // Send to farmer
      io.to(`farmer:${chat.farmerId}`).emit("chat:new-message", {
        chatId: chat._id,
        lastMessage: chat.messages[chat.messages.length - 1],
        status: chat.status,
        assignedOfficerName: chat.assignedOfficerName,
      });

      // Notify province officers about list update
      io.to(`officer:province:${chat.province}`).emit("chat:list-updated", {
        chatId: chat._id,
        status: chat.status,
        assignedOfficerId: chat.assignedOfficerId,
      });
    }

    return res.status(200).json({
      message: "Reply sent successfully",
      chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to send reply",
      error: error.message,
    });
  }
};

exports.markChatDone = async (req, res) => {
  try {
    if (req.user.role !== "officer") {
      return res.status(403).json({ message: "Officer only - farmers cannot mark chat done" });
    }

    const chat = await Message.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "Chat not found" });
    }

    if (chat.province !== req.user.province) {
      return res.status(403).json({
        message: "Access denied for this province",
      });
    }

    if (
      chat.assignedOfficerId &&
      chat.assignedOfficerId.toString() !== req.user._id.toString()
    ) {
      return res.status(403).json({
        message: "Only assigned officer can mark this chat done",
      });
    }

    chat.status = "done";
    chat.assignedOfficerId = null;
    chat.assignedOfficerName = "";
    chat.assignedAt = null;
    chat.closedBy = req.user._id;
    chat.closedAt = new Date();

    await chat.save();

    // Emit socket events
    const io = req.app.get("io");
    if (io) {
      // Notify farmer
      io.to(`farmer:${chat.farmerId}`).emit("chat:done", {
        chatId: chat._id,
        status: "done",
      });

      // Notify province officers about list update
      io.to(`officer:province:${chat.province}`).emit("chat:list-updated", {
        chatId: chat._id,
        status: "done",
      });
    }

    return res.status(200).json({
      message: "Chat marked as done",
      chat,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to mark chat as done",
      error: error.message,
    });
  }
};