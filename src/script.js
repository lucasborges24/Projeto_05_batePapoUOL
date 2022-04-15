let UserNameReq



sendUserName()


function userName() {
    const UserName = prompt("Digite seu nome de usuário: ")
    // const UserName = "calcinha preta"

    UserNameReq = {
        name: UserName
    }
}

function sendUserName() {
    userName();
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/participants', UserNameReq)

    requisicao.then(messages);
    requisicao.catch(treatError)
    setInterval(connectionStable, 4000)
}


function connectionStable() {
    const requisicao = axios.post('https://mock-api.driven.com.br/api/v6/uol/status', UserNameReq);
}

function messages() {
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages");

    promise.then(putMessages)
}

function refreshMessage() {
    const refresh = axios.get("https://mock-api.driven.com.br/api/v6/uol/messages")
    refresh.then(putMessages)
}

function putMessages(message) {
    let messages = message.data
    let main = document.querySelector("main");
    main.innerHTML = "";

    for (let i = 89; i < messages.length; i ++) {
        main.innerHTML += divMessage(messages[i])
    }
    setInterval(refreshMessage, 3000)
}

function divMessage(mensagem) {
    if (mensagem.type === "status") {
        return `
        <div class="messages ${mensagem.type}">
            <div class="time">
                <h6>(${mensagem.time})</h6>
            </div>
            <div class="recipient">
                <h6><span>${mensagem.from}</span></h6>
            </div>
            <div class="status">
                <h6>
                    ${mensagem.text}
                </h6>
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
                <h6><span>${mensagem.from}</span> para <span>${mensagem.to}:</span></h6>
            </div>
            <div class="texto">
                <h6>
                    ${mensagem.text}
                </h6>
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
                <h6><span>${mensagem.from}</span> reservadamente para <span>${mensagem.to}:</span></h6>
            </div>
            <div class="texto">
                <h6>
                    ${mensagem.text}
                </h6>
            </div>
        </div>
        `
    }
    
}

function treatError(error) {
    const invalideUser = (error.response.status === 400)
    let valideUser = (error.response.status === 200);
    if (invalideUser) {
        sendUserName();
    }
}

function sendMessage() {
    const objMessage = {
        from: UserNameReq.name,
        to: "Todos",
        text: document.querySelector("input").value,
        type: "message",
    }

    const requisicao = axios.post("https://mock-api.driven.com.br/api/v6/uol/messages", objMessage);
    console.log(requisicao.then)

    requisicao.then(sendSucess)
    requisicao.catch(sendError)
}

function sendSucess() {
    document.querySelector("input").value = ""
}

function sendError() {
    window.location.reload()
}