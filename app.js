// =======================
// FRAGGO - FINAL CHAT CORE
// =======================

// ---------- AUTH ----------
function login() {
  document.getElementById("loginPage").style.display = "none";
  document.getElementById("app").style.display = "block";
}

function signup() {
  alert("Connect Firebase later");
}

function logout() {
  document.getElementById("loginPage").style.display = "flex";
  document.getElementById("app").style.display = "none";
}

// ---------- PAGE ----------
function showPage(page) {
  document.querySelectorAll(".page").forEach(p => p.classList.add("hidden"));
  document.getElementById(page + "Page").classList.remove("hidden");
  setTimeout(scrollToBottom, 50);
}

// ---------- CHAT STORAGE (SYNC FIX) ----------
let messages = JSON.parse(localStorage.getItem("fraggo_msgs") || "[]");

// ---------- SEND ----------
function sendMessage() {
  const input = document.getElementById("messageInput");
  const text = input.value.trim();
  if (!text) return;

  messages.push({
    text,
    sender: "me",
    time: Date.now()
  });

  save();
  input.value = "";
  render();
}

// ---------- SAVE ----------
function save() {
  localStorage.setItem("fraggo_msgs", JSON.stringify(messages));
}

// ---------- TIME ----------
function time(t) {
  return new Date(t).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit"
  });
}

// ---------- RENDER ----------
function render() {
  const box = document.getElementById("messages");
  box.innerHTML = "";

  messages.forEach(m => {
    const row = document.createElement("div");
    row.className = "msg-row";
    row.style.justifyContent = m.sender === "me" ? "flex-end" : "flex-start";

    const bubble = document.createElement("div");
    bubble.className = m.sender === "me" ? "my-message" : "their-message";

    const text = document.createElement("div");
    text.textContent = m.text;

    const ts = document.createElement("div");
    ts.textContent = time(m.time);
    ts.style.fontSize = "10px";
    ts.style.opacity = "0.6";
    ts.style.marginTop = "4px";

    bubble.appendChild(text);
    bubble.appendChild(ts);

    row.appendChild(bubble);
    box.appendChild(row);
  });

  scrollToBottom();
}

// ---------- SCROLL ----------
function scrollToBottom() {
  const box = document.getElementById("messages");
  if (!box) return;

  box.scrollTo({
    top: box.scrollHeight,
    behavior: "smooth"
  });
}

// ---------- COLOR ----------
function pickColor() {
  const c = prompt("Pick bubble color (pink, #ff69b4, etc)");
  if (!c) return;

  localStorage.setItem("bubbleColor", c);
  applyColor(c);
}

function applyColor(c) {
  document.documentElement.style.setProperty("--bubble-color", c);
}

// ---------- REFRESH ----------
function refreshApp() {
  messages = JSON.parse(localStorage.getItem("fraggo_msgs") || "[]");
  applySaved();
  render();
}

// ---------- SETTINGS ----------
function applySaved() {
  const c = localStorage.getItem("bubbleColor");
  if (c) applyColor(c);
}

// ---------- TODO ----------
function addTask() {
  const input = document.getElementById("todoInput");
  const v = input.value.trim();
  if (!v) return;

  const li = document.createElement("li");
  li.textContent = v;
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

// ---------- INIT ----------
window.addEventListener("load", () => {
  applySaved();
  render();
  showPage("chat");
});

// ---------- EXPORTS ----------
window.login = login;
window.signup = signup;
window.logout = logout;
window.showPage = showPage;
window.sendMessage = sendMessage;
window.addTask = addTask;
window.askMalana = askMalana;
window.pickColor = pickColor;
window.refreshApp = refreshApp;