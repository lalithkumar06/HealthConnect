const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const app = express();
const mongoose = require('mongoose');
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:5173",
    methods: ["GET", "POST"],
  },
});
require("dotenv").config();
const bodyParser = require("body-parser");
const authRouter = require("./Routers/authrouter");
const protrouter = require("./Routers/protrouter");
const cors = require("cors");
const PORT = process.env.PORT || 3000;
require("./Models/database");

const URL = process.env.URL;
mongoose.connect(URL, {
  useUnifiedTopology: true,
});

//middleware
app.use(bodyParser());
app.use(cors());
app.use("/auth", authRouter);

io.on("connection", (socket) => {
  console.log(`Socket connected: ${socket.id}`);

  socket.on("join-room", async ({ roomId, userId }) => {
    try {
      const slot = await Slot.findOne({ userId });

      if (!slot) {
        socket.emit("join-denied", "No slot found");
        return;
      }

      const now = new Date();
      const slotTime = slot.time;

      const today = new Date();
      const [time, modifier] = slotTime.split(" ");
      let [hours, minutes] = time.split(":").map(Number);

      if (modifier === "PM" && hours < 12) hours += 12;
      if (modifier === "AM" && hours === 12) hours = 0;

      const start = new Date(today);
      start.setHours(hours, minutes, 0, 0);

      const end = new Date(start.getTime() + 15 * 60000);

      if (now >= start && now <= end) {
        socket.join(roomId);
        console.log(`User ${userId} (${socket.id}) joined room ${roomId}`);

        socket.to(roomId).emit("user-joined", socket.id);

        socket.roomId = roomId;
      } else {
        socket.emit("join-denied", "Slot time invalid");
      }
    } catch (err) {
      console.error(err);
      socket.emit("join-denied", "Internal server error");
    }
  });

  socket.on("offer", ({ sdp, to }) => {
    io.to(to).emit("offer", { sdp, from: socket.id });
  });

  socket.on("answer", ({ sdp, to }) => {
    io.to(to).emit("answer", { sdp, from: socket.id });
  });
  socket.on("ice-candidate", ({ candidate, to }) => {
    io.to(to).emit("ice-candidate", { candidate, from: socket.id });
  });

  socket.on("disconnect", () => {
    const roomId = socket.roomId;
    if (roomId) {
      socket.to(roomId).emit("user-disconnected", socket.id);
      console.log(`User ${socket.id} disconnected from room ${roomId}`);
    }
  });
});

//resetting slots every day
const setupSlotResetJob = require("./slotReset");
setupSlotResetJob();

//protected - routes
app.use("/protected", protrouter);
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
