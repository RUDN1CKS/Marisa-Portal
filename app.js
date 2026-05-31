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
  serverTimestamp
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =======================
// FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDpI19VV9zdNjAYPp97Y12T6A8kot3GbmA",
  authDomain: "marisa-portal.firebaseapp.com",
  projectId: "marisa-portal",
  storageBucket: "marisa-portal.firebasestorage.app",
  messagingSenderId: "977842432790",
  appId: "1:977842432790:web:4a05992c796cfdb392fe37"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// WAIT FOR DOM SAFELY
// =======================
window.addEventListener("DOMContentLoaded", () => {

  const loginPage = document.getElementById("loginPage");
  const appDiv = document.getElementById("app");
  const messagesBox = document.getElementById("messages");

  const emailInput = document.getElementById("email");
  const passwordInput = document.getElementById("password");
  const messageInput = document.getElementById("messageInput");

  // =======================
  // AUTH
  // =======================
  window.login = async () => {
    try {
      await signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    } catch (e) {
      alert(e.message);
    }
  };

  window.signup = async () => {
    try {
      await createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value);
    } catch (e) {
      alert(e.message);
    }
  };

  window.logout = () => signOut(auth);

  // =======================
  // SEND MESSAGE
  // =======================
  window.sendMessage = async () => {
    const text = messageInput.value.trim();
    if (!text || !auth.currentUser) return;

    await addDoc(collection(db, "messages"), {
      text,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    messageInput.value = "";
  };

  // =======================
  // REAL-TIME CHAT
  // =======================
  const q = query(collection(db, "messages"), orderBy("createdAt"));

  onSnapshot(q, (snap) => {
    messagesBox.innerHTML = "";

    snap.forEach((d) => {
      const m = d.data();
      if (!m.text) return;

      const isMe = auth.currentUser && m.uid === auth.currentUser.uid;

      const row = document.createElement("div");
      row.className = "msg-row";
      row.style.justifyContent = isMe ? "flex-end" : "flex-start";

      const bubble = document.createElement("div");
      bubble.className = isMe ? "my-message" : "their-message";
      bubble.textContent = m.text;

      row.appendChild(bubble);
      messagesBox.appendChild(row);
    });

    messagesBox.scrollTop = messagesBox.scrollHeight;
  });

  // =======================
  // AUTH STATE
  // =======================
  onAuthStateChanged(auth, (user) => {
    if (user) {
      loginPage.style.display = "none";
      appDiv.style.display = "block";
    } else {
      loginPage.style.display = "flex";
      appDiv.style.display = "none";
    }
  });

});