// =======================
// PAGE NAVIGATION
// =======================

function showPage(page){

    document.getElementById("chatPage").classList.add("hidden");
    document.getElementById("todoPage").classList.add("hidden");
    document.getElementById("malanaPage").classList.add("hidden");
    document.getElementById("gamesPage").classList.add("hidden");

    document.getElementById(page + "Page").classList.remove("hidden");
}

// expose to HTML
window.showPage = showPage;


// =======================
// CHAT (LOCAL ONLY FOR NOW)
// =======================

function sendMessage(){

    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if(text === "") return;

    const msgBox = document.getElementById("messages");

    const bubble = document.createElement("div");
    bubble.className = "message sent";
    bubble.textContent = text;

    msgBox.appendChild(bubble);

    input.value = "";

    msgBox.scrollTop = msgBox.scrollHeight;
}

window.sendMessage = sendMessage;


// =======================
// TODO LIST (LOCAL)
// =======================

function addTask(){

    const input = document.getElementById("todoInput");
    const text = input.value.trim();

    if(text === "") return;

    const list = document.getElementById("todoList");

    const li = document.createElement("li");
    li.textContent = text;

    list.appendChild(li);

    input.value = "";
}

window.addTask = addTask;


// =======================
// MALANA AI (SIMPLE RESPONSES)
// =======================

function askMalana(){

    const input = document.getElementById("aiInput");
    const text = input.value.trim();

    if(text === "") return;

    const box = document.getElementById("aiMessages");

    // user message
    const user = document.createElement("div");
    user.className = "message sent";
    user.textContent = text;

    box.appendChild(user);

    // AI replies
    const replies = [
        "I hear you ❤️",
        "That actually makes sense.",
        "You and Marisa should talk that through 😊",
        "I think you're doing great.",
        "Let’s take it one step at a time.",
        "That sounds like something worth doing ❤️",
        "I'm here with you."
    ];

    const ai = document.createElement("div");
    ai.className = "message received";
    ai.textContent = replies[Math.floor(Math.random() * replies.length)];

    box.appendChild(ai);

    input.value = "";

    box.scrollTop = box.scrollHeight;
}

window.askMalana = askMalana;


// =======================
// TIC TAC TOE
// =======================

let currentPlayer = "X";

function move(cell){

    if(cell.textContent !== "") return;

    cell.textContent = currentPlayer;

    currentPlayer = currentPlayer === "X" ? "O" : "X";
}

window.move = move;