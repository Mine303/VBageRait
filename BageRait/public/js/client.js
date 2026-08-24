let socket;
let currentRoom = null;

document.getElementById("joinBtn").onclick = () => {
  const room = document.getElementById("roomInput").value.trim();
  if (!room) return;

  currentRoom = room;

  socket = io("https://YOUR-SERVER.onrender.com");

  socket.emit("joinRoom", room);

  document.getElementById("room-select").style.display = "none";
  document.getElementById("chat").style.display = "block";

  socket.on("systemMessage", (msg) => {
    addMessage("SYSTEM", msg);
  });

  socket.on("chatMessage", (data) => {
    addMessage(data.id, data.message);
  });

  socket.on("typing", (id) => {
    document.getElementById("typing").innerText = `${id} is typing...`;
    setTimeout(() => {
      document.getElementById("typing").innerText = "";
    }, 1000);
  });
};

document.getElementById("sendBtn").onclick = () => {
  const msg = document.getElementById("msgInput").value.trim();
  if (!msg) return;

  socket.emit("chatMessage", {
    room: currentRoom,
    message: msg
  });

  document.getElementById("msgInput").value = "";
};

document.getElementById("msgInput").oninput = () => {
  if (socket && currentRoom) {
    socket.emit("typing", currentRoom);
  }
};

function addMessage(id, msg) {
  const box = document.getElementById("messages");
  const div = document.createElement("div");
  div.innerText = `${id}: ${msg}`;
  box.appendChild(div);
}
