var ws;
var esp32IP = "ws://192.168.4.1:81/";  // Update ESP32 IP if needed
var correctPassword = "mysecurepass"; // Change this!
var selectedControl = ""; // Stores the selected control type

document.getElementById("drive-btn").addEventListener("click", function() {
    document.getElementById("control-selection").style.display = "block";
});

function selectControl(type) {
    selectedControl = type;
    document.getElementById("control-selection").style.display = "none";
    document.getElementById("connection-section").style.display = "block";
}

function connectESP32() {
    ws = new WebSocket(esp32IP);
    ws.onopen = () => { 
        alert("Connected to ESP32!"); 
        document.getElementById("connection-section").style.display = "none";
        document.getElementById("password-section").style.display = "block";
    };
    ws.onerror = () => alert("Connection failed! Make sure ESP32 is on.");
}

function checkPassword() {
    var inputPass = document.getElementById("password").value;
    if (inputPass === correctPassword) {
        document.getElementById("password-section").style.display = "none";

        if (selectedControl === "button") {
            document.getElementById("button-controls").style.display = "block";
        } else if (selectedControl === "voice") {
            document.getElementById("voice-controls").style.display = "block";
        }
    } else {
        alert("Incorrect password!");
    }
}

function sendCommand(command) {
    if (ws && ws.readyState === WebSocket.OPEN) {
        ws.send(command);
        localStorage.setItem("lastCommand", command); // Store last command
        document.getElementById("last-command").innerText = "Last Command: " + command;
    } else {
        alert("Not connected to ESP32!");
    }
}

function startVoiceControl() {
    var recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
    recognition.onresult = function(event) {
        var command = event.results[0][0].transcript.toLowerCase();
        if (command.includes("forward")) sendCommand("FORWARD");
        if (command.includes("backward")) sendCommand("BACKWARD");
        if (command.includes("left")) sendCommand("LEFT");
        if (command.includes("right")) sendCommand("RIGHT");
        if (command.includes("stop")) sendCommand("STOP");
    };
    recognition.start();
}

// Load Last Session Info
document.addEventListener("DOMContentLoaded", function() {
    var lastCommand = localStorage.getItem("lastCommand") || "None";
    document.getElementById("last-command").innerText = "Last Command: " + lastCommand;
});
