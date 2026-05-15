const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const http = require("http");
const socketIO = require("socket.io");
const jwt = require("jsonwebtoken");

// IMPORTANT: load .env before importing routes/controllers
dotenv.config();

const connectDB = require("./config/db");

const authRoutes = require("./routes/authRoutes");
const adminRoutes = require("./routes/adminRoutes");
const officerRoutes = require("./routes/officerRoutes");
const farmerRoutes = require("./routes/farmerRoutes");
const soilTestRoutes = require("./routes/soilTestRoutes");
const chatbotRoute = require("./routes/chatbotRoute");
const messageRoutes = require("./routes/messageRoutes");
const articleRoutes = require("./routes/articleRoutes");
const leafRoutes = require("./routes/leafRoutes");

connectDB();

const app = express();
const server = http.createServer(app);

const io = socketIO(server, {
  cors: {
    origin: process.env.CLIENT_URL || "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

// Make io accessible to routes/controllers
app.set("io", io);

app.use(cors());
app.use(express.json());

// Socket.IO authentication middleware
io.use((socket, next) => {
  const token = socket.handshake.auth.token;

  if (!token) {
    return next(new Error("No token provided"));
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "your_jwt_secret");
    socket.user = decoded;
    socket.userId = decoded._id || decoded.id;
    socket.role = decoded.role;
    socket.province = decoded.province;
    socket.district = decoded.district;
    socket.name = `${decoded.firstName || ""} ${decoded.lastName || ""}`.trim();
    next();
  } catch (err) {
    next(new Error("Invalid token"));
  }
});

io.on("connection", (socket) => {
  if (socket.role === "officer") {
    socket.join(`officer:province:${socket.province}`);
    socket.join(`officer:${socket.userId}`);
  } else if (socket.role === "farmer") {
    socket.join(`farmer:${socket.userId}`);
  }
});

app.use("/api", chatbotRoute);
app.use("/api/auth", authRoutes);
app.use("/api/articles", articleRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/messages", messageRoutes);
app.use("/api/officer", officerRoutes);
app.use("/api/farmer", farmerRoutes);
app.use("/api/soil-tests", soilTestRoutes);
app.use("/api/leaf", leafRoutes);

app.get("/", (req, res) => {
  res.send("Agri Connect API is running");
});

const PORT = process.env.PORT || 5001;

server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});