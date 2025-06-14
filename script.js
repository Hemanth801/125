const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submit");
const chatContainer = document.querySelector(".chat-container");

const API_KEY = "AIzaSyCoYq9u23s2T5yGnKR5LKtHfTTDwcwaRRI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

// Auto-focus input on load
window.onload = () => {
  promptInput.focus();
};

// Submit on button click or Enter key
submitBtn.addEventListener("click", handleSubmit);
promptInput.addEventListener("keydown", (e) => {
  if (e.key === "Enter") handleSubmit();
});

function handleSubmit() {
  const userText = promptInput.value.trim();
  if (!userText) return;

  addChat("user", userText);
  promptInput.value = "";
  sendToGemini(userText);
}

async function sendToGemini(userText) {
  const aiChatBox = addChat("ai", ""); // placeholder

  try {
    const response = await fetch(API_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        contents: [
          {
            parts: [{ text: userText }]
          }
        ]
      })
    });

    const data = await response.json();
    const aiText = data.candidates?.[0]?.content?.parts?.[0]?.text || "Sorry, no response.";
    simulateTyping(aiChatBox.querySelector(".ai-chat-area"), aiText);
  } catch (err) {
    console.error(err);
    aiChatBox.querySelector(".ai-chat-area").innerText = "Error fetching response.";
  }
}

function addChat(sender, message) {
  const chatBox = document.createElement("div");
  const isUser = sender === "user";

  chatBox.className = isUser ? "user-chat-box" : "ai-chat-box";
  chatBox.innerHTML = `
    <img src="${isUser ? 'user.png' : 'ai.png'}" id="${isUser ? 'userImage' : 'aiImage'}" width="10%">
    <div class="${isUser ? 'user-chat-area' : 'ai-chat-area'}">
      ${message || '<div class="loader"><span></span><span></span><span></span></div>'}
    </div>
  `;

  chatContainer.appendChild(chatBox);
  chatContainer.scrollTop = chatContainer.scrollHeight;
  return chatBox;
}

function simulateTyping(container, text) {
  container.innerHTML = "";
  let index = 0;
  const interval = setInterval(() => {
    container.textContent += text.charAt(index++);
    chatContainer.scrollTop = chatContainer.scrollHeight;
    if (index === text.length) clearInterval(interval);
  }, 20); // typing speed
}
