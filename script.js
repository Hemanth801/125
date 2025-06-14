const promptInput = document.getElementById("prompt");
const submitBtn = document.getElementById("submit");
const chatContainer = document.querySelector(".chat-container");

const API_KEY = "AIzaSyCoYq9u23s2T5yGnKR5LKtHfTTDwcwaRRI";
const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${API_KEY}`;

submitBtn.addEventListener("click", () => {
  const userText = promptInput.value.trim();
  if (!userText) return;

  addChat("user", userText);
  promptInput.value = "";
  sendToGemini(userText);
});

async function sendToGemini(userText) {
  const aiChat = addChat("ai", "");

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
    updateChat(aiChat, aiText);
  } catch (err) {
    console.error(err);
    updateChat(aiChat, "Error fetching response. Check console.");
  }
}

function addChat(sender, text) {
  const chatEl = document.createElement("div");
  chatEl.classList.add("chat", sender);

  const imgEl = document.createElement("img");
  imgEl.src = sender === "user" ? "user.png" : "ai.png";
  chatEl.appendChild(imgEl);

  const bubbleEl = document.createElement("div");
  bubbleEl.classList.add(`${sender}-chat`);
  bubbleEl.innerHTML = sender === "ai"
    ? `<div class="loader"><span></span><span></span><span></span></div><p class="text"></p>`
    : `<p class="text">${escapeHtml(text)}</p>`;

  chatEl.appendChild(bubbleEl);
  chatContainer.appendChild(chatEl);
  chatContainer.scrollTop = chatContainer.scrollHeight;

  return sender === "ai" ? chatEl.querySelector(".text") : null;
}

function updateChat(aiTextEl, text) {
  aiTextEl.textContent = text;
}

function escapeHtml(str) {
  const div = document.createElement("div");
  div.textContent = str;
  return div.innerHTML;
}
