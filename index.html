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

// 🔥 FIREBASE CONFIG (yours)
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

// DOM safe init
window.addEventListener("DOMContentLoaded", () => {

  const loginPage = document.getElementById("loginPage");
  const appDiv = document.getElementById("app");
  const chat = document.getElementById("messages");
  const input = document.getElementById("messageInput");

  // ENCODE (light privacy)
  const enc = t => btoa(unescape(encodeURIComponent(t)));
  const dec = t => decodeURIComponent(escape(atob(t)));

  // LOGIN
  window.login = () =>
    signInWithEmailAndPassword(auth, email.value, password.value);

  window.signup = () =>
    createUserWithEmailAndPassword(auth, email.value, password.value);

  window.logout = () => signOut(auth);

  // SEND MESSAGE
  window.sendMessage = async () => {
    if (!input.value) return;

    await addDoc(collection(db, "messages"), {
      text: enc(input.value),
      uid: auth.currentUser.uid,
      createdAt: serverTimestamp()
    });

    input.value = "";
    stopTyping();
  };

  // LIVE CHAT
  const q = query(collection(db, "messages"), orderBy("createdAt"));

  onSnapshot(q, snap => {
    chat.innerHTML = "";

    snap.forEach(d => {
      const m = d.data();
      if (!m.text) return;

      const isMe = m.uid === auth.currentUser?.uid;

      const row = document.createElement("div");
      row.className = "row";

      const bubble = document.createElement("div");
      bubble.className = isMe ? "me" : "them";

      const text = document.createElement("div");
      text.textContent = dec(m.text);

      const time = document.createElement("div");
      time.className = "time";
      time.textContent = m.createdAt?.seconds
        ? new Date(m.createdAt.seconds * 1000).toLocaleTimeString([], {
            hour: "2-digit",
            minute: "2-digit"
          })
        : "";

      bubble.appendChild(text);
      bubble.appendChild(time);
      row.appendChild(bubble);
      chat.appendChild(row);
    });

    chat.scrollTop = chat.scrollHeight;
  });

  // TYPING
  let typingTimer;

  window.typing = async () => {
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
  import { onSnapshot as listenDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

  listenDoc(doc(db, "typing", "global"), snap => {
    const data = snap.data();
    const t = document.getElementById("typing");

    if (!data?.typing || data.uid === auth.currentUser?.uid) {
      t.classList.add("hidden");
    } else {
      t.classList.remove("hidden");
    }
  });

  // BUBBLE COLOR (PINK READY)
  window.pickColor = () => {
    const c = prompt("Color (try pink or #ff69b4):");
    if (!c) return;
    document.documentElement.style.setProperty("--bubble", c);
  };

  // AUTH STATE
  onAuthStateChanged(auth, user => {
    if (user) {
      loginPage.style.display = "none";
      appDiv.style.display = "block";
    }
  });

});