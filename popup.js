const chatBox = document.getElementById("chat-box");
const userInput = document.getElementById("user-input");
const sendBtn = document.getElementById("send-btn");

// === Manual model toggle dropdown ===
let activeModel = "deepseek"; // Default
const modelSelect = document.createElement("select");
modelSelect.innerHTML = `
  <option value="deepseek">DeepSeek (OpenRouter)</option>
  <option value="groq">Groq</option>
`;
modelSelect.value = activeModel;
modelSelect.style.marginBottom = "10px";
chatBox.parentNode.insertBefore(modelSelect, chatBox);

modelSelect.addEventListener("change", () => {
  activeModel = modelSelect.value;
  console.log("Model switched to:", activeModel);
});

// === DeepSeek (via OpenRouter) ===
async function getDeepSeekReply(message) {
  try {
    const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${OPENROUTER_API_KEY}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "deepseek-chat", // ✅ remove ":free"
        messages: [
          {
            role: "system",
            content: `You are CSB Sir, a strict, roast-heavy, hilarious chemistry teacher from NIT Warangal who teaches 12th-grade JEE students. Frequently use phrases like "Who are we ra, boys right?", "Sit on the chair", and mix aggressive motivation with chemistry concepts. Do not insult parents.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
  console.error("DeepSeek API error:", data.error.message);
  throw new Error(data.error.message);
}

    if (!data || !data.choices || !data.choices[0]) {
      throw new Error("Invalid DeepSeek response structure");
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("DeepSeek failed:", err);
    throw err;
  }
}

// === Groq ===
async function getGroqReply(message) {
  try {
    const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${GROQ_API_KEY}`
      },
      body: JSON.stringify({
        model: "llama3-70b-8192", // ✅ updated Groq model
        messages: [
          {
            role: "system",
            content: `You are CSB Sir, a strict, roast-heavy, hilarious chemistry teacher from NIT Warangal who teaches 12th-grade JEE students. Frequently use phrases like "Who are we ra, boys right?", "Sit on the chair", and mix aggressive motivation with chemistry concepts. Do not insult parents.`
          },
          { role: "user", content: message }
        ]
      })
    });

    const data = await response.json();
    if (data.error) {
  console.error("Groq API error:", data.error.message);
  throw new Error(data.error.message);
}

    if (!data || !data.choices || !data.choices[0]) {
      throw new Error("Invalid Groq response structure");
    }

    return data.choices[0].message.content;
  } catch (err) {
    console.error("Groq failed:", err);
    throw err;
  }
}
// === Main wrapper with auto fallback ===
async function getCsbReply(message) {
  if (activeModel === "groq") {
    return await getGroqReply(message);
  } else {
    try {
      return await getDeepSeekReply(message);
    } catch (e) {
      console.log("Falling back to Groq...");
      return await getGroqReply(message);
    }
  }
}

// === UI Events ===
sendBtn.addEventListener("click", async () => {
  const userMessage = userInput.value.trim();
  if (!userMessage) return;

  appendMessage("user", userMessage);
  userInput.value = "";

  appendMessage("bot", "Thinking ra, wait...");

  try {
    const reply = await getCsbReply(userMessage);
    updateLastBotMessage(reply);
  } catch (e) {
    updateLastBotMessage("Something went wrong ra, even Groq gave up...");
  }
});

// === Message helpers ===
function appendMessage(sender, text) {
  const messageDiv = document.createElement("div");
  messageDiv.className = `message ${sender}`;
  messageDiv.textContent = text;
  chatBox.appendChild(messageDiv);
  chatBox.scrollTop = chatBox.scrollHeight;
}

function updateLastBotMessage(text) {
  const bots = document.querySelectorAll(".bot");
  if (bots.length > 0) {
    bots[bots.length - 1].textContent = text;
  }
}
