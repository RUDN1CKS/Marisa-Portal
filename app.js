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
  setDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// =======================
// FIREBASE CONFIG
// =======================
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

// =======================
// SAFE DOM LOAD
// =======================
window.addEventListener("DOMContentLoaded", () => {

  const loginPage = document.getElementById("loginPage");
  const appDiv = document.getElementById("app");
  const messages = document.getElementById("messages");
  const input = document.getElementById("messageInput");
  const typingBox = document.getElementById("typing");

  // =======================
  // AUTH
  // =======================
  window.login = () =>
    signInWithEmailAndPassword(auth, email.value, password.value);

  window.signup = () =>
    createUserWithEmailAndPassword(auth, email.value, password.value);

  window.logout = () => signOut(auth);

  // =======================
  // ENCRYPT (simple)
  // =======================
  const enc = t => btoa(unescape(encodeURIComponent(t)));
  const dec = t => decodeURIComponent(escape(atob(t)));

  // =======================
  // SEND MESSAGE
  // =======================
  window.sendMessage = async () => {
    if (!input.value) return;

    await addDoc(collection(db, "messages"), {
      text: enc(input.value),
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp(),
      status: "sent"
    });

    input.value = "";
    stopTyping();
  };

  // =======================
  // REAL TIME CHAT
  // =======================
  const q = query(collection(db, "messages"), orderBy("createdAt"));

  onSnapshot(q, snap => {
    messages.innerHTML = "";

    snap.forEach(d => {
      const m = d.data();
      if (!m.text) return;

      const isMe = m.uid === auth.currentUser?.uid;

      const row = document.createElement("div");
      row.className = "msg-row";
      row.style.justifyContent = isMe ? "flex-end" : "flex-start";

      const bubble = document.createElement("div");
      bubble.className = isMe ? "my-message" : "their-message";

      const text = document.createElement("div");
      text.textContent = dec(m.text);

      const meta = document.createElement("div");
      meta.className = "meta";
      meta.textContent = m.status;

      bubble.appendChild(text);
      bubble.appendChild(meta);
      row.appendChild(bubble);
      messages.appendChild(row);
    });

    messages.scrollTop = messages.scrollHeight;
  });

  // =======================
  // TYPING
  // =======================
  let typingTimer;

  window.typing = async () => {
    if (!auth.currentUser) return;

    await setDoc(doc(db, "typing", "global"), {
      uid: auth.currentUser.uid,
      typing: true
    });

    clearTimeout(typingTimer);
    typingTimer = setTimeout(stopTyping, 1000);
  };

  function stopTyping() {
    setDoc(doc(db, "typing", "global"), {
      uid: "",
      typing: false
    });
  }

  // typing listener
  onSnapshot(doc(db, "typing", "global"), snap => {
    const d = snap.data();

    if (!d?.typing || d.uid === auth.currentUser?.uid) {
      typingBox.classList.add("hidden");
    } else {
      typingBox.classList.remove("hidden");
    }
  });

  // =======================
  // COLOR PICKER (PINK INCLUDED)
  // =======================
  window.pickColor = () => {
    const c = prompt("Pick color (try pink):");
    if (!c) return;
    document.documentElement.style.setProperty("--bubble", c);
  };

  // =======================
  // AUTH STATE
  // =======================
  onAuthStateChanged(auth, user => {
    if (user) {
      loginPage.style.display = "none";
      appDiv.style.display = "block";
    }
  });

});