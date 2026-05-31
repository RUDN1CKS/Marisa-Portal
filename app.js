// =======================
// FRAGGO APP CORE (FIXED)
// =======================

// ---------- AUTH ----------
function login() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function signup() {
  alert("Hook this into Firebase signup later");
}

function logout() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("app").style.display = "none";
}

// ---------- PAGE SWITCH ----------
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));

  if (page === "chat") document.getElementById("chatPage").classList.remove("hidden");
  if (page === "todo") document.getElementById("todoPage").classList.remove("hidden");
  if (page === "malana") document.getElementById("malanaPage").classList.remove("hidden");
  if (page === "games") document.getElementById("gamesPage").classList.remove("hidden");

  setTimeout(scrollToBottom, 50);
}

// ---------- CHAT ----------
let messages = [];

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  messages.push({
    text,
    sender: "me",
    time: Date.now()
  });

  input.value = "";
  renderMessages();
}

function renderMessages() {
  const box = document.getElementById("messages");
  if (!box) return;

  box.innerHTML = "";

  messages.forEach(m => {
    const div = document.createElement("div");
    div.className = m.sender === "me" ? "my-message" : "their-message";
    div.textContent = m.text;
    box.appendChild(div);
  });

  scrollToBottom();
}

function scrollToBottom() {
  const box = document.getElementById("messages");
  if (!box) return;

  box.scrollTo({
    top: box.scrollHeight,
    behavior: "smooth"
  });
}

// ---------- BUBBLE COLOR ----------
function pickColor() {
  const color = prompt("Pick bubble color (pink, #ff69b4, lightblue, etc):");
  if (!color) return;

  localStorage.setItem("bubbleColor", color);
  applyBubbleColor(color);
}

function applyBubbleColor(color) {
  document.documentElement.style.setProperty("--bubble-color", color);
}

// ---------- RELOAD FIX (THIS WAS MISSING) ----------
function refreshApp() {
  applySavedSettings();
  renderMessages();
  scrollToBottom();
}

// ---------- SETTINGS LOAD ----------
function applySavedSettings() {
  const savedColor = localStorage.getItem("bubbleColor");
  if (savedColor) applyBubbleColor(savedColor);
}

// ---------- TODO ----------
function addTask() {
  const input = document.getElementById("todoInput");
  const value = input.value.trim();
  if (!value) return;

  const li = document.createElement("li");
  li.textContent = value;
  li.onclick = () => li.remove();

  document.getElementById("todoList").appendChild(li);
  input.value = "";
}

// ---------- MALANA ----------
function askMalana() {
  const input = document.getElementById("aiInput");
  const text = input.value.trim();
  if (!text) return;

  const box = document.getElementById("aiMessages");

  const u = document.createElement("div");
  u.textContent = "You: " + text;

  const b = document.createElement("div");
  b.textContent = "Malana: still offline mode 🤖";

  box.appendChild(u);
  box.appendChild(b);

  input.value = "";
}

// ---------- TIC TAC TOE ----------
let currentPlayer = "X";

function move(btn) {
  if (btn.textContent) return;

  btn.textContent = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// ---------- INIT ----------
window.addEventListener("load", () => {
  applySavedSettings();
  showPage("chat");
  renderMessages();
  scrollToBottom();
});

// ---------- EXPORTS ----------
window.login = login;
window.signup = signup;
window.logout = logout;
window.showPage = showPage;
window.sendMessage = sendMessage;
window.addTask = addTask;
window.askMalana = askMalana;
window.move = move;
window.pickColor = pickColor;
window.refreshApp = refreshApp;