function showPage(page){

document.getElementById("chatPage").classList.add("hidden");
document.getElementById("todoPage").classList.add("hidden");
document.getElementById("malanaPage").classList.add("hidden");
document.getElementById("gamesPage").classList.add("hidden");

document.getElementById(page + "Page").classList.remove("hidden");

}

window.showPage = showPage;


// =======================
// CHAT
// =======================

function getTimeStamp(){

const now = new Date();

let hours = now.getHours();
let minutes = now.getMinutes();

let ampm = hours >= 12 ? "PM" : "AM";

hours = hours % 12;
hours = hours ? hours : 12;

minutes = minutes < 10 ? "0" + minutes : minutes;

return `${hours}:${minutes} ${ampm}`;

}

function sendMessage(){

const input = document.getElementById("messageInput");

if(!input.value.trim()) return;

const msg = document.createElement("div");
msg.className = "message sent";

msg.innerHTML = `
${input.value}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${getTimeStamp()}
</div>
`;

document.getElementById("messages").appendChild(msg);

input.value = "";

}

window.sendMessage = sendMessage;


// =======================
// TODO
// =======================

function addTask(){

const input = document.getElementById("todoInput");

if(!input.value.trim()) return;

const li = document.createElement("li");

li.innerHTML = `
${input.value}
<span style="font-size:10px;opacity:0.6;margin-left:8px;">
${getTimeStamp()}
</span>
`;

document.getElementById("todoList").appendChild(li);

input.value = "";

}

window.addTask = addTask;


// =======================
// MALANA
// =======================

function askMalana(){

const input = document.getElementById("aiInput");

if(!input.value.trim()) return;

const box = document.getElementById("aiMessages");

const user = document.createElement("div");
user.className = "message sent";

user.innerHTML = `
${input.value}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${getTimeStamp()}
</div>
`;

box.appendChild(user);

const replies = [
"I’m listening ❤️",
"That makes sense.",
"You’re doing great.",
"You’ve got this.",
"Tell Marisa that ❤️",
"I’m here with you."
];

const ai = document.createElement("div");
ai.className = "message received";

ai.innerHTML = `
${replies[Math.floor(Math.random()*replies.length)]}
<div style="font-size:10px;opacity:0.6;margin-top:5px;">
${getTimeStamp()}
</div>
`;

box.appendChild(ai);

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