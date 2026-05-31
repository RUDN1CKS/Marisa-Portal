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

// ================= LOGIN =================
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

// ================= NAV =================
window.showPage = (page) => {
["chatPage","todoPage","malanaPage","gamesPage"].forEach(id=>{
document.getElementById(id).classList.add("hidden");
});
document.getElementById(page + "Page").classList.remove("hidden");
};

// ================= TIME =================
function formatTime(ms){
return new Date(ms).toLocaleTimeString([], {
hour:"2-digit",
minute:"2-digit"
});
}

// ================= CHAT (COUPLE MODE) =================
const chatRef = collection(db, "messages");

window.sendMessage = () => {
const input = document.getElementById("messageInput");
const text = input.value.trim();
if(!text) return;

// default = YOU
addDoc(chatRef, {
text,
sender: "you",
time: Date.now()
});

input.value = "";
};

onSnapshot(query(chatRef, orderBy("time","asc")), (snap) => {

const box = document.getElementById("messages");
box.innerHTML = "";

snap.forEach(doc => {

const data = doc.data();

const isYou = data.sender === "you";

const div = document.createElement("div");

div.style.maxWidth = "75%";
div.style.margin = "5px";
div.style.padding = "10px";
div.style.borderRadius = "15px";
div.style.color = "white";
div.style.alignSelf = isYou ? "flex-end" : "flex-start";
div.style.background = isYou ? "#3a86ff" : "#2a2f36";

div.innerHTML = `
${data.text}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${formatTime(data.time)}
</div>
`;

box.appendChild(div);

});

});

// ================= TODO =================
const todoRef = collection(db,"todos");

window.addTask = () => {
const input = document.getElementById("todoInput");
if(!input.value.trim()) return;

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

// ================= MALANA =================
window.askMalana = () => {
const input=document.getElementById("aiInput");
if(!input.value.trim()) return;

const box=document.getElementById("aiMessages");

box.innerHTML+=`
<div style="background:#3a86ff;padding:10px;border-radius:10px;margin:5px;">
${input.value}
</div>
`;

const replies=[
"I hear you ❤️",
"You’ve got this.",
"That makes sense.",
"I’m here with you."
];

box.innerHTML+=`
<div style="background:#2a2f36;padding:10px;border-radius:10px;margin:5px;">
${replies[Math.floor(Math.random()*replies.length)]}
</div>
`;

input.value="";
};

// ================= GAME =================
let current="X";

window.move=(cell)=>{
if(cell.textContent) return;
cell.textContent=current;
current=current==="X"?"O":"X";
};