import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
  getAuth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  onAuthStateChanged,
  signOut
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

import {
  getFirestore,
  collection,
  addDoc,
  query,
  orderBy,
  onSnapshot,
  serverTimestamp,
  doc,
  updateDoc,
  arrayUnion
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDpI19Vv9zdNjAYPp97Y12T6A8kot3GbmA",
  authDomain: "marisa-portal.firebaseapp.com",
  projectId: "marisa-portal",
  storageBucket: "marisa-portal.firebasestorage.app",
  messagingSenderId: "977842432790",
  appId: "1:977842432790:web:4a05992c796cfdb392fe37",
  measurementId: "G-6E15QG75T6"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

window.addEventListener("DOMContentLoaded", () => {

const loginPage = document.getElementById("loginPage");
const appDiv = document.getElementById("app");
const chat = document.getElementById("messages");
const input = document.getElementById("messageInput");

/* AUTH */
window.login = () =>
  signInWithEmailAndPassword(auth, email.value, password.value);

window.signup = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value);

window.logout = () => signOut(auth);

window.refresh = () => location.reload();

/* SEND */
window.sendMessage = async () => {
  if (!input.value.trim()) return;

  await addDoc(collection(db, "messages"), {
    text: input.value,
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    readBy: [auth.currentUser.uid]
  });

  input.value = "";
};

/* LIVE CHAT */
const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, snap => {
  chat.innerHTML = "";

  snap.forEach(d => {
    const m = d.data();
    const id = d.id;

    const isMe = m.uid === auth.currentUser?.uid;

    const row = document.createElement("div");
    row.className = "row";

    const bubble = document.createElement("div");
    bubble.className = isMe ? "me" : "them";

    const text = document.createElement("div");
    text.textContent = m.text;

    const time = document.createElement("div");
    time.className = "meta";

    if (m.createdAt?.seconds) {
      time.textContent = new Date(m.createdAt.seconds * 1000)
        .toLocaleTimeString([], {hour:'2-digit', minute:'2-digit'});
    }

    const status = document.createElement("div");
    status.className = "meta";
    status.textContent = m.readBy?.length > 1 ? "Read" : "Sent";

    if (auth.currentUser && !m.readBy?.includes(auth.currentUser.uid)) {
      updateDoc(doc(db,"messages",id), {
        readBy: arrayUnion(auth.currentUser.uid)
      });
    }

    bubble.appendChild(text);
    bubble.appendChild(time);
    bubble.appendChild(status);

    row.appendChild(bubble);
    chat.appendChild(row);
  });

  chat.scrollTop = chat.scrollHeight;
});

/* COLOR */
window.pickColor = () => {
  const c = prompt("Color:");
  if (c) document.documentElement.style.setProperty("--bubble", c);
};

/* TABS */
window.showTab = (tab) => {
  document.getElementById("messagesPage").classList.add("hidden");
  document.getElementById("listPage").classList.add("hidden");
  document.getElementById("gamesPage").classList.add("hidden");

  document.getElementById(tab + "Page").classList.remove("hidden");
};

window.showTab("messages");

/* TODO */
window.addTask = () => {
  const t = document.getElementById("todoInput");
  const list = document.getElementById("todoList");
  if (!t.value) return;

  const li = document.createElement("li");
  li.textContent = t.value;
  li.onclick = () => li.remove();
  list.appendChild(li);

  t.value = "";
};

/* AUTH STATE */
onAuthStateChanged(auth, user => {
  if (user) {
    loginPage.style.display = "none";
    appDiv.style.display = "block";
  }
});

});