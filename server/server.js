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

async function scoreMessage(msg) {
  const response = await fetch(
    "https://api-inference.huggingface.co/models/google/flan-t5-small",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${process.env.HF_API_KEY}`
      },
      body: JSON.stringify({
        inputs: `
You are a friendly AI judge for a teen-safe game.
Score the message from 0 to 10 based on:
- creativity
- humor
- dramatic flair
- exaggeration
- playful energy

Message: "${msg}"

Respond ONLY with a number from 0 to 10.
`
      })
    }
  );

  const data = await response.json();
  const text = data?.[0]?.generated_text || "0";
  const score = parseInt(text);

  if (isNaN(score)) return 0;
  return Math.max(0, Math.min(score, 10));
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
