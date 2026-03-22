# AI Chatbot

A simple, free AI chatbot built with HTML, CSS, and JavaScript — powered by the Groq API.

## Features

- Answers general questions in natural language
- Renders formatted responses (bold, lists, code blocks, tables)
- Animated typing indicator while the bot is thinking
- Glassmorphism UI with animated background
- Fully responsive on desktop and mobile

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Frontend | HTML, CSS, JavaScript |
| AI Model | Llama 3.3 70B via [Groq API](https://console.groq.com) |
| Hosting | GitHub Pages (free) |

## Live Demo

[your-username.github.io/my-chatbot](https://your-username.github.io/my-chatbot/)

## Project Structure

```
my-chatbot/
├── index.html    # Chat UI structure
├── style.css     # Glassmorphism design & animations
├── script.js     # Groq API integration & chat logic
└── README.md
```

## How to Run Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/your-username/my-chatbot.git
   ```
2. Open `index.html` in your browser — no build step needed.

## Customization

- **Bot name/personality** — Edit the `system` message in `script.js`
- **Colors** — Update the CSS variables at the top of `style.css`
- **Model** — Change the `MODEL` constant in `script.js` to any [supported Groq model](https://console.groq.com/docs/models)
