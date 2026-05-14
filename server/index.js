const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// IMPORTANT: load .env before importing routes/controllers
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const officerRoutes = require("./routes/officerRoutes");
const soilTestRoutes = require("./routes/soilTestRoutes");
const chatbotRoute = require("./routes/chatbotRoute");
const messageRoutes = require("./routes/messageRoutes");
const articleRoutes = require("./routes/articleRoutes");
const leafRoutes = require("./routes/leafRoutes");

connectDB();

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api", chatbotRoute);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/soil-tests", soilTestRoutes);
app.use("/api/leaf", leafRoutes);

app.get("/", (req, res) => {
  res.send("Agri Connect API is running");
});

const PORT = process.env.PORT || 5001;

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});