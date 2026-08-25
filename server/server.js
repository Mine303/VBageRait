const express = require("express");
const http = require("http");
const { Server } = require("socket.io");

const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"]
  }
});

// Simple safe scoring
function scoreMessage(msg) {
  let score = 0;

  if (msg.length > 20) score += 1;
  if (/[!?]/.test(msg)) score += 1;
  if (msg.toLowerCase().includes("wow")) score += 1;
  if (msg.toLowerCase().includes("bro")) score += 1;
  if (msg.toLowerCase().includes("no way")) score += 1;

  return score;
}

io.on("connection", (socket) => {
  console.log("Player connected:", socket.id);

  socket.on("joinRoom", (room) => {
    socket.join(room);
    io.to(room).emit("systemMessage", `Player ${socket.id} joined ${room}`);
  });

  socket.on("chatMessage", ({ room, message }) => {
    io.to(room).emit("chatMessage", {
      id: socket.id,
      message
    });
  });

  socket.on("typing", (room) => {
    socket.to(room).emit("typing", socket.id);
  });

  socket.on("battleMessage", ({ room, message }) => {
    io.to(room).emit("battleMessage", {
      id: socket.id,
      message
    });

    const score = scoreMessage(message);
    io.to(room).emit("battleScore", score);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
