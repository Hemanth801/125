let prompt = document.querySelector("#prompt");
let submitbtn = document.querySelector("#submit");
let chatContainer = document.querySelector(".chat-container");
let imagebtn = document.querySelector("#image");
let image = document.querySelector("#image img");
let imageinput = document.querySelector("#image input");

const Api_Url = "https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=AIzaSyCoYq9u23s2T5yGnKR5LKtHfTTDwcwaRRI";

let user = {
    message: null,
    file: {
        mime_type: null,
        data: null
    }
};

async function generateResponse(aiChatBox) {
    let text = aiChatBox.querySelector(".ai-chat-area");
    let RequestOption = {
        method: "POST",
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            "contents": [
                {
                    "parts": [
                        { text: user.message },
                        ...(user.file.data ? [{ inline_data: user.file }] : [])
                    ]
                }
            ]
        })
    };

    try {
        let response = await fetch(Api_Url, RequestOption);
        let data = await response.json();
        text.textContent = data.candidates[0].content.parts[0].text;
    } catch (err) {
        text.textContent = "Something went wrong!";
        console.error(err);
    }
}

function showChat() {
    let chat = document.createElement("div");
    chat.classList.add("chat");
    chat.innerHTML = `
        <div class="user">
            <img src="user.png" alt="">
            <div class="user-chat">${user.message}</div>
        </div>
        <div class="ai">
            <img src="ai.png" alt="">
            <div class="ai-chat">
                <div class="loader">
                    <span></span><span></span><span></span>
                </div>
                <p class="ai-chat-area"></p>
            </div>
        </div>
    `;
    chatContainer.appendChild(chat);
    generateResponse(chat.querySelector(".ai"));
}

submitbtn.addEventListener("click", () => {
    user.message = prompt.value;
    showChat();
    prompt.value = "";
});

imagebtn.addEventListener("click", () => imageinput.click());

imageinput.addEventListener("change", () => {
    const file = imageinput.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
        user.file.mime_type = file.type;
        user.file.data = reader.result.split(",")[1]; // Base64 content
        image.src = reader.result;
        image.style.display = "block";
    };
    reader.readAsDataURL(file);
});
