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
  setDoc,
  updateDoc,
  arrayUnion
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
const auth = getAuth(app);
const db = getFirestore(app);

window.addEventListener("DOMContentLoaded", () => {

const loginPage = document.getElementById("loginPage");
const appDiv = document.getElementById("app");
const chat = document.getElementById("messages");
const input = document.getElementById("messageInput");
const typingBox = document.getElementById("typing");

/* AUTH */
window.login = () =>
  signInWithEmailAndPassword(auth, email.value, password.value);

window.signup = () =>
  createUserWithEmailAndPassword(auth, email.value, password.value);

window.logout = () => signOut(auth);

/* REFRESH */
window.refresh = () => location.reload();

/* SEND MESSAGE */
window.sendMessage = async () => {
  if (!input.value.trim()) return;

  await addDoc(collection(db, "messages"), {
    text: input.value,
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    readBy: [auth.currentUser.uid]
  });

  input.value = "";
  stopTyping();
};

/* LIVE CHAT */
const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, snap => {
  chat.innerHTML = "";

  snap.forEach(async (d) => {
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

    // READ RECEIPT LOGIC
    if (auth.currentUser && !m.readBy?.includes(auth.currentUser.uid)) {
      const ref = doc(db, "messages", id);
      updateDoc(ref, {
        readBy: arrayUnion(auth.currentUser.uid)
      });
    }

    const readStatus = document.createElement("div");
    readStatus.className = "meta";
    readStatus.textContent =
      m.readBy?.length > 1 ? "Read" : "Sent";

    bubble.appendChild(text);
    bubble.appendChild(time);
    bubble.appendChild(readStatus);

    row.appendChild(bubble);
    chat.appendChild(row);
  });

  chat.scrollTop = chat.scrollHeight;
});

/* TYPING */
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

/* TYPING LISTENER */
import { onSnapshot as listenDoc } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

listenDoc(doc(db, "typing", "global"), snap => {
  const d = snap.data();

  if (!d?.typing || d.uid === auth.currentUser?.uid) {
    typingBox.classList.add("hidden");
  } else {
    typingBox.classList.remove("hidden");
  }
});

/* COLOR */
window.pickColor = () => {
  const c = prompt("Pick color (pink works):");
  if (c) document.documentElement.style.setProperty("--bubble", c);
};

/* AUTH STATE */
onAuthStateChanged(auth, user => {
  if (user) {
    loginPage.style.display = "none";
    appDiv.style.display = "block";
  }
});

});