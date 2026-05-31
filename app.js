import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// ================= FIREBASE CONFIG =================
const firebaseConfig = {
  apiKey: "AIzaSyDpI19Vv9zdNjAYPp97Y12T6A8kot3GbmA",
  authDomain: "marisa-portal.firebaseapp.com",
  projectId: "marisa-portal",
  storageBucket: "marisa-portal.firebasestorage.app",
  messagingSenderId: "977842432790",
  appId: "1:977842432790:web:4a05992c796cfdb392fe37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// ================= STATE =================
let currentUser = null;

// ================= AUTH STATE =================
onAuthStateChanged(auth, (user) => {
  const loginPage = document.getElementById("loginPage");
  const appPage = document.getElementById("app");

  if (!loginPage || !appPage) return;

  if (user) {
    currentUser = user;
    loginPage.style.display = "none";
    appPage.style.display = "block";
  } else {
    currentUser = null;
    loginPage.style.display = "flex";
    appPage.style.display = "none";
  }
});

// ================= AUTH FUNCTIONS =================
window.signup = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  createUserWithEmailAndPassword(auth, email, password)
    .catch(err => alert("SIGNUP ERROR: " + err.message));
};

window.login = () => {
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  signInWithEmailAndPassword(auth, email, password)
    .catch(err => alert("LOGIN ERROR: " + err.message));
};

window.logout = () => {
  signOut(auth);
};

window.refreshApp = () => {
  location.reload();
};

// ================= NAVIGATION =================
window.showPage = (page) => {
  ["chatPage", "todoPage", "malanaPage", "gamesPage"].forEach(id => {
    const el = document.getElementById(id);
    if (el) el.classList.add("hidden");
  });

  const target = document.getElementById(page + "Page");
  if (target) target.classList.remove("hidden");
};

// ================= CHAT =================
const chatRef = collection(db, "messages");

window.sendMessage = () => {
  const input = document.getElementById("messageInput");
  if (!input.value.trim()) return;

  addDoc(chatRef, {
    text: input.value,
    sender: currentUser?.email || "unknown",
    time: Date.now()
  });

  input.value = "";
};

// Render chat
onSnapshot(query(chatRef, orderBy("time", "asc")), (snap) => {
  const box = document.getElementById("messages");
  if (!box) return;

  box.innerHTML = "";

  snap.forEach(doc => {
    const data = doc.data();

    const isYou = currentUser && data.sender === currentUser.email;

    const div = document.createElement("div");

    div.style.maxWidth = "75%";
    div.style.margin = "6px";
    div.style.padding = "10px";
    div.style.borderRadius = "12px";
    div.style.color = "white";
    div.style.alignSelf = isYou ? "flex-end" : "flex-start";
    div.style.background = isYou ? "#3a86ff" : "#2a2f36";

    const time = new Date(data.time).toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit"
    });

    div.innerHTML = `
      ${data.text}
      <div style="font-size:10px;opacity:0.6;margin-top:5px;">
        ${time}
      </div>
    `;

    box.appendChild(div);
  });
});

// ================= TODO =================
const todoRef = collection(db, "todos");

window.addTask = () => {
  const input = document.getElementById("todoInput");
  if (!input.value.trim()) return;

  addDoc(todoRef, {
    text: input.value,
    time: Date.now()
  });

  input.value = "";
};

onSnapshot(query(todoRef, orderBy("time", "asc")), (snap) => {
  const list = document.getElementById("todoList");
  if (!list) return;

  list.innerHTML = "";

  snap.forEach(d => {
    const li = document.createElement("li");
    li.textContent = d.data().text;
    list.appendChild(li);
  });
});

// ================= MALANA =================
window.askMalana = () => {
  const input = document.getElementById("aiInput");
  if (!input.value.trim()) return;

  const box = document.getElementById("aiMessages");

  box.innerHTML += `<div class="message">${input.value}</div>`;

  const replies = [
    "I hear you ❤️",
    "Got you.",
    "Keep going ❤️"
  ];

  box.innerHTML += `<div class="message">
    ${replies[Math.floor(Math.random() * replies.length)]}
  </div>`;

  input.value = "";
};

// ================= GAME =================
let current = "X";

window.move = (cell) => {
  if (cell.textContent) return;

  cell.textContent = current;
  current = current === "X" ? "O" : "X";
};