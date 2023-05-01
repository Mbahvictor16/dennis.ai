const messageDiv = document.querySelector(".message");
const formBox = document.querySelector("form");
const textBox = document.querySelector("textarea");
const botIcon = `<i class="fas fa-robot"></i>`;
const userIcon = '<i class="fa fa-user" aria-hidden="true"></i>';
let loadInterval;

function loader(element) {
  loadInterval = setInterval(() => {
    element.innerHTML += "|";
    if (element.innerHTML === "||") {
      element.innerHTML = "";
    }
  }, 1000);
}

function typeText(element, text) {
  let index = 0;

  let interval = setInterval(() => {
    if (index < text.length) {
      element.innerHTML += text.charAt(index);
      index++;
    } else {
      clearInterval(interval);
    }
  }, 30);
}

function generateId() {
  return Date.now();
}

function chatContainer(isAi, value, uniqueId) {
  return `
    <div class=" wrapper ${isAi ? "bot" : "human"}">
      <div class="img">
        ${isAi ? botIcon : userIcon}
      </div>
      <div class="text" id="${uniqueId}">${value}</div>
    </div>
  `;
}

async function sendText(e) {
  e.preventDefault();

  // user stripe
  if (!textBox.value || textBox.value === "" || textBox.value === null) {
    e.preventDefault();
    return;
  }
  messageDiv.innerHTML += chatContainer(false, textBox.value);

  // bot stripe
  formBox.classList.add("hide");
  let uniqueId = generateId();
  messageDiv.innerHTML += chatContainer(true, "", uniqueId);
  textBox.readOnly = true;
  messageDiv.scrollTop = messageDiv.scrollHeight;
  const responseMessage = document.getElementById(uniqueId);
  loader(responseMessage);

  // bot response
  const response = await fetch("https://dennisai.onrender.com", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      prompt: textBox.value,
    }),
  });

  formBox.reset();

  clearInterval(loadInterval);

  if (response.ok) {
    const data = await response.json();
    const parsedData = data.bot_response.trim();

    typeText(responseMessage, parsedData);
    formBox.classList.remove("hide");
  } else {
    formBox.innerHTML = "";
    formBox.innerText = "An error occured";
  }

  textBox.readOnly = false;
}

formBox.addEventListener("submit", sendText);

formBox.addEventListener("keydown", (e) => {
  if (e.key === "Alt" && e.keyCode === 13) {
    sendText(e);
  }
});
