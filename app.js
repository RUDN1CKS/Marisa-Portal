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
// FIREBASE
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
// WAIT FOR DOM FIRST (CRITICAL FIX)
// =======================
window.addEventListener("DOMContentLoaded", () => {

  const loginPage = document.getElementById("loginPage");
  const appDiv = document.getElementById("app");
  const chat = document.getElementById("messages");
  const input = document.getElementById("messageInput");
  const typingBox = document.getElementById("typing");

  // =======================
  // AUTH
  // =======================
  window.login = () => {
    signInWithEmailAndPassword(auth, email.value, password.value)
      .catch(e => alert(e.message));
  };

  window.signup = () => {
    createUserWithEmailAndPassword(auth, email.value, password.value)
      .catch(e => alert(e.message));
  };

  window.logout = () => signOut(auth);

  // =======================
  // SEND MESSAGE
  // =======================
  window.sendMessage = async () => {
    if (!input.value || !auth.currentUser) return;

    await addDoc(collection(db, "messages"), {
      text: input.value,
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    input.value = "";
    stopTyping();
  };

  // =======================
  // CHAT STREAM (SAFE)
  // =======================
  const q = query(collection(db, "messages"), orderBy("createdAt"));

  onSnapshot(q, snap => {
    chat.innerHTML = "";

    snap.forEach(d => {
      const m = d.data();
      if (!m.text) return;

      const isMe = auth.currentUser && m.uid === auth.currentUser.uid;

      const row = document.createElement("div");
      row.className = "row";

      const bubble = document.createElement("div");
      bubble.className = isMe ? "me" : "them";

      bubble.textContent = m.text;

      row.appendChild(bubble);
      chat.appendChild(row);
    });

    chat.scrollTop = chat.scrollHeight;
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

  // =======================
  // AUTH STATE
  // =======================
  onAuthStateChanged(auth, user => {
    if (user) {
      loginPage.style.display = "none";
      appDiv.style.display = "block";
    } else {
      loginPage.style.display = "flex";
      appDiv.style.display = "none";
    }
  });

});