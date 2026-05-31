// =======================
// FIREBASE SETUP
// =======================

import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getFirestore,
  collection,
  addDoc,
  onSnapshot,
  query,
  orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpI19Vv9zdNjAYPp97Y12T6A8kot3GbmA",
  authDomain: "marisa-portal.firebaseapp.com",
  projectId: "marisa-portal",
  storageBucket: "marisa-portal.firebasestorage.app",
  messagingSenderId: "977842432790",
  appId: "1:977842432790:web:4a05992c796cfdb392fe37"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

// =======================
// PAGE SWITCHING
// =======================

function showPage(page){

  document.getElementById("chatPage").classList.add("hidden");
  document.getElementById("todoPage").classList.add("hidden");
  document.getElementById("malanaPage").classList.add("hidden");
  document.getElementById("gamesPage").classList.add("hidden");

  document.getElementById(page + "Page").classList.remove("hidden");
}

window.showPage = showPage;

// =======================
// CHAT (FIREBASE)
// =======================

const messagesRef = collection(db, "messages");

// Send message
async function sendMessage(){

  const input = document.getElementById("messageInput");
  const text = input.value.trim();

  if(!text) return;

  await addDoc(messagesRef, {
    text: text,
    time: Date.now()
  });

  input.value = "";
}

window.sendMessage = sendMessage;

// Live load messages
const q = query(messagesRef, orderBy("time", "asc"));

onSnapshot(q, (snapshot) => {

  const box = document.getElementById("messages");
  box.innerHTML = "";

  snapshot.forEach(doc => {

    const data = doc.data();

    const div = document.createElement("div");
    div.className = "message sent";
    div.textContent = data.text;

    box.appendChild(div);
  });

});

// =======================
// TODO LIST (FIREBASE)
// =======================

const todoRef = collection(db, "todos");

async function addTask(){

  const input = document.getElementById("todoInput");
  const text = input.value.trim();

  if(!text) return;

  await addDoc(todoRef, {
    text: text,
    time: Date.now()
  });

  input.value = "";
}

window.addTask = addTask;

// Live todos
const tq = query(todoRef, orderBy("time", "asc"));

onSnapshot(tq, (snapshot) => {

  const list = document.getElementById("todoList");
  list.innerHTML = "";

  snapshot.forEach(doc => {

    const li = document.createElement("li");
    li.textContent = doc.data().text;

    list.appendChild(li);
  });

});

// =======================
// MALANA (simple AI logic)
// =======================

function askMalana(){

  const input = document.getElementById("aiInput");
  const text = input.value.trim();

  if(!text) return;

  const box = document.getElementById("aiMessages");

  const user = document.createElement("div");
  user.className = "message sent";
  user.textContent = text;

  box.appendChild(user);

  const replies = [
    "I’m listening ❤️",
    "That actually sounds really good.",
    "You should talk to Marisa about that 😊",
    "I think you’re on the right track.",
    "I’m proud of you ❤️",
    "Let’s figure it out step by step."
  ];

  const ai = document.createElement("div");
  ai.className = "message received";
  ai.textContent = replies[Math.floor(Math.random() * replies.length)];

  box.appendChild(ai);

  input.value = "";
}

window.askMalana = askMalana;

// =======================
// TIC TAC TOE
// =======================

let current = "X";

function move(cell){

  if(cell.textContent !== "") return;

  cell.textContent = current;

  current = current === "X" ? "O" : "X";
}

window.move = move;