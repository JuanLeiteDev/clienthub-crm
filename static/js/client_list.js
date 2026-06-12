import { confirmMessage } from "./utils.js";

// ================================ ELEMENTS ================================
const elementsList = {
    clientsListHTML: document.querySelector('#clients-list'),
    clientsList: [],
    currentClient: null,
    currentEvent: null
}

const CLIENT_PROPERTY = ['name', 'enterprise', 'email', 'phone', 'status']

// ================================ FUNCTIONS ================================
export function clientCreateHTML() {
    elementsList.clientsList.forEach(clientObj => {
        clientCreateElement(clientObj);
    });
}

function clientCreateElement(clientObj) {
    const linkElement = document.createElement('a');
    linkElement.setAttribute('href', '#');
    linkElement.setAttribute('data-client-id', `${clientObj["id"]}`);
    linkElement.classList.add('link-client');

    const divElement = document.createElement('div');
    divElement.classList.add('client-card');

    for(const key of CLIENT_PROPERTY){
        const elementValue = clientObj[key] ?? "NULL";
        const newElement = document.createElement('p');
        newElement.innerText = elementValue;

        divElement.append(newElement);
    }

    const btnField = document.createElement('div');
    btnField.classList.add('client-btn-list');

    const btnDelete = document.createElement('button');
    btnDelete.classList.add('btn-delete', 'client-btn')
    btnDelete.setAttribute('type', 'button');
    btnDelete.innerText = "Deletar";

    const btnEdit = document.createElement('button');
    btnEdit.classList.add('btn-edit', 'client-btn');
    btnEdit.setAttribute('type', 'button');
    btnEdit.innerText = "Editar";

    

    btnDelete.addEventListener('click', async () => {
        elementsList.currentClient = linkElement.getAttribute('data-client-id');
        const confirmed = await confirmMessage("Deseja mesmo deletar cliente?", true);

        if(confirmed) {
            elementsList.currentEvent = "delete";
        } else {
            elementsList.currentEvent = null;
        }
    })

    btnEdit.addEventListener('click', async () => {
        elementsList.currentClient = linkElement.getAttribute('data-client-id');
        const confirmed = await confirmMessage("Deseja mesmo editar cliente?", true);

        if(confirmed) {
            elementsList.currentEvent = "edit";
        } else {
            elementsList.currentEvent = null;
        }
    })

    btnField.append(btnDelete);
    btnField.append(btnEdit);
    divElement.append(btnField);
    linkElement.append(divElement);

    elementsList.clientsListHTML.append(linkElement);
}

export function clientRender(clientsList) {
    clientsList.forEach(clientObj => {
        elementsList.clientsList.unshift(clientObj);
    });
}

export function clientAddNew(clientNewObj) {
    elementsList.clientsList.unshift(clientNewObj);
    elementsList.clientsListHTML.innerHTML = `
    <div class="client-header-list">
        <p>Nome</p>
        <p>Empresa</p>
        <p>Email</p>
        <p>Telefone</p>
        <p>Estado</p>
    </div>`
    clientCreateHTML();
}
