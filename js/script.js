const welcomBox = document.querySelector(".welcome-box");
const messageBox = document.querySelector(".message-box");
const beginWords = document.querySelectorAll(".begin-words");
const userText = document.getElementById("user-text");

// 開始聊天（清除角色）
function startChat() {
    welcomBox.classList.add("hide");
    messageBox.classList.remove("hide");
}

// 傳送訊息、顯示訊息
async function sendMessage() {

    // 讀取使用者輸入的訊息
    const userInput = userText.value;

    // 如果輸入框是空的，不進行請求
    if (!userInput) {

        // 顯示「請輸入訊息再點擊送出」
        messageBox.appendChild(createChat("請輸入訊息再點擊送出", "system"));
        return;
    }

    // 顯示使用者傳送的訊息
    messageBox.appendChild(createChat(userInput, "user"));

    // 清除文字框裡的字
    userText.value = "";

    // 自動捲動到底下
    messageBox.scrollTo(0, messageBox.scrollHeight);

    // 點擊按鈕後顯示「思考中...」
    setTimeout(() => {
        messageBox.appendChild(createChat("思考中⋯", "system"));
        messageBox.scrollTo(0, messageBox.scrollHeight);
    }, 600);


    try {
        // 替換為 Colab 執行中顯示的 Ngrok URL !!!
        const response = await fetch("https://a580-34-16-163-179.ngrok-free.app/answer", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ question: userInput })
        });

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        //document.getElementsByClassName("system").innerText = data.response;

        // 移除「思考中⋯」
        messageBox.removeChild(messageBox.lastElementChild);

        // 顯示回傳的內容
        messageBox.appendChild(createChat(data.response, "system"));

        // 自動捲動到底下
        messageBox.scrollTo(0, messageBox.scrollHeight);

    } catch (error) {
        console.error("Error:", error);
        //document.getElementsByClassName("system").innerText = "出現錯誤，請稍後再試。";

        messageBox.appendChild(createChat("出現錯誤，請稍後再試", "system"));
    } finally {
        messageBox.scrollTo(0, messageBox.scrollHeight);
    }
}


function createChat(message, className) {
    const chatMessage = document.createElement("div");
    chatMessage.classList.add("chat", className);
    let chatContent = className === "user" ? `<p></p>` : `<p></p>`;
    chatMessage.innerHTML = chatContent;
    chatMessage.querySelector("p").textContent = message;
    return chatMessage;
}



beginWords.forEach(beginWord => {
    beginWord.addEventListener("click", () => {
        // 將被點擊的 span 的文字內容填入 input
        userText.value = beginWord.textContent;
    });
});

const hints = document.querySelectorAll(".hint");
hints.forEach(hint => {
    hint.addEventListener("click", () => {
        // 將被點擊的 span 的文字內容加進 input
        userText.value += hint.textContent;
    });
});