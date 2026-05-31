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

window.signup = () => {
createUserWithEmailAndPassword(
auth,
document.getElementById("email").value,
document.getElementById("password").value
).catch(e => alert(e.message));
};

window.login = () => {
signInWithEmailAndPassword(
auth,
document.getElementById("email").value,
document.getElementById("password").value
).catch(e => alert(e.message));
};

// NAV
window.showPage = (page) => {
["chatPage","todoPage","malanaPage","gamesPage"].forEach(id=>{
const el = document.getElementById(id);
if (el) el.classList.add("hidden");
});

const target = document.getElementById(page + "Page");
if (target) target.classList.remove("hidden");
};

// CHAT
const chatRef = collection(db, "messages");

window.sendMessage = () => {
const input = document.getElementById("messageInput");
if (!input.value.trim()) return;

addDoc(chatRef, {
text: input.value,
time: Date.now()
});

input.value = "";
};

onSnapshot(query(chatRef, orderBy("time","asc")), (snap) => {

const box = document.getElementById("messages");
box.innerHTML = "";

snap.forEach(doc => {
const div = document.createElement("div");
div.className = "message";

const data = doc.data();

const time = new Date(data.time).toLocaleTimeString([], {
hour:"2-digit",
minute:"2-digit"
});

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
const todoRef = collection(db,"todos");

window.addTask = () => {
const input = document.getElementById("todoInput");
if (!input.value.trim()) return;

addDoc(todoRef,{
text:input.value,
time:Date.now()
});

input.value="";
};

onSnapshot(query(todoRef,orderBy("time","asc")),(snap)=>{
const list=document.getElementById("todoList");
list.innerHTML="";
snap.forEach(d=>{
const li=document.createElement("li");
li.textContent=d.data().text;
list.appendChild(li);
});
});

// MALANA
window.askMalana = () => {
const input=document.getElementById("aiInput");
if(!input.value.trim()) return;

const box=document.getElementById("aiMessages");

box.innerHTML+=`<div class="message">${input.value}</div>`;

const replies=["I hear you ❤️","Got you.","Keep going ❤️"];

box.innerHTML+=`<div class="message">${replies[Math.floor(Math.random()*replies.length)]}</div>`;

input.value="";
};

// GAME
let current="X";

window.move=(cell)=>{
if(cell.textContent) return;
cell.textContent=current;
current=current==="X"?"O":"X";
};