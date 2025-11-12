// Chat popup elements
const chatIcon = document.getElementById('chatIcon');
const chatPopup = document.getElementById('chatPopup');
const closeChat = document.getElementById('closeChat');
const chatContainer = document.getElementById('chatContainer');
const userInput = document.getElementById('userInput');
const sendBtn = document.getElementById('sendBtn');
const welcomePopup = document.getElementById('welcomePopup');

let chatStep = "initial";
let currentDevice = "";

// Device connection summaries
const devices = {
    "smart dishwasher": "1️⃣ Make sure it’s plugged in.\n2️⃣ Hold the Wi-Fi button for 5 seconds.\n3️⃣ Connect via the app.\nIf these steps fail, Connect to an 'Agent'.",
    "ai thermostat": "1️⃣ Power on the thermostat.\n2️⃣ Open the app and follow Wi-Fi setup.\n3️⃣ Ensure it shows 'Connected'.\nIf these steps fail, Connect to an 'Agent'.",
    "smart stove": "1️⃣ Ensure stove is powered.\n2️⃣ Hold Wi-Fi setup for 3 seconds.\n3️⃣ Retry connection in app.\nIf these steps fail, Connect to an 'Agent'.",
    "smart refrigerator": "1️⃣ Plug in the fridge.\n2️⃣ Press Wi-Fi button until LED blinks.\n3️⃣ Connect via app.\nIf these steps fail, Connect to an 'Agent'.",
    "smart washer/dryer": "1️⃣ Ensure washer/dryer is powered.\n2️⃣ Press Wi-Fi button 3 sec.\n3️⃣ Open app and connect.\nIf these steps fail, Connect to an 'Agent'.",
    "ai air purifier": "1️⃣ Power on the purifier.\n2️⃣ Open the app to connect to Wi-Fi.\n3️⃣ LED confirms connection.\nIf these steps fail, Connect to an 'Agent'.",
    "smart oven": "1️⃣ Turn oven on.\n2️⃣ Press Wi-Fi setup.\n3️⃣ Connect using app Wi-Fi setup.\nIf these steps fail, Connect to an 'Agent'.",
    "robot mower": "1️⃣ Power on mower.\n2️⃣ Press Wi-Fi button.\n3️⃣ Connect in app and test control.\nIf these steps fail, Connect to an 'Agent'.",
    "robot vacuum": "1️⃣ Power on vacuum.\n2️⃣ Hold Wi-Fi button.\n3️⃣ Connect through mobile app.\nIf these steps fail, Connect to an 'Agent'."
};

// Category responses
const categories = {
    "device": "Device Connection Setup selected. Which device is having the issue?",
    "general": "General Troubleshooting selected. Choose your device to proceed.",
    "password": "Password Issues selected. Choose the account type:",
};

// Password account options
const passwordAccounts = [
    {text: "Web Account", summary: "You can reset your web account password using the 'Forgot Password' link on the website. If still not working, Connect to an 'Agent'."},
    {text: "App Account", summary: "You can reset your app account password in the app settings under 'Reset Password'. If still not working, Connect to an 'Agent'."}
];

// Devices list
const deviceList = [
    "Smart Dishwasher",
    "AI Thermostat",
    "Smart Stove",
    "Smart Refrigerator",
    "Smart Washer/Dryer",
    "AI Air Purifier",
    "Smart Oven",
    "Robot Mower",
    "Robot Vacuum",
    "Other",
];

// ----------------- WELCOME POPUP -----------------
window.addEventListener('load', () => {
    // Show popup after slight delay
    setTimeout(() => {
        welcomePopup.classList.add('show');
    }, 500);
});

// Hide popup on hover
welcomePopup.addEventListener('mouseenter', () => {
    welcomePopup.classList.remove('show');
});

// Hide popup when chat opens
chatIcon.addEventListener('click', () => {
    chatPopup.style.display = 'flex';
    welcomePopup.classList.remove('show');
});

// ----------------- CHAT LOGIC -----------------

// Chat popup toggle
closeChat.addEventListener('click', () => chatPopup.style.display = 'none');

// Append initial category buttons
function appendInitialCategoryButtons() {
    chatContainer.innerHTML = ''; // Clear previous messages/buttons
    appendMessage("Hello! I'm your AI assistant. How can I help you today?", 'ai');

    const wrapper = document.createElement('div');
    wrapper.className = 'category-buttons';

    const mainCategories = [
        {text: "Device Connection Setup", value: "device"},
        {text: "General Troubleshooting", value: "general"},
        {text: "Password Issues", value: "password"},
    ];

    mainCategories.forEach(cat => {
        const btn = document.createElement('button');
        btn.textContent = cat.text;
        btn.dataset.category = cat.value;
        wrapper.appendChild(btn);
    });

    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}
appendInitialCategoryButtons();

// Event delegation for buttons
chatContainer.addEventListener('click', (e) => {
    if(e.target.tagName !== 'BUTTON') return;
    const category = e.target.dataset.category;
    if(category) {
        appendMessage(e.target.textContent, 'user');
        setTimeout(() => handleCategory(category), 500);
    }
});

// Send message
sendBtn.addEventListener('click', sendMessage);
userInput.addEventListener('keypress', e => { if(e.key==='Enter') sendMessage(); });

function sendMessage() {
    const msg = userInput.value.trim();
    if(!msg) return;
    appendMessage(msg, 'user');
    userInput.value = '';
    setTimeout(() => handleMessage(msg.toLowerCase()), 500);
}

// Handle category selection
function handleCategory(category) {
    if(category === "device") {
        appendMessage(categories[category], 'ai');
        appendDeviceButtons('setup');
        chatStep = 'deviceSetup';
    } else if(category === "general") {
        appendMessage(categories[category], 'ai');
        appendDeviceButtons('general');
        chatStep = 'generalTroubleshoot';
    } else if(category === "password") {
        appendMessage(categories[category], 'ai');
        appendPasswordOptions();
        chatStep = 'password';
    }
}

// Append device buttons
function appendDeviceButtons(type) {
    const existing = chatContainer.querySelector('.device-buttons');
    if(existing) existing.remove();

    const wrapper = document.createElement('div');
    wrapper.className = 'category-buttons device-buttons';

    deviceList.forEach(device => {
        const btn = document.createElement('button');
        btn.textContent = device;
        btn.onclick = () => {
            appendMessage(device, 'user');
            wrapper.remove();

            if(device.toLowerCase() === 'other') {
                appendMessage("Please describe your device or issue.", 'ai');
                showAgentOptions();
            } else if(type === 'setup') {
                const key = device.toLowerCase();
                if(devices[key]) appendMessage(devices[key], 'ai');
                showAgentOptions();
            } else if(type === 'general') {
                showAgentOptions();
            }
        };
        wrapper.appendChild(btn);
    });

    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Password options
function appendPasswordOptions() {
    const wrapper = document.createElement('div');
    wrapper.className = 'category-buttons device-buttons';

    passwordAccounts.forEach(acc => {
        const btn = document.createElement('button');
        btn.textContent = acc.text;
        btn.onclick = () => {
            appendMessage(acc.text, 'user');
            appendMessage(acc.summary, 'ai');
            showAgentOptions();
            wrapper.remove();
        };
        wrapper.appendChild(btn);
    });

    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Show Agent options
function showAgentOptions() {
    const wrapper = document.createElement('div');
    wrapper.className = 'agent-options';

    const callbackBtn = document.createElement('button');
    callbackBtn.textContent = "Receive Call Back";
    callbackBtn.onclick = () => {
        wrapper.remove();
        appendMessage("Please enter your phone number below:", 'ai');
        appendCallbackInput();
    };

    const liveChatBtn = document.createElement('button');
    liveChatBtn.textContent = "Live Chat";
    liveChatBtn.onclick = () => {
        wrapper.remove();
        appendMessage("Connecting you to the next available agent...", 'ai');
        showTypingAnimation(() => {
            appendMessage("Connected to agent.", 'ai');
            appendMessage("Hello, this is Dewey from AI Home Support. How may I help you?", 'ai');
        });
    };

    wrapper.appendChild(callbackBtn);
    wrapper.appendChild(liveChatBtn);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Callback input
function appendCallbackInput() {
    const wrapper = document.createElement('div');
    wrapper.className = 'input-wrapper';

    const input = document.createElement('input');
    input.type = 'tel';
    input.placeholder = 'Enter your phone number';

    const submitBtn = document.createElement('button');
    submitBtn.textContent = "Submit";
    submitBtn.onclick = () => {
        appendMessage(input.value, 'user');
        appendMessage("Thank you! You will receive a call back as soon as the next agent is available.", 'ai');
        wrapper.remove();
        appendBackButton();
    };

    wrapper.appendChild(input);
    wrapper.appendChild(submitBtn);
    chatContainer.appendChild(wrapper);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Typing animation for live chat
function showTypingAnimation(callback) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-bubble ai';
    bubble.textContent = 'Connecting';
    chatContainer.appendChild(bubble);

    let dots = 0;
    const interval = setInterval(() => {
        dots = (dots + 1) % 4;
        bubble.textContent = 'Connecting' + '.'.repeat(dots);
    }, 500);

    setTimeout(() => {
        clearInterval(interval);
        bubble.remove();
        callback();
    }, 3000);
}

// Append back button
function appendBackButton() {
    const btn = document.createElement('button');
    btn.textContent = "Back";
    btn.className = "back-button";
    btn.onclick = () => {
        btn.remove();
        appendInitialCategoryButtons();
        chatStep = "initial";
    };
    chatContainer.appendChild(btn);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Append chat message
function appendMessage(text, sender='ai') {
    const bubble = document.createElement('div');
    bubble.className = `chat-bubble ${sender}`;
    bubble.textContent = text;
    chatContainer.appendChild(bubble);
    chatContainer.scrollTop = chatContainer.scrollHeight;
}

// Handle user messages (basic logic)
function handleMessage(msg) {
    // fallback response
    appendMessage("I'm not sure how to help with that. Please select a category or connect to an agent.", 'ai');
}
// Make chat popup draggable
const dragElement = (element, handle) => {
    let pos1 = 0, pos2 = 0, pos3 = 0, pos4 = 0;
    handle.onmousedown = dragMouseDown;

    function dragMouseDown(e) {
        e = e || window.event;
        e.preventDefault();
        // get initial mouse position
        pos3 = e.clientX;
        pos4 = e.clientY;
        document.onmouseup = closeDragElement;
        document.onmousemove = elementDrag;
    }

    function elementDrag(e) {
        e = e || window.event;
        e.preventDefault();
        // calculate new cursor position
        pos1 = pos3 - e.clientX;
        pos2 = pos4 - e.clientY;
        pos3 = e.clientX;
        pos4 = e.clientY;
        // set element's new position
        element.style.top = (element.offsetTop - pos2) + "px";
        element.style.left = (element.offsetLeft - pos1) + "px";
        element.style.bottom = "auto"; // prevent conflict with CSS bottom
        element.style.right = "auto";
    }

    function closeDragElement() {
        document.onmouseup = null;
        document.onmousemove = null;
    }
};

// Initialize dragging using chat header as the handle
dragElement(document.getElementById("chatPopup"), document.querySelector(".chat-header"));
// ===================== CONTACT PAGE BUTTONS =====================

// Copy phone number function (can be used for hotline or office)
function copyPhone(number) {
    navigator.clipboard.writeText(number)
        .then(() => {
            alert(`Phone number ${number} copied to clipboard!`);
        })
        .catch(err => console.error('Failed to copy phone number: ', err));
}

// Add Chat Now button functionality for contact card
const chatNowBtnContact = document.getElementById('chatNowBtn');
if(chatNowBtnContact){
    chatNowBtnContact.addEventListener('click', () => {
        // Open chat popup
        chatPopup.style.display = 'flex';
        welcomePopup.classList.remove('show');

        // Append connecting message
        appendMessage("Connecting you to the next available agent...", 'ai');

        // Typing animation
        const bubble = document.createElement('div');
        bubble.className = 'chat-bubble ai';
        bubble.textContent = 'Connecting';
        chatContainer.appendChild(bubble);
        chatContainer.scrollTop = chatContainer.scrollHeight;

        let dots = 0;
        const interval = setInterval(() => {
            dots = (dots + 1) % 4;
            bubble.textContent = 'Connecting' + '.'.repeat(dots);
        }, 500);

        setTimeout(() => {
            clearInterval(interval);
            bubble.remove();
            appendMessage("Connected to agent.", 'ai');
            appendMessage("Hello, this is Dewey from AI Home Support. How may I help you?", 'ai');
        }, 3000);
    });
}
