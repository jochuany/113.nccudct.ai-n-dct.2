// 抓取聊天室空間，傳送訊息時新增 child 於此層底下
const messageBox = document.querySelector(".message-box");

// 抓取使用者輸入的訊息
const userText = document.getElementById("user-text");

// 開始聊天預設否（角色應要在被點選消失後才開始聊天）
var chatting = false;

// 開始聊天（清除角色）
function startChat() {
    const welcomBox = document.querySelector(".welcome-box");
    welcomBox.classList.add("hide");
    messageBox.classList.remove("hide");

    // 判斷可開始聊天
    chatting = true;
}

// 傳送訊息、顯示訊息
async function sendMessage() {

    // 在開始聊天後才執行所有動作
    if (chatting) {

        // 鍵盤收起後，可自動捲到頁面最上方
        window.scrollTo(0, 0);

        // 讀取使用者輸入的訊息
        const userInput = userText.value;

        // 如果輸入框是空的，不進行請求
        if (!userInput) {
            // 顯示「請輸入訊息再點擊送出」
            messageBox.appendChild(createChat("請輸入訊息再點擊送出", "system"));
            return;
        }

        // 聊天室內出現使用者傳送的訊息
        messageBox.appendChild(createChat(userInput, "user"));

        // 清除文字框裡的字
        userText.value = "";

        // 自動捲動到聊天室最底，顯示最新的訊息
        messageBox.scrollTo(0, messageBox.scrollHeight);

        // 點擊按鈕後顯示「思考中...」
        setTimeout(() => {
            messageBox.appendChild(createChat("思考中⋯", "system"));
            messageBox.scrollTo(0, messageBox.scrollHeight);
        }, 600);


        try {
            // 替換為 Colab 執行中顯示的 Ngrok URL !!!
            const response = await fetch("https://1a8b-34-125-137-8.ngrok-free.app/answer", {
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

            // 移除「思考中⋯」
            messageBox.removeChild(messageBox.lastElementChild);

            // 聊天室內出現系統回傳的內容
            messageBox.appendChild(createChat(data.response, "system"));

            // 自動捲動到聊天室最底，顯示最新的訊息
            messageBox.scrollTo(0, messageBox.scrollHeight);

        } catch (error) {

            // 若出現錯誤，系統回覆
            console.error("Error:", error);
            messageBox.appendChild(createChat("出現錯誤，請稍後再試", "system"));

        } finally {

            // 自動捲動到聊天室最底，顯示最新的訊息
            messageBox.scrollTo(0, messageBox.scrollHeight);
        }
    }
}

// 新增訊息 function
function createChat(message, className) {

    // 新增 div
    const chatMessage = document.createElement("div");

    // 為 div 增加 class 名稱 "chat"，以符合 css 樣式
    chatMessage.classList.add("chat", className);

    // 為訊息新增 <p> 的 html 標籤
    let chatContent = `<p></p>`;

    // 將 <p> 標籤的內容指定為聊天訊息 message
    chatMessage.innerHTML = chatContent;
    chatMessage.querySelector("p").textContent = message;
    return chatMessage;
}


// 語氣關鍵字加進訊息輸入框，使用「=」直接取代
const beginWords = document.querySelectorAll(".begin-words");

beginWords.forEach(beginWord => {
    beginWord.addEventListener("click", () => {

        if (chatting) {
            // 將被點擊的 span 的文字內容加進 input
            userText.value = beginWord.textContent;
        }

    });
});


// 範例問題加進訊息輸入框，使用「+=」不取代原有的字
const hints = document.querySelectorAll(".hint");

hints.forEach(hint => {
    hint.addEventListener("click", () => {

        if (chatting) {
            // 將被點擊的 span 的文字內容加進 input
            userText.value += hint.textContent;
        }

    });
});