const messageInput = document.querySelector(".message-input");
const sendButton = document.querySelector(".send-btn");
const chatMessages = document.querySelector(".chat-messages");
const typingIndicator = document.querySelector(".typing-indicator");
const themeToggle = document.querySelector(".toggle-theme");
const usernameModal = document.getElementById("usernameModal");
const usernameInput = document.getElementById("usernameInput");
const saveUsernameBtn = document.getElementById("saveUsername");
const changeUsernameBtn = document.getElementById("changeUsernameBtn");

let isDarkMode = false;
let username = localStorage.getItem("username") || ""; // Load saved username
const userAvatar = "https://i.pravatar.cc/35?img=3"; // Random avatar for user
const botAvatar = "https://i.pravatar.cc/35?img=5"; // Random avatar for bot

// Show modal if no username is set
if (!username) {
    usernameModal.style.display = "flex";
}

// Event listeners
document.addEventListener("DOMContentLoaded", () => {
    loadChatHistory();
    showWelcomeMessage(); // Show welcome message when first visiting
});

sendButton.addEventListener("click", () => {
    const text = messageInput.value;
    sendMessage(text);
    messageInput.value = "";
    botResponse();
});

messageInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        sendButton.click();
    }
});

themeToggle.addEventListener("click", () => {
    isDarkMode = !isDarkMode;
    document.body.classList.toggle("dark-mode");
    themeToggle.innerHTML = isDarkMode ? `<i class="fas fa-sun"></i>` : `<i class="fas fa-moon"></i>`;
});

saveUsernameBtn.addEventListener("click", () => {
    const name = usernameInput.value.trim();
    if (name) {
        localStorage.setItem("username", name);
        username = name;
        usernameModal.style.display = "none";
        updateChatUsername();
    }
});

changeUsernameBtn.addEventListener("click", () => {
    usernameModal.style.display = "flex";
});

// Functions
function sendMessage(text, isSent = true) {
    if (!text.trim()) return;

    const avatarImg = isSent ? userAvatar : botAvatar;
    const displayName = isSent ? username : "ChatBot";

    const messageContainer = document.createElement("div");
    messageContainer.classList.add("message-container", isSent ? "sent" : "received");

    messageContainer.innerHTML = `
        <img src="${avatarImg}" class="avatar">
        <div class="message ${isSent ? "sent" : "received"}">
            <strong>${displayName}</strong>
            <p>${text}</p>
            <small class="message-timestamp">${getCurrentTime()}</small>
        </div>
    `;

    chatMessages.appendChild(messageContainer);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    saveMessage(text, isSent);
}

function getCurrentTime() {
    const now = new Date();
    return now.getHours() + ":" + now.getMinutes().toString().padStart(2, '0');
}

function saveMessage(text, isSent) {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.push({ text, isSent, timestamp: getCurrentTime() });
    localStorage.setItem("chatHistory", JSON.stringify(chatHistory));
}

function loadChatHistory() {
    let chatHistory = JSON.parse(localStorage.getItem("chatHistory")) || [];
    chatHistory.forEach(msg => {
        sendMessage(msg.text, msg.isSent);
    });
}

function botResponse() {
    typingIndicator.style.display = "block";

    setTimeout(() => {
        typingIndicator.style.display = "none";
        sendMessage("This is an automated response.", false);
    }, 2000);
}

function updateChatUsername() {
    document.querySelectorAll(".message.sent strong").forEach((userLabel) => {
        userLabel.textContent = username;
    });
}

function showWelcomeMessage() {
    if (!localStorage.getItem("hasVisitedBefore")) {
        sendMessage(`Welcome, ${username}! 🎉 Start chatting below.`, false);
        localStorage.setItem("hasVisitedBefore", "true"); // Prevent message from repeating
    }
}

document.querySelector(".clear-chat").addEventListener("click", () => {
    localStorage.removeItem("chatHistory");
    chatMessages.innerHTML = "";
});
