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

// LOGIN STATE
onAuthStateChanged(auth, (user) => {
if (user) {
document.getElementById("loginPage").style.display = "none";
document.getElementById("app").style.display = "block";
} else {
document.getElementById("loginPage").style.display = "flex";
document.getElementById("app").style.display = "none";
}
});

// AUTH
function signup(){
createUserWithEmailAndPassword(
auth,
document.getElementById("email").value,
document.getElementById("password").value
).catch(e => alert(e.message));
}

function login(){
signInWithEmailAndPassword(
auth,
document.getElementById("email").value,
document.getElementById("password").value
).catch(e => alert(e.message));
}

window.signup = signup;
window.login = login;

// NAV
function showPage(page){
["chatPage","todoPage","malanaPage","gamesPage"].forEach(id=>{
document.getElementById(id).classList.add("hidden");
});

document.getElementById(page + "Page").classList.remove("hidden");
}

window.showPage = showPage;

// TIME FUNCTION (FIXED)
function getTime(){
const now = new Date();
return now.toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
});
}

// CHAT
const chatRef = collection(db, "messages");

function sendMessage(){
const input = document.getElementById("messageInput");
if (!input.value.trim()) return;

addDoc(chatRef, {
text: input.value,
time: Date.now()
});

input.value = "";
}

window.sendMessage = sendMessage;

// FIXED TIMESTAMPS HERE
onSnapshot(query(chatRef, orderBy("time", "asc")), (snap) => {

const box = document.getElementById("messages");
box.innerHTML = "";

snap.forEach((doc) => {

const data = doc.data();

const time = new Date(data.time).toLocaleTimeString([], {
hour: "2-digit",
minute: "2-digit"
});

const div = document.createElement("div");
div.className = "message sent";

div.innerHTML = `
${data.text}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${time}
</div>
`;

box.appendChild(div);

});

});

// TODO
const todoRef = collection(db, "todos");

function addTask(){
const input = document.getElementById("todoInput");
if (!input.value.trim()) return;

addDoc(todoRef, {
text: input.value,
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

// MALANA
function askMalana(){
const input = document.getElementById("aiInput");
if (!input.value.trim()) return;

const box = document.getElementById("aiMessages");

const replies = [
"I hear you ❤️",
"Got you.",
"You’re doing great.",
"Keep going ❤️"
];

box.innerHTML += `
<div class="message sent">
${input.value}<br>
<small>${getTime()}</small>
</div>
`;

box.innerHTML += `
<div class="message received">
${replies[Math.floor(Math.random() * replies.length)]}<br>
<small>${getTime()}</small>
</div>
`;

input.value = "";
}

window.askMalana = askMalana;

// GAME
let current = "X";

function move(cell){
if (cell.textContent) return;
cell.textContent = current;
current = current === "X" ? "O" : "X";
}

window.move = move;