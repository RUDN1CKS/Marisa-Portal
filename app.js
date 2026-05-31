import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
onSnapshot,
query,
orderBy,
doc,
updateDoc
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

// ================= FIREBASE =================
const firebaseConfig = {
apiKey: "AIzaSyDpI19Vv9zdNjAYPp97Y12T6A8kot3GbmA",
authDomain: "marisa-portal.firebaseapp.com",
projectId: "marisa-portal",
storageBucket: "marisa-portal.firebasestorage.app",
messagingSenderId: "977842432790",
appId: "1:977842432790:web:4a05992c796cfdb392fe37"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// ================= STATE =================
let currentUser = null;

const WIFE_EMAIL = "mnrudnick4@gmail.com";

// ================= AUTH STATE =================
onAuthStateChanged(auth, (user) => {
const loginPage = document.getElementById("loginPage");
const appPage = document.getElementById("app");

if (!loginPage || !appPage) return;

if (user) {
currentUser = user;

loginPage.style.display = "none";
appPage.style.display = "block";

console.log("Logged in as:", user.email);
} else {
currentUser = null;

loginPage.style.display = "flex";
appPage.style.display = "none";
}
});

// ================= AUTH ACTIONS =================
window.signup = () => {
const email = document.getElementById("email")?.value;
const password = document.getElementById("password")?.value;

if (!email || !password) return alert("Enter email + password");

createUserWithEmailAndPassword(auth, email, password)
.catch(e => alert("SIGNUP ERROR: " + e.message));
};

window.login = () => {
const email = document.getElementById("email")?.value;
const password = document.getElementById("password")?.value;

if (!email || !password) return alert("Enter email + password");

signInWithEmailAndPassword(auth, email, password)
.catch(e => alert("LOGIN ERROR: " + e.message));
};

window.logout = () => {
auth.signOut()
.catch(e => alert(e.message));
};

window.refreshApp = () => {
location.reload();
};

// ================= NAV =================
window.showPage = (page) => {
["chatPage","todoPage","malanaPage","gamesPage"].forEach(id=>{
document.getElementById(id)?.classList.add("hidden");
});

document.getElementById(page + "Page")?.classList.remove("hidden");
};

// ================= CHAT =================
const chatRef = collection(db, "messages");

window.sendMessage = () => {
const input = document.getElementById("messageInput");
if (!input?.value.trim()) return;

addDoc(chatRef, {
text: input.value,
sender: currentUser?.email || "unknown",
time: Date.now(),
seenBy: []
});

input.value = "";
};

// ================= CHAT RENDER =================
onSnapshot(query(chatRef, orderBy("time","asc")), (snap) => {

const box = document.getElementById("messages");
if (!box) return;

box.innerHTML = "";

snap.forEach(docSnap => {

const data = docSnap.data();

const sender = data.sender || "";

const isYou = currentUser && sender === currentUser.email;
const isWife = sender === WIFE_EMAIL;

let bg = "#2a2f36";

if (isYou) bg = "#3a86ff";
if (isWife) bg = "#ff4fa3";

const div = document.createElement("div");

div.style.maxWidth = "75%";
div.style.margin = "6px";
div.style.padding = "10px";
div.style.borderRadius = "15px";
div.style.color = "white";
div.style.alignSelf = isYou ? "flex-end" : "flex-start";
div.style.background = bg;

const time = new Date(data.time).toLocaleTimeString([], {
hour:"2-digit",
minute:"2-digit"
});

const seen = data.seenBy?.length > 1 ? "Seen 👀" : "";

div.innerHTML = `
${data.text || ""}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${time} ${seen}
</div>
`;

box.appendChild(div);

});

});

// ================= TODO =================
const todoRef = collection(db,"todos");

window.addTask = () => {
const input = document.getElementById("todoInput");
if (!input?.value.trim()) return;

addDoc(todoRef,{
text:input.value,
time:Date.now()
});

input.value="";
};

onSnapshot(query(todoRef,orderBy("time","asc")),(snap)=>{
const list=document.getElementById("todoList");
if (!list) return;

list.innerHTML="";

snap.forEach(d=>{
const li=document.createElement("li");
li.textContent=d.data().text;
list.appendChild(li);
});
});

// ================= MALANA =================
window.askMalana = () => {
const input=document.getElementById("aiInput");
if(!input?.value.trim()) return;

const box=document.getElementById("aiMessages");
if (!box) return;

box.innerHTML += `<div class="message">${input.value}</div>`;

const replies = [
"I hear you ❤️",
"Got you.",
"Keep going ❤️"
];

box.innerHTML += `<div class="message">
${replies[Math.floor(Math.random()*replies.length)]}
</div>`;

input.value="";
};

// ================= GAME =================
let current="X";

window.move=(cell)=>{
if(!cell || cell.textContent) return;

cell.textContent=current;
current=current==="X"?"O":"X";
};