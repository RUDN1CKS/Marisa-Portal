function showPage(page){

document.getElementById("chatPage").classList.add("hidden");
document.getElementById("todoPage").classList.add("hidden");
document.getElementById("malanaPage").classList.add("hidden");
document.getElementById("gamesPage").classList.add("hidden");

document.getElementById(page + "Page").classList.remove("hidden");

}

window.showPage = showPage;

// CHAT
function sendMessage(){

const input = document.getElementById("messageInput");

if(!input.value.trim()) return;

const msg = document.createElement("div");
msg.className = "message sent";
msg.textContent = input.value;

document.getElementById("messages").appendChild(msg);

input.value = "";

}

window.sendMessage = sendMessage;

// TODO
function addTask(){

const input = document.getElementById("todoInput");

if(!input.value.trim()) return;

const li = document.createElement("li");
li.textContent = input.value;

document.getElementById("todoList").appendChild(li);

input.value = "";

}

window.addTask = addTask;

// MALANA
function askMalana(){

const input = document.getElementById("aiInput");

if(!input.value.trim()) return;

const box = document.getElementById("aiMessages");

const user = document.createElement("div");
user.className = "message sent";
user.textContent = input.value;

box.appendChild(user);

const replies = [
"I’m listening ❤️",
"That makes sense.",
"You’re doing great.",
"Tell Marisa that ❤️",
"I’ve got you.",
"Keep going."
];

const ai = document.createElement("div");
ai.className = "message received";
ai.textContent = replies[Math.floor(Math.random()*replies.length)];

box.appendChild(ai);

input.value = "";

}

window.askMalana = askMalana;

// TIC TAC TOE
let current = "X";

function move(cell){

if(cell.textContent !== "") return;

cell.textContent = current;

current = current === "X" ? "O" : "X";

}

window.move = move;