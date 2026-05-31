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

// ================= USERS =================
let currentUser = null;

const WIFE_EMAIL = "mnrudnick4@gmail.com";

// ================= LOGIN =================
onAuthStateChanged(auth, (user) => {
if (user) {
currentUser = user;

document.getElementById("loginPage").style.display = "none";
document.getElementById("app").style.display = "block";

markSeenMessages(); // read receipts
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

// ================= CHAT =================
const chatRef = collection(db, "messages");

window.sendMessage = () => {
const input = document.getElementById("messageInput");
if (!input.value.trim()) return;

addDoc(chatRef, {
text: input.value,
sender: currentUser.email,
time: Date.now(),
seenBy: []
});

input.value = "";
};

// ================= READ RECEIPTS =================
async function markSeenMessages(){
const snap = await new Promise(resolve => {
onSnapshot(query(chatRef, orderBy("time","asc")), resolve);
});

snap.forEach(async (docSnap) => {
const data = docSnap.data();

if (!data.seenBy) return;

if (!data.seenBy.includes(currentUser.email)) {
await updateDoc(doc(db, "messages", docSnap.id), {
seenBy: [...(data.seenBy || []), currentUser.email]
});
}
});
}

// ================= RENDER CHAT =================
onSnapshot(query(chatRef, orderBy("time","asc")), (snap) => {

const box = document.getElementById("messages");
box.innerHTML = "";

snap.forEach(docSnap => {

const data = docSnap.data();

const isYou = data.sender === currentUser?.email;
const isWife = data.sender === WIFE_EMAIL;

let color = "#2a2f36"; // default gray

if (isWife) color = "#ff4fa3"; // PINK (wife)
if (isYou) color = "#3a86ff"; // BLUE (you)

const seen = data.seenBy?.length > 1 ? "Seen 👀" : "";

const div = document.createElement("div");

div.style.maxWidth = "75%";
div.style.margin = "6px";
div.style.padding = "10px";
div.style.borderRadius = "15px";
div.style.color = "white";
div.style.alignSelf = isYou ? "flex-end" : "flex-start";
div.style.background = color;

div.innerHTML = `
${data.text || ""}
<div style="font-size:10px;opacity:0.7;margin-top:5px;">
${seen}
</div>
`;

box.appendChild(div);
});

});

// ================= TODO =================
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

// ================= MALANA =================
window.askMalana = () => {
const input=document.getElementById("aiInput");
if(!input.value.trim()) return;

const box=document.getElementById("aiMessages");

box.innerHTML+=`
<div class="message">${input.value}</div>
`;

box.innerHTML+=`
<div class="message">
${["I hear you ❤️","Got you.","Keep going ❤️"][Math.floor(Math.random()*3)]}
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