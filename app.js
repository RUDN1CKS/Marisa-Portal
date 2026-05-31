// PAGE NAVIGATION

function showPage(page){

    document.getElementById("chatPage").classList.add("hidden");
    document.getElementById("todoPage").classList.add("hidden");
    document.getElementById("malanaPage").classList.add("hidden");
    document.getElementById("gamesPage").classList.add("hidden");

    document.getElementById(page + "Page").classList.remove("hidden");
}


// CHAT

function sendMessage(){

    const input = document.getElementById("messageInput");
    const text = input.value.trim();

    if(text === "") return;

    const bubble = document.createElement("div");

    bubble.className = "message sent";
    bubble.textContent = text;

    document.getElementById("messages").appendChild(bubble);

    input.value = "";

    const messages = document.getElementById("messages");
    messages.scrollTop = messages.scrollHeight;
}


// TODO LIST

function addTask(){

    const input = document.getElementById("todoInput");

    if(input.value.trim() === "") return;

    const li = document.createElement("li");
    li.textContent = input.value;

    document.getElementById("todoList").appendChild(li);

    input.value = "";
}


// MALANA AI

function askMalana(){

    const input = document.getElementById("aiInput");
    const text = input.value.trim();

    if(text === "") return;

    const aiMessages = document.getElementById("aiMessages");

    const userBubble = document.createElement("div");
    userBubble.className = "message sent";
    userBubble.textContent = text;

    aiMessages.appendChild(userBubble);

    const replies = [

        "That sounds like a good idea ❤️",
        "I think Marisa would like that 😊",
        "Want me to help plan it?",
        "You should definitely go for it.",
        "I'm still learning, but that sounds interesting.",
        "Maybe ask Marisa what she thinks 😄",
        "That's actually pretty smart.",
        "You two should make a memory out of that ❤️",
        "I'm rooting for you."
    ];

    const aiBubble = document.createElement("div");
    aiBubble.className = "message received";

    aiBubble.textContent =
        replies[Math.floor(Math.random() * replies.length)];

    aiMessages.appendChild(aiBubble);

    input.value = "";

    aiMessages.scrollTop = aiMessages.scrollHeight;
}


// TIC TAC TOE

let currentPlayer = "X";

function move(cell){

    if(cell.textContent !== "") return;

    cell.textContent = currentPlayer;

    currentPlayer =
        currentPlayer === "X"
        ? "O"
        : "X";

}
