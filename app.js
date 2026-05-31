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
// 🔥 YOUR FIREBASE CONFIG (FIXED)
// =======================
const firebaseConfig = {
  apiKey: "AIzaSyDpI19Vv9zdNjAYPp97Y12T6A8kot3GbmA",
  authDomain: "marisa-portal.firebaseapp.com",
  projectId: "marisa-portal",
  storageBucket: "marisa-portal.firebasestorage.app",
  messagingSenderId: "977842432790",
  appId: "1:977842432790:web:4a05992c796cfdb392fe37",
  measurementId: "G-6E15QG75T6"
};

// init
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// DOM
// =======================
const messagesBox = document.getElementById("messages");

// =======================
// ENCRYPTION (light privacy layer)
// =======================
function enc(t){ return btoa(unescape(encodeURIComponent(t))) }
function dec(t){ try { return decodeURIComponent(escape(atob(t))) } catch { return t } }

// =======================
// LOGIN
// =======================
window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      loginPage.style.display = "none";
      app.style.display = "block";
    })
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
  const text = messageInput.value.trim();
  if (!text || !auth.currentUser) return;

  await addDoc(collection(db, "messages"), {
    text: enc(text),
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    status: "sent"
  });

  messageInput.value = "";
  stopTyping();
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
    meta.textContent = m.status || "";

    bubble.appendChild(text);
    bubble.appendChild(meta);

    row.appendChild(bubble);
    messagesBox.appendChild(row);
  });

  messagesBox.scrollTop = messagesBox.scrollHeight;
});

// =======================
// TYPING INDICATOR (SIMPLE GLOBAL)
// =======================
window.sendTyping = async () => {
  if (!auth.currentUser) return;

  await setDoc(doc(db, "typing", "global"), {
    uid: auth.currentUser.uid,
    typing: true
  });
};

function stopTyping() {
  setDoc(doc(db, "typing", "global"), {
    uid: "",
    typing: false
  });
}

// listen typing
import { onSnapshot as listenDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

listenDoc(doc(db, "typing", "global"), (snap) => {
  const data = snap.data();
  const typing = document.getElementById("typing");

  if (!data?.typing || data.uid === auth.currentUser?.uid) {
    typing.classList.add("hidden");
  } else {
    typing.classList.remove("hidden");
  }
});

// =======================
// AUTH STATE
// =======================
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPage.style.display = "none";
    app.style.display = "block";
  }
});

// =======================
// BUBBLE COLOR
// =======================
window.pickColor = () => {
  const c = prompt("Pick bubble color:");
  if (!c) return;

  localStorage.setItem("bubble", c);
  document.documentElement.style.setProperty("--bubble-color", c);
};