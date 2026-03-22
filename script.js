const GROQ_API_KEY = "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";
const GROQ_API_URL = "https://api.groq.com/openai/v1/chat/completions";
const MODEL = "llama-3.3-70b-versatile";

const chatMessages = document.getElementById("chatMessages");
const userInput = document.getElementById("userInput");
const sendBtn = document.getElementById("sendBtn");

marked.setOptions({ breaks: true, gfm: true });

const conversationHistory = [
  {
    role: "system",
    content: "You are a helpful and friendly AI assistant. Answer questions clearly and concisely."
  }
];

function appendMessage(role, text, isLoading = false) {
  const messageDiv = document.createElement("div");
  messageDiv.classList.add("message", role);

  if (role === "bot") {
    const avatar = document.createElement("div");
    avatar.classList.add("avatar", "bot-avatar");
    avatar.innerHTML = `<svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="8" width="18" height="13" rx="2"/>
      <path d="M12 8V5"/>
      <circle cx="12" cy="4" r="1"/>
      <circle cx="8.5" cy="14" r="1.2" fill="white" stroke="none"/>
      <circle cx="15.5" cy="14" r="1.2" fill="white" stroke="none"/>
      <path d="M9 18h6"/>
    </svg>`;
    messageDiv.appendChild(avatar);
  }

  const bubble = document.createElement("div");
  bubble.classList.add("bubble");

  if (isLoading) {
    bubble.classList.add("typing-indicator");
    bubble.innerHTML = "<span></span><span></span><span></span>";
  } else {
    if (role === "bot") {
      bubble.innerHTML = marked.parse(text);
    } else {
      bubble.textContent = text;
    }
  }

  messageDiv.appendChild(bubble);
  chatMessages.appendChild(messageDiv);
  chatMessages.scrollTop = chatMessages.scrollHeight;

  return bubble;
}

async function sendMessage() {
  const text = userInput.value.trim();
  if (!text) return;

  userInput.value = "";
  sendBtn.disabled = true;
  userInput.disabled = true;

  appendMessage("user", text);
  conversationHistory.push({ role: "user", content: text });

  const loadingBubble = appendMessage("bot", "", true);

  try {
    const response = await fetch(GROQ_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: MODEL,
        messages: conversationHistory,
        temperature: 0.7,
        max_tokens: 1024
      })
    });

    if (!response.ok) throw new Error("API error");

    const data = await response.json();
    const botReply = data.choices[0].message.content;

    conversationHistory.push({ role: "assistant", content: botReply });

    loadingBubble.classList.remove("typing-indicator");
    loadingBubble.innerHTML = marked.parse(botReply);
    chatMessages.scrollTop = chatMessages.scrollHeight;
  } catch (error) {
    loadingBubble.classList.remove("typing-indicator");
    loadingBubble.textContent = "Sorry, something went wrong. Please try again.";
  }

  sendBtn.disabled = false;
  userInput.disabled = false;
  userInput.focus();
}

userInput.addEventListener("keydown", function (e) {
  if (e.key === "Enter" && !e.shiftKey) {
    e.preventDefault();
    sendMessage();
  }
});
