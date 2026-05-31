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
  onSnapshot as docListen
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";


// =======================
// FIREBASE CONFIG
// =======================
const firebaseConfig = {
  apiKey: "PUT",
  authDomain: "PUT",
  projectId: "PUT",
  storageBucket: "PUT",
  messagingSenderId: "PUT",
  appId: "PUT"
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
      app.style.display = "block";
    });
};

window.signup = () => {
  createUserWithEmailAndPassword(auth, email.value, password.value);
};

window.logout = () => signOut(auth);

// =======================
// ENCRYPTION (light)
function enc(t){return btoa(unescape(encodeURIComponent(t)))}
function dec(t){try{return decodeURIComponent(escape(atob(t)))}catch{return t}}

// =======================
// SEND MESSAGE
// =======================
window.sendMessage = async () => {
  const text = messageInput.value.trim();
  if (!text) return;

  await addDoc(collection(db, "messages"), {
    text: enc(text),
    uid: auth.currentUser.uid,
    createdAt: serverTimestamp(),
    status: "sent",
    reaction: ""
  });

  messageInput.value = "";
  sendStopTyping();
};

// =======================
// CHAT STREAM
// =======================
const q = query(collection(db, "messages"), orderBy("createdAt"));

onSnapshot(q, (snap) => {
  messages.innerHTML = "";

  snap.forEach((d) => {
    const m = d.data();
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
// TYPING (REAL TIME FIRESTORE)
// =======================
window.sendTyping = async () => {
  if (!auth.currentUser) return;

  await setDoc(doc(db, "typing", "global"), {
    uid: auth.currentUser.uid,
    typing: true
  });
};

function sendStopTyping(){
  setDoc(doc(db, "typing", "global"), {
    uid: "",
    typing: false
  });
}

docListen(doc(db, "typing", "global"), (snap) => {
  const data = snap.data();
  if (!data?.typing) {
    typing.classList.add("hidden");
    return;
  }

  if (data.uid !== auth.currentUser?.uid) {
    typing.classList.remove("hidden");
  }
});

// =======================
// COLOR
// =======================
window.pickColor = () => {
  const c = prompt("Color:");
  localStorage.setItem("bubble", c);
  document.documentElement.style.setProperty("--bubble-color", c);
};

// =======================
// AUTH STATE
// =======================
onAuthStateChanged(auth, (u) => {
  if (u) {
    loginPage.style.display = "none";
    app.style.display = "block";
  }
});