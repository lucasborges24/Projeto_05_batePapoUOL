let UserNameReq
let contacts = [];
let checkContact = ["", ""];




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
    document.querySelector(".loader").classList.remove("none");
    document.querySelector(".user-login").classList.add("none");
    requisicao.then(messages);
    requisicao.catch(leadUserNameError)
}


function loginPage() {
    document.querySelector(".loader").classList.add("none");
    document.querySelector(".img-login").classList.add("none");
    document.querySelector("header").classList.remove("none")
    document.querySelector("footer").classList.remove("none")
    document.querySelector("main").classList.remove("none")
}

// Functions executed periodically 
function intervals() {
    setInterval(connectionStable, 4000) // keep connection with the server
    setInterval(refreshMessage, 3000) // refresh messages after 3s
    setInterval(refreshContacts, 10000)
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
        if (messages[i].type !== "private_message" || messages[i].from === UserNameReq.name || messages[i].to === UserNameReq.name) {
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
    let objMessage;
    if (checkContact[1] === "Reservadamente") {
        objMessage = {
            from: UserNameReq.name,
            to: checkContact[0],
            text: document.querySelector(".footer-input input").value,
            type: "private_message",
        }
    } else {
        objMessage = {
            from: UserNameReq.name,
            to: checkContact[0],
            text: document.querySelector(".footer-input input").value,
            type: "message",
        }
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

function sidebar() {
    const shadow = document.querySelector(".shadow").classList.remove("none")
    const sidebar = document.querySelector(".sidebar").classList.remove("none")
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants")
    promise.then(sidebarContact)
}

function sidebarContact(contact) {
    contacts = [];
    for (let i = 0; i < contact.data.length; i++) {
        contacts.push(contact.data[i].name);
    }
    writeContact()
}

function writeContact() {
    const contatos = document.querySelector(".contacts");
    contatos.innerHTML = `<div class="contact" onclick="check(this)">
        <div class="contact-information">
            <img src="/image/all.svg" alt="All">
            <p>Todos</p>
        </div>
        <div class="check-contact none">
            <img src="/image/check.svg" alt="check">
        </div>
    </div>`;
    for (let i = 0; i < contacts.length; i++) {
        contatos.innerHTML += `
        <div class="contact" onclick="check(this)">
            <div class="contact-information" >
                <img src="/image/contact.svg" alt="${contacts[i]}">
                <p>${contacts[i]}</p>
            </div>
            <div class="check-contact none">
                <img src="/image/check.svg" alt="check">
            </div>
        </div>
        `
    }
}

function check(element) {
    const contatozinho = document.querySelectorAll(".contact")
    const checkzinho = document.querySelectorAll(".check-contact")

    for (let i = 0; i < contacts.length; i++) {
        contatozinho[i].classList.remove("selected");
        checkzinho[i].classList.add("none");
    }

    element.classList.add("selected");
    element.childNodes[3].classList.remove("none");
    checkContact[0] = element.childNodes[1].childNodes[3].innerHTML

    inputText();
    
}

function visibility(element) {
    const visibilidadezinha = document.querySelectorAll(".visibility-type")
    const checkzinho = document.querySelectorAll(".check-visibility")

    for (let i = 0; i < 2; i++) {
        visibilidadezinha[i].classList.remove("selected");
        checkzinho[i].classList.add("none");
    }

    element.classList.add("selected");
    element.childNodes[3].classList.remove("none");
    checkContact[1] = element.childNodes[1].childNodes[3].innerHTML
    inputText();
}

function inputText() {
    const inputtext = document.querySelector("footer p")
    inputtext.innerHTML = `Enviando para ${checkContact[0]} (${checkContact[1]})`
}

function refreshContacts() {
    console.log("deu certo")
    const promise = axios.get("https://mock-api.driven.com.br/api/v6/uol/participants");
    promise.then(sidebarContact)
}


function backMessages() {
    const shadow = document.querySelector(".shadow").classList.add("none")
    const sidebar = document.querySelector(".sidebar").classList.add("none")
}