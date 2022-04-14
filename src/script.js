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

function putMessages(message) {
    console.log(message.data[5].from)
}

function treatError(error) {
    const invalideUser = (error.response.status === 400)
    let valideUser = (error.response.status === 200);
    if (invalideUser) {
        sendUserName();
    }
}