async function loadComponent(name) {
  const html = await fetch(`/components/${name}.html`).then(r => r.text());
  document.getElementById("app").innerHTML = html;
}

let socket;
let currentRoom = null;

loadComponent("room-select");

document.addEventListener("click", (e) => {
  if (e.target.id === "joinBtn") {
    const room = document.getElementById("roomInput").value.trim();
    if (!room) return;

    currentRoom = room;

    socket = io("https://YOUR-SERVER.onrender.com");
    socket.emit("joinRoom", room);

    loadComponent("chat");

    socket.on("systemMessage", (msg) => addMessage("SYSTEM", msg));
    socket.on("chatMessage", (data) => addMessage(data.id, data.message));
    socket.on("typing", (id) => showTyping(id));
  }

  if (e.target.id === "sendBtn") {
    const msg = document.getElementById("msgInput").value.trim();
    if (!msg) return;

    socket.emit("chatMessage", {
      room: currentRoom,
      message: msg
    });

    document.getElementById("msgInput").value = "";
  }
});

document.addEventListener("input", (e) => {
  if (e.target.id === "msgInput" && socket && currentRoom) {
    socket.emit("typing", currentRoom);
  }
});

function addMessage(id, msg) {
  const box = document.getElementById("messages");
  const div = document.createElement("div");
  div.innerText = `${id}: ${msg}`;
  box.appendChild(div);
}

function showTyping(id) {
  const t = document.getElementById("typing");
  t.innerText = `${id} is typing...`;
  setTimeout(() => t.innerText = "", 800);
}
