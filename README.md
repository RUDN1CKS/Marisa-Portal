# Marisa-Portal
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Marisa Portal</title>
    <link rel="stylesheet" href="style.css">
</head>

<body>

<div class="app">

    <!-- SIDEBAR -->
    <div class="sidebar">
        <h2>MP</h2>

        <button onclick="showTab('home')">🏠 Home</button>
        <button onclick="showTab('chat')">💬 Chat</button>
        <button onclick="showTab('todo')">📝 To-Do</button>
        <button onclick="showTab('malana')">🤖 Malana</button>
        <button onclick="showTab('games')">🎮 Games</button>
    </div>

    <!-- MAIN AREA -->
    <div class="main">

        <!-- HOME -->
        <div id="home" class="tab active">
            <h1>Welcome to Marisa Portal ❤️</h1>
            <div class="card">
                Your private hub for chat, tasks, games, and Malana AI.
            </div>
        </div>

        <!-- CHAT -->
        <div id="chat" class="tab">
            <h1>💬 Chat</h1>

            <div id="chatBox" class="box"></div>

            <div class="row">
                <input id="chatInput" placeholder="Type a message...">
                <button onclick="sendMessage()">Send</button>
            </div>
        </div>

        <!-- TODO -->
        <div id="todo" class="tab">
            <h1>📝 To-Do List</h1>

            <div class="row">
                <input id="todoInput" placeholder="Add task...">
                <button onclick="addTask()">Add</button>
            </div>

            <ul id="todoList"></ul>
        </div>

        <!-- MALANA -->
        <div id="malana" class="tab">
            <h1>🤖 Malana AI</h1>

            <div id="aiBox" class="box"></div>

            <div class="row">
                <input id="aiInput" placeholder="Ask Malana...">
                <button onclick="askMalana()">Ask</button>
            </div>
        </div>

        <!-- GAMES -->
        <div id="games" class="tab">
            <h1>🎮 Games</h1>

            <div class="card">
                <p>Tic Tac Toe coming next step 👀</p>
            </div>
        </div>

    </div>

</div>

<script src="app.js"></script>

</body>
</html>