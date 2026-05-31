// =======================
// FRAGGO APP CORE
// =======================

// ---------- AUTH (placeholders if you're using Firebase later) ----------
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
}

// ---------- CHAT SYSTEM ----------
let messages = [];

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  const msg = {
    text,
    sender: "me",
    time: Date.now()
  };

  messages.push(msg);
  renderMessages();
  input.value = "";
}

function renderMessages() {
  const box = document.getElementById("messages");
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

// ---------- BUBBLE COLOR PICKER ----------
function pickColor() {
  const color = prompt("Pick bubble color (pink, #ff69b4, lightblue, etc):");
  if (!color) return;

  localStorage.setItem("bubbleColor", color);
  applyBubbleColor(color);
}

function applyBubbleColor(color) {
  document.documentElement.style.setProperty("--bubble-color", color);
}

// load saved bubble color
window.addEventListener("load", () => {
  const saved = localStorage.getItem("bubbleColor");
  if (saved) applyBubbleColor(saved);

  showPage("chat");
});

// ---------- TODO SYSTEM ----------
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

// ---------- MALANA (placeholder AI) ----------
function askMalana() {
  const input = document.getElementById("aiInput");
  const text = input.value.trim();
  if (!text) return;

  const box = document.getElementById("aiMessages");

  const userMsg = document.createElement("div");
  userMsg.textContent = "You: " + text;
  box.appendChild(userMsg);

  const botMsg = document.createElement("div");
  botMsg.textContent = "Malana: I’m not fully connected yet 🤖";
  box.appendChild(botMsg);

  input.value = "";
}

// ---------- TIC TAC TOE ----------
let currentPlayer = "X";

function move(btn) {
  if (btn.textContent) return;

  btn.textContent = currentPlayer;
  currentPlayer = currentPlayer === "X" ? "O" : "X";
}

// ---------- GLOBAL EXPORTS (IMPORTANT for HTML onclick) ----------
window.login = login;
window.signup = signup;
window.logout = logout;
window.showPage = showPage;
window.sendMessage = sendMessage;
window.addTask = addTask;
window.askMalana = askMalana;
window.move = move;
window.pickColor = pickColor;