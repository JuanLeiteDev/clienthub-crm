import { confirmMessage, showMessage } from "./utils.js";
import { clientGet, clientDelete, clientsList } from "./api.js";
import { clientIsUpdate } from "./client_form.js";

// ================================ ELEMENTS ================================
const elementsList = {
    clientsListHTML: document.querySelector('#clients-list'),
    clientsList: [],
    currentClient: null,
}

const CLIENT_PROPERTY = ['name', 'enterprise', 'email', 'phone', 'status']

// ================================ FUNCTIONS ================================
export function clientCreateHTML() {
    elementsList.clientsListHTML.innerHTML = `
    <div class="client-header-list">
        <p>Nome</p>
        <p>Empresa</p>
        <p>Email</p>
        <p>Telefone</p>
        <p>Estado</p>
    </div>`

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
        const confirmed = await confirmMessage("Deseja mesmo deletar cliente?", true);

        if(confirmed) {
            elementsList.currentClient = linkElement.getAttribute('data-client-id');
            const response = await clientDelete(elementsList.currentClient);
            if(response.sucesse){
                elementsList.clientsList = elementsList.clientsList.filter(client => client.id != elementsList.currentClient);
                showMessage("Cliente deletado com sucesso!");
                clientCreateHTML()
            } else {
                showMessage("Erro ao tentar deletar cliente!", true);
            }
        } else {
            elementsList.currentClient = null;
        }
    })

    btnEdit.addEventListener('click', async () => {
        const confirmed = await confirmMessage("Deseja mesmo editar cliente?", true);

        if(confirmed) {
            elementsList.currentClient = linkElement.getAttribute('data-client-id');
            const data = await clientGet(elementsList.currentClient);
            if(data.sucesse){
                clientIsUpdate(data.clients[0]);
            } else {
                showMessage(data.errors, true);
            } 
        } else {
            elementsList.currentClient = null;
        }
    })

    btnField.append(btnDelete);
    btnField.append(btnEdit);
    divElement.append(btnField);
    linkElement.append(divElement);

    elementsList.clientsListHTML.append(linkElement);
}

function clientRender(clientsList) {
    clientsList.forEach(clientObj => {
        elementsList.clientsList.unshift(clientObj);
    });
}

export function clientAddNew(clientNewObj) {
    elementsList.clientsList.unshift(clientNewObj);
    clientCreateHTML();
}

export function clientUpdateHTML(clientUpdated) {
    elementsList.clientsList = elementsList.clientsList.map(client => {
        if(client.id == clientUpdated.id) return clientUpdated;
        return client;
    });

    clientCreateHTML();
}

export async function clientGetList() {
    const list = await clientsList();

    if(!list.sucesse){
        showMessage("Erro ao tentar buscar clientes na base de dados.", true);
    } else if (Object(list).length <= 0) {
        console.log("ok");
    } else {
        clientRender(list.clients);
        clientCreateHTML();
    }
}
