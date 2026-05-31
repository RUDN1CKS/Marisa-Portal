import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
onSnapshot,
query,
orderBy
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

import {
getAuth,
createUserWithEmailAndPassword,
signInWithEmailAndPassword,
onAuthStateChanged
} from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";

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
const db = getFirestore(app);
const auth = getAuth(app);

// =======================
// LOGIN SYSTEM
// =======================
onAuthStateChanged(auth, (user) => {
if (user) {
document.getElementById("loginPage").style.display = "none";
document.getElementById("app").style.display = "block";
} else {
document.getElementById("loginPage").style.display = "flex";
document.getElementById("app").style.display = "none";
}
});

function signup(){
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

createUserWithEmailAndPassword(auth, email, password)
.catch(e => alert(e.message));
}

function login(){
const email = document.getElementById("email").value;
const password = document.getElementById("password").value;

signInWithEmailAndPassword(auth, email, password)
.catch(e => alert(e.message));
}

window.signup = signup;
window.login = login;

// =======================
// NAVIGATION
// =======================
function showPage(page){
["chatPage","todoPage","malanaPage","gamesPage"].forEach(id=>{
document.getElementById(id).classList.add("hidden");
});

document.getElementById(page + "Page").classList.remove("hidden");
}

window.showPage = showPage;

// =======================
// TIME FIX (COLORADO DEVICE TIME)
// =======================
function formatTime(ms){
if(!ms) return "";

const d = new Date(ms);

if(isNaN(d.getTime())) return "";

return d.toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
});
}

// =======================
// CHAT (REALTIME + FIXED TIMESTAMPS)
// =======================
const chatRef = collection(db, "messages");

function sendMessage(){
const input = document.getElementById("messageInput");
const text = input.value.trim();
if(!text) return;

addDoc(chatRef, {
text: text,
time: Date.now()
});

input.value = "";
}

window.sendMessage = sendMessage;

onSnapshot(query(chatRef, orderBy("time", "asc")), (snap) => {

const box = document.getElementById("messages");
box.innerHTML = "";

snap.forEach((doc) => {

const data = doc.data();

const timeValue = data.time ?? Date.now();

const div = document.createElement("div");
div.className = "message sent";

div.innerHTML = `
${data.text ?? ""}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${formatTime(timeValue)}
</div>
`;

box.appendChild(div);

});

});

// =======================
// TODO LIST (REALTIME)
// =======================
const todoRef = collection(db, "todos");

function addTask(){
const input = document.getElementById("todoInput");
const text = input.value.trim();
if(!text) return;

addDoc(todoRef, {
text: text,
time: Date.now()
});

input.value = "";
}

window.addTask = addTask;

onSnapshot(query(todoRef, orderBy("time", "asc")), (snap) => {

const list = document.getElementById("todoList");
list.innerHTML = "";

snap.forEach((doc) => {

const li = document.createElement("li");
li.textContent = doc.data().text;

list.appendChild(li);

});

});

// =======================
// MALANA (LOCAL AI)
// =======================
function askMalana(){
const input = document.getElementById("aiInput");
const text = input.value.trim();
if(!text) return;

const box = document.getElementById("aiMessages");

const replies = [
"I hear you ❤️",
"You’ve got this.",
"That makes sense.",
"I’m here with you.",
"Keep going ❤️"
];

box.innerHTML += `
<div class="message sent">
${text}<br>
<small>${formatTime(Date.now())}</small>
</div>
`;

box.innerHTML += `
<div class="message received">
${replies[Math.floor(Math.random() * replies.length)]}<br>
<small>${formatTime(Date.now())}</small>
</div>
`;

input.value = "";
}

window.askMalana = askMalana;

// =======================
// TIC TAC TOE
// =======================
let current = "X";

function move(cell){
if(cell.textContent) return;
cell.textContent = current;
current = current === "X" ? "O" : "X";
}

window.move = move;