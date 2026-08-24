async function loadComponent(name) {
  const html = await fetch(`/components/${name}.html`).then(r => r.text());
  document.getElementById("app").innerHTML = html;
}

let socket;
let currentRoom = null;

// Start at main menu
loadComponent("main-menu");

document.addEventListener("click", (e) => {

  // MAIN MENU
  if (e.target.id === "singleplayerBtn") {
    loadComponent("game");
    document.getElementById("battle-log").innerHTML =
      "<p>Singleplayer mode coming soon!</p>";
  }

  if (e.target.id === "multiplayerBtn") {
    loadComponent("room-select");
  }

  // ROOM SELECT
  if (e.target.id === "joinBtn") {
    const room = document.getElementById("roomInput").value.trim();
    if (!room) return;

    currentRoom = room;

    socket = io("https://vbagerait.onrender.com");
    socket.emit("joinRoom", room);

    loadComponent("chat");

    socket.on("systemMessage", (msg) => addMessage("SYSTEM", msg));
    socket.on("chatMessage", (data) => addMessage(data.id, data.message));
    socket.on("typing", (id) => showTyping(id));
    socket.on("battleMessage", (data) => addBattle(data.id, data.message));
    socket.on("battleScore", (score) => {
      document.getElementById("scoreDisplay").innerText = `Score: ${score}`;
    });
  }

  if (e.target.id === "backToMenu") {
    loadComponent("main-menu");
  }

  // CHAT
  if (e.target.id === "sendBtn") {
    const msg = document.getElementById("msgInput").value.trim();
    if (!msg) return;

    socket.emit("chatMessage", {
      room: currentRoom,
      message: msg
    });

    document.getElementById("msgInput").value = "";
  }

  if (e.target.id === "goToGame") {
    loadComponent("game");
  }

  // GAME
  if (e.target.id === "sendBattleBtn") {
    const msg = document.getElementById("battleInput").value.trim();
    if (!msg) return;

    socket.emit("battleMessage", {
      room: currentRoom,
      message: msg
    });

    document.getElementById("battleInput").value = "";
  }

  if (e.target.id === "backToChat") {
    loadComponent("chat");
  }
});

// Typing indicator
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

function addBattle(id, msg) {
  const box = document.getElementById("battle-log");
  const div = document.createElement("div");
  div.innerText = `${id}: ${msg}`;
  box.appendChild(div);
}

function showTyping(id) {
  const t = document.getElementById("typing");
  t.innerText = `${id} is typing...`;
  setTimeout(() => t.innerText = "", 800);
}
