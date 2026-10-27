const chatForm = document.getElementById('chat-form');
const userInput = document.getElementById('user-input');
const chatMessages = document.getElementById('chat-messages');

let chatHistory = [];
// Change this endpoint if deploying backend to production
const API_URL = 'http://localhost:8000/api/chat';

chatForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const messageText = userInput.value.trim();
    if (!messageText) return;

    appendMessage(messageText, 'user');
    chatHistory.push({ role: 'user', content: messageText });
    
    userInput.value = '';
    userInput.disabled = true;

    const loadingId = appendLoadingMessage();

    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message: messageText,
                history: chatHistory.slice(0, -1) // Send past messages for context
            }),
        });

        if (!response.ok) throw new Error('Server returned an error.');

        const data = await response.json();
        removeMessage(loadingId);

        appendMessage(data.reply, 'assistant');
        chatHistory.push({ role: 'assistant', content: data.reply });

    } catch (error) {
        removeMessage(loadingId);
        appendMessage('Error: Could not reach the tutor service. Please check if the backend is running.', 'assistant');
        console.error(error);
    } finally {
        userInput.disabled = false;
        userInput.focus();
    }
});

// Robust preprocessor to convert backend LaTeX formats into standard KaTeX delimiters
function preprocessMath(text) {
    if (!text) return '';

    // 1. Convert square bracket blocks like [ formula ] to display math $$ formula $$
    text = text.replace(/\[\s*([^\]]+?)\s*\]/g, (match, p1) => {
        if (/[\/\\]|[=<>^_+\-*]|\b(frac|displaystyle|quad|text|or|and|sin|cos)\b/.test(p1)) {
            return `$$${p1.trim()}$$`;
        }
        return match;
    });

    // 2. Convert parenthesized LaTeX expressions like (\displaystyle ...) or (; x^3 \to ...) or (a \neq 0)
    text = text.replace(/\(\s*(;)?\s*([\\a-zA-Z0-9_{}^+\-*\/()\[\]\s.,!=->]+)\s*\)/g, (match, semicolon, p1) => {
        const content = p1.trim();
        if (/\\[a-zA-Z]+|[=<>^_~+\-*]|\b(to|neq|pm|frac|displaystyle|cdot|big|Big)\b/.test(content)) {
            return `$${content}$`;
        }
        return match;
    });

    return text;
}

function appendMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', `${sender}-message`);

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');

    if (sender === 'assistant') {
        // Preprocess math formatting and parse markdown into HTML
        const processedText = preprocessMath(text);
        contentDiv.innerHTML = marked.parse(processedText);

        // Render equations using KaTeX auto-render
        if (typeof renderMathInElement === 'function') {
            renderMathInElement(contentDiv, {
                delimiters: [
                    {left: '$$', right: '$$', display: true},
                    {left: '$', right: '$', display: false},
                    {left: '\\(', right: '\\)', display: false},
                    {left: '\\[', right: '\\]', display: true}
                ],
                throwOnError: false
            });
        }
    } else {
        // Use textContent for user messages for safety
        contentDiv.textContent = text;
    }

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv;
}

function appendLoadingMessage() {
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('message', 'assistant-message', 'loading');
    messageDiv.id = 'loading-' + Date.now();

    const contentDiv = document.createElement('div');
    contentDiv.classList.add('message-content');
    contentDiv.textContent = 'EduBot is thinking...';

    messageDiv.appendChild(contentDiv);
    chatMessages.appendChild(messageDiv);
    chatMessages.scrollTop = chatMessages.scrollHeight;

    return messageDiv.id;
}

function removeMessage(id) {
    const element = document.getElementById(id);
    if (element) element.remove();
}
