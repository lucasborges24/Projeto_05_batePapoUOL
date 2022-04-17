let UserNameReq




enterKeyboardMessage();


// function to ask the user its name
function userName() {
    const UserName = document.querySelector(".user-login-input input").value
    UserNameReq = {
        name: UserName
    }
}

// Send the UserName to the server
function sendUserName() {
    clearInterval(intervals)
    userName();
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', UserNameReq)
    intervals();
    loader();
    requisicao.then(messages);
    requisicao.catch(leadUserNameError)
}

function loader() {
    const loaderzinho = document.querySelector(".loader")
    const loginzinho = document.querySelector(".user-login")
    loaderzinho.classList.remove("none")
    loginzinho.classList.add("none")
}
function loginPage() {
    document.querySelector("header").classList.remove("none")
    document.querySelector("footer").classList.remove("none")
    document.querySelector("main").classList.remove("none")
}

// Functions executed periodically 
function intervals() {
    setInterval(connectionStable, 4000) // keep connection with the server
    setInterval(refreshMessage, 3000) // refresh messages after 3s
}

// function to keep connection with the server
function connectionStable() {
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', UserNameReq);
    requisicao.catch(Unlog)
}

// function to lead with connectionStable errors
function Unlog() {
    window.location.reload() // if the UserName isn't send to server, the page are reloaded
}

function refreshMessage() {
    const refresh = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    refresh.then(putMessages)
}

function messages() {
    loginPage()
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");
    promise.then(putMessages);
}

function putMessages(message) {
    let messages = message.data
    let main = document.querySelector("main");
    main.innerHTML = "";

    for (let i = 0; i < messages.length; i ++) {
        if (messages[i].type !== "private_message" || messages[i] === UserNameReq.name) {
            main.innerHTML += divMessage(messages[i])
        }
    }
    scrolll();
}

function divMessage(mensagem) {
    if (mensagem.type === "status") {
        return `
        <div class="messages ${mensagem.type}">
            <div class="time">
                <h6>(${mensagem.time})</h6>
            </div>
            <div class="recipient">
                <h6><span>${mensagem.from}</span> ${mensagem.text}</h6>
            </div>

        </div>
        `
    } else if (mensagem.type === "message") {
        return `
        <div class="messages ${mensagem.type}">
            <div class="time">
                <h6>(${mensagem.time})</h6>
            </div>
            <div class="recipient">
                <h6><span>${mensagem.from}</span> para <span>${mensagem.to}:</span> ${mensagem.text}</h6>
            </div>

        </div>
        `
    } else {
        return `
        <div class="messages ${mensagem.type}">
            <div class="time">
                <h6>(${mensagem.time})</h6>
            </div>
            <div class="recipient">
                <h6><span>${mensagem.from}</span> reservadamente para <span>${mensagem.to}:</span> ${mensagem.text}</h6>
            </div>
        </div>
        `
    }
    
}

function scrolll() {
    const lastMessage = document.querySelector("main .messages:last-child")
    lastMessage.scrollIntoView({behavior: "smooth"});
}

function leadUserNameError(error) {
    const invalideUser = (error.response.status === 400)
    let valideUser = (error.response.status === 200);
    if (invalideUser) {
        alert("Esse usuário já existe! Por favor, coloque outro!")
        window.location.reload();
    }
}

function sendMessage() {
    const objMessage = {
        from: UserNameReq.name,
        to: "Todos",
        text: document.querySelector(".footer-input input").value,
        type: "message",
    }

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objMessage);
    console.log(requisicao.then)

    requisicao.then(sendSucess)
    requisicao.catch(sendError)
}

function enterKeyboardMessage() {
    const input = document.querySelector(".footer-input") 
    input.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            sendMessage();
        }
    })

    const login = document.querySelector(".user-login-input input")
    login.addEventListener('keydown', function(event) {
        if (event.key === "Enter") {
            sendUserName();
        }
    })
}

function sendSucess() {
    document.querySelector(".footer-input input").value = ""
}

function sendError() {
    window.location.reload()
}