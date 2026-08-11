const chatBox = document.getElementById("chat-box");
const chatForm = document.getElementById("chat-form");
const userInput = document.getElementById("user-input");
const sendButton = document.getElementById("send-button");
const typing = document.getElementById("typing");

let messages = [];

function addMessage(message, sender) {

    const messageWrapper = document.createElement("div");

    messageWrapper.classList.add(
        "message",
        sender === "user" ? "user-message" : "ai-message"
    );

    const messageContent = document.createElement("div");

    messageContent.classList.add("message-content");

    messageContent.textContent = message;

    messageWrapper.appendChild(messageContent);

    chatBox.appendChild(messageWrapper);

    chatBox.scrollTop = chatBox.scrollHeight;
}

chatForm.addEventListener("submit", async (event) => {

    event.preventDefault();

    const message = userInput.value.trim();

    if (!message) {
        return;
    }

    addMessage(message, "user");

    messages.push({
        role: "user",
        content: message
    });

    userInput.value = "";

    sendButton.disabled = true;
    typing.style.display = "block";

    try {

        const response = await fetch("/api/chat", {
            method: "POST",

            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify({
                messages: messages
            })
        });

        const data = await response.json();

        if (!response.ok) {
            throw new Error(data.error || "Request failed.");
        }

        addMessage(data.reply, "ai");

        messages.push({
            role: "assistant",
            content: data.reply
        });

    } catch (error) {

        console.error(error);

        addMessage(
            "Sorry, I couldn't connect to the AI right now.",
            "ai"
        );

    } finally {

        sendButton.disabled = false;
        typing.style.display = "none";

        userInput.focus();
    }
});