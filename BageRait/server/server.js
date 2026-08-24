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

  socket.on("disconnect", () => {
    console.log("Player disconnected:", socket.id);
  });
});

const PORT = process.env.PORT || 10000;
server.listen(PORT, () => {
  console.log("Server running on port", PORT);
});
