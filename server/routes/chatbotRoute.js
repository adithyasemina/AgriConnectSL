const express = require("express");
const router = express.Router();

router.post("/chatbot", async (req, res) => {
  try {
    const { question } = req.body;

    const response = await fetch("http://127.0.0.1:5000/chatbot", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ question }),
    });

    const data = await response.json();

    return res.status(response.status).json(data);
  } catch (error) {
    return res.status(500).json({
      error: "Failed to connect chatbot service",
      details: error.message,
    });
  }
});

module.exports = router;