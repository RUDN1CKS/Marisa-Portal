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
// 🔥 FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "PUT_YOURS",
  authDomain: "PUT_YOURS",
  projectId: "PUT_YOURS",
  storageBucket: "PUT_YOURS",
  messagingSenderId: "PUT_YOURS",
  appId: "PUT_YOURS"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// =======================
// AUTH
// =======================
window.login = () => {
  signInWithEmailAndPassword(auth, email.value, password.value)
    .then(() => {
      loginPage.style.display = "none";
      appDiv.style.display = "block";
    });
};

window.signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value);
};

window.logout = () => signOut(auth);

// =======================
// CHAT
// =======================
const chatBox = document.getElementById("messages");

window.sendMessage = async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    text,
    uid: auth.currentUser.uid,
    status: "sent",
    createdAt: serverTimestamp()
  });

  messageInput.value = "";
};

// =======================
// REAL-TIME LISTENER
// =======================
const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, (snap) => {
  chatBox.innerHTML = "";

  snap.forEach((doc) => {
    const m = doc.data();

    const row = document.createElement("div");
    row.className = "msg-row";
    row.style.justifyContent =
      m.uid === auth.currentUser.uid ? "flex-end" : "flex-start";

    const bubble = document.createElement("div");
    bubble.className =
      m.uid === auth.currentUser.uid ? "my-message" : "their-message";

    const text = document.createElement("div");
    text.textContent = m.text;

    const meta = document.createElement("div");
    meta.className = "meta";
    meta.textContent = m.status;

    bubble.appendChild(text);
    bubble.appendChild(meta);
    row.appendChild(bubble);
    chatBox.appendChild(row);
  });

  chatBox.scrollTop = chatBox.scrollHeight;
});

// =======================
// TYPING INDICATOR (simple v1)
// =======================
window.startTyping = () => {
  const t = document.getElementById("typing");

  t.classList.remove("hidden");

  clearTimeout(window.typingTimer);
  window.typingTimer = setTimeout(() => {
    t.classList.add("hidden");
  }, 1200);
};

// =======================
// COLOR
// =======================
window.pickColor = () => {
  const c = prompt("Pick color:");
  if (!c) return;

  localStorage.setItem("bubble", c);
  document.documentElement.style.setProperty("--bubble-color", c);
};

window.refreshApp = () => location.reload();

// =======================
// AUTH STATE
// =======================
onAuthStateChanged(auth, (user) => {
  if (user) {
    loginPage.style.display = "none";
    appDiv.style.display = "block";
  }
});

// =======================
// INPUT LISTENER
// =======================
messageInput?.addEventListener("input", startTyping);hApp;