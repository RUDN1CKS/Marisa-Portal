import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import {
getFirestore,
collection,
addDoc,
onSnapshot,
query,
orderBy
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
const db = getFirestore(app);

// =======================
// TIME
// =======================

function getTime(){
const now = new Date();
let h = now.getHours();
let m = now.getMinutes();
let ampm = h >= 12 ? "PM" : "AM";
h = h % 12 || 12;
m = m < 10 ? "0" + m : m;
return `${h}:${m} ${ampm}`;
}

// =======================
// PAGE SWITCH
// =======================

function showPage(page){

document.getElementById("chatPage").classList.add("hidden");
document.getElementById("todoPage").classList.add("hidden");
document.getElementById("malanaPage").classList.add("hidden");
document.getElementById("gamesPage").classList.add("hidden");

document.getElementById(page + "Page").classList.remove("hidden");

}

window.showPage = showPage;

// =======================
// CHAT (REAL TIME)
// =======================

const chatRef = collection(db, "messages");

async function sendMessage(){

const input = document.getElementById("messageInput");
const text = input.value.trim();

if(!text) return;

await addDoc(chatRef, {
text,
time: Date.now()
});

input.value = "";
}

window.sendMessage = sendMessage;

const chatQuery = query(chatRef, orderBy("time", "asc"));

onSnapshot(chatQuery, (snapshot) => {

const box = document.getElementById("messages");
box.innerHTML = "";

snapshot.forEach(doc => {

const data = doc.data();

const div = document.createElement("div");
div.className = "message sent";

div.innerHTML = `
${data.text}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${getTime()}
</div>
`;

box.appendChild(div);

});

});

// =======================
// TODO (REAL TIME)
// =======================

const todoRef = collection(db, "todos");

async function addTask(){

const input = document.getElementById("todoInput");
const text = input.value.trim();

if(!text) return;

await addDoc(todoRef, {
text,
time: Date.now()
});

input.value = "";
}

window.addTask = addTask;

const todoQuery = query(todoRef, orderBy("time", "asc"));

onSnapshot(todoQuery, (snapshot) => {

const list = document.getElementById("todoList");
list.innerHTML = "";

snapshot.forEach(doc => {

const li = document.createElement("li");

li.innerHTML = `
${doc.data().text}
<span style="font-size:10px;opacity:0.6;margin-left:8px;">
${getTime()}
</span>
`;

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
"I’m listening ❤️",
"That makes sense.",
"You’ve got this.",
"Talk to Marisa ❤️",
"I’m here with you.",
"Keep going."
];

box.innerHTML += `
<div class="message sent">
${text}<br>
<small>${getTime()}</small>
</div>
`;

box.innerHTML += `
<div class="message received">
${replies[Math.floor(Math.random()*replies.length)]}<br>
<small>${getTime()}</small>
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

if(cell.textContent !== "") return;

cell.textContent = current;

current = current === "X" ? "O" : "X";

}

window.move = move;