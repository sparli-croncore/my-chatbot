const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama3-8b-8192";

const setupScreen = document.getElementById("setupScreen");
const chatContainer = document.getElementById("chatContainer");
const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

const conversationHistory = [
  {
    role: "system",
    content: "You are a helpful and friendly AI assistant. Answer questions clearly and concisely."
  }
];

// On load: check if API key is already saved
window.addEventListener("load", () => {
  const savedKey = localStorage.getItem("groq_api_key");
  if (savedKey) {
    showChat();
  } else {
    setupScreen.style.display = "flex";
  }
});

function saveApiKey() {
  const key = document.getElementById("apiKeyInput").value.trim();
  if (!key) {
    alert("Please enter your API key.");
    return;
  }
  localStorage.setItem("groq_api_key", key);
  showChat();
}

function showChat() {
  setupScreen.style.display = "none";
  chatContainer.style.display = "flex";
  userInput.focus();
}

function resetApiKey() {
  localStorage.removeItem("groq_api_key");
  chatContainer.style.display = "none";
  setupScreen.style.display = "flex";
  document.getElementById("apiKeyInput").value = "";
}

function appendMessage(role, text, isLoading = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", role);

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");
  if (isLoading) bubble.classList.add("loading");
  bubble.textContent = text;

  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return bubble;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  const apiKey = localStorage.getItem("groq_api_key");
  if (!apiKey) {
    resetApiKey();
    return;
  }

  userInput.value = "";
  sendBtn.disabled = true;
  userInput.disabled = true;

  appendMessage("user", text);
  conversationHistory.push({ role: "user", content: text });

  const loadingBubble = appendMessage("bot", "Thinking...", true);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${apiKey}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) {
      throw new Error("API request failed");
    }

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: botReply });

    loadingBubble.classList.remove("loading");
    loadingBubble.textContent = botReply;
  } catch (error) {
    loadingBubble.classList.remove("loading");
    loadingBubble.textContent = "Sorry, something went wrong. Please check your API key or try again.";
  }

  sendBtn.disabled = false;
  userInput.disabled = false;
  userInput.focus();
}

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter") sendMessage();
});
