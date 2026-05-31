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
// FIREBASE CONFIG (YOUR REAL ONE)
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

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// ENCRYPTION (light privacy layer)
// =======================
const enc = t => btoa(unescape(encodeURIComponent(t)));
const dec = t => {
  try { return decodeURIComponent(escape(atob(t))); }
  catch { return t; }
};

// =======================
// AUTH
// =======================
window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      loginPage.style.display = "none";
      app.style.display = "block";
    });
};

window.signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value);
};

window.logout = () => signOut(auth);

// =======================
// SEND MESSAGE (REAL LIVE CHAT)
// =======================
window.sendMessage = async () => {
  const text = messageInput.value.trim();
  if (!text || !auth.currentUser) return;

  await addDoc(collection(db, "messages"), {
    text: enc(text),
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    status: "sent",
    reaction: ""
  });

  messageInput.value = "";
  stopTyping();
};

// =======================
// LIVE CHAT STREAM
// =======================
const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, (snap) => {
  messages.innerHTML = "";

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
    meta.textContent = m.status || "sent";

    const react = document.createElement("div");
    react.textContent = m.reaction || "";

    bubble.appendChild(text);
    bubble.appendChild(meta);
    bubble.appendChild(react);

    row.appendChild(bubble);
    messages.appendChild(row);
  });

  messages.scrollTop = messages.scrollHeight;
});

// =======================
// TYPING (REAL TIME FIRESTORE SYNC)
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

// listen typing updates
import { onSnapshot as listenDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

listenDoc(doc(db, "typing", "global"), (snap) => {
  const data = snap.data();
  const t = document.getElementById("typing");

  if (!data?.typing || data.uid === auth.currentUser?.uid) {
    t.classList.add("hidden");
  } else {
    t.classList.remove("hidden");
  }
});

// =======================
// COLOR PICKER
// =======================
window.pickColor = () => {
  const c = prompt("Pick bubble color:");
  if (!c) return;

  localStorage.setItem("bubbleColor", c);
  document.documentElement.style.setProperty("--bubble-color", c);
};

// =======================
// AUTH STATE
// =======================
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPage.style.display = "none";
    app.style.display = "block";
  }
});