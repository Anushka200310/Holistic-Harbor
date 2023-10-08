const chatMessages = document.getElementById('chat-messages');
const messageInput = document.getElementById('message-input');

// Fetch the intents data from the JSON file
const INTENTS_URL = 'data/response.json';

async function getIntents() {
    const response = await fetch(INTENTS_URL);
    const data = await response.json();
    return data.intents;
}

// Get random response from an array of responses
function getRandomResponse(responses) {
    const randomIndex = Math.floor(Math.random() * responses.length);
    return responses[randomIndex];
}

// Generate a bot response based on user input
async function generateBotResponse(userMessage) {
    const lowerCaseUserMessage = userMessage.toLowerCase().trim();
    const intents = await getIntents();

    // Check if the user's message matches any intent pattern
    const intent = intents.find(intent => {
        return intent.patterns.some(pattern => lowerCaseUserMessage.includes(pattern.toLowerCase()));
    });

    // If a matching intent is found, return a random response from that intent
    if (intent) {
        const response = getRandomResponse(intent.responses);
        return response;
    }

    // Handle other cases or user messages here
    return "I'm sorry, I didn't understand that. How can I assist you further?";
}


// Add a message to the chat container
function addMessageToChat(message, sender) {
    const messageElement = document.createElement('div');
    messageElement.className = `message ${sender}`;
    messageElement.innerText = message;
    chatMessages.appendChild(messageElement);
}

// Handle user message input
function sendMessage() {
    const userMessage = messageInput.value;
    if (userMessage.trim() === '') {
        return;
    }

    // Add user message to the chat
    addMessageToChat(userMessage, 'user');

    // Get bot response and add it to the chat after a short delay
    setTimeout(async () => {
        const botResponse = await generateBotResponse(userMessage);
        addMessageToChat(botResponse, 'bot');
    }, 3000);

    // Clear the input field
    messageInput.value = '';
}

// Event listener for Enter key press
messageInput.addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        sendMessage();
    }
});

