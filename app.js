// =======================
// FRAGGO CORE APP
// =======================

// ---------- AUTH ----------
function login() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function signup() {
  alert("Hook Firebase here");
}

function logout() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("app").style.display = "none";
}

// ---------- NAV ----------
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));

  document.getElementById(page + "Page").classList.remove("hidden");
  setTimeout(scrollToBottom, 50);
}

// ---------- CHAT ----------
let messages = [];

function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  messages.push({ text, sender: "me" });

  input.value = "";
  renderMessages();
}

function renderMessages() {
  const box = document.getElementById("messages");
  box.innerHTML = "";

  messages.forEach(m => {
    const row = document.createElement("div");
    row.className = "msg-row";

    const bubble = document.createElement("div");
    bubble.textContent = m.text;

    if (m.sender === "me") {
      row.style.justifyContent = "flex-end";
      bubble.className = "my-message";
    } else {
      row.style.justifyContent = "flex-start";
      bubble.className = "their-message";
    }

    row.appendChild(bubble);
    box.appendChild(row);
  });

  scrollToBottom();
}

function scrollToBottom() {
  const box = document.getElementById("messages");
  box.scrollTo({ top: box.scrollHeight, behavior: "smooth" });
}

// ---------- BUBBLE COLOR ----------
function pickColor() {
  const color = prompt("Pick bubble color (pink, #ff69b4, etc):");
  if (!color) return;

  localStorage.setItem("bubbleColor", color);
  applyBubbleColor(color);
}

function applyBubbleColor(color) {
  document.documentElement.style.setProperty("--bubble-color", color);
}

// ---------- REFRESH ----------
function refreshApp() {
  applySavedSettings();
  renderMessages();
  scrollToBottom();
}

// ---------- SETTINGS ----------
function applySavedSettings() {
  const saved = localStorage.getItem("bubbleColor");
  if (saved) applyBubbleColor(saved);
}

// ---------- TODO ----------
function addTask() {
  const input = document.getElementById("todoInput");
  const val = input.value.trim();
  if (!val) return;

  const li = document.createElement("li");
  li.textContent = val;
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

  box.innerHTML += `<div>You: ${text}</div>`;
  box.innerHTML += `<div>Malana: offline 🤖</div>`;

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