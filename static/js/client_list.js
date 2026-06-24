import { confirmMessage, showMessage } from "./utils.js";
import { clientGet, clientDelete, clientsList } from "./api.js";
import { clientIsUpdate } from "./client_form.js";
import { metricsInit } from "./metrics.js";

// ================================ ELEMENTS ================================
const elementsList = {
    clientsListHTML: document.querySelector('#clients-list'),
    clientsSearch: document.querySelector('#search-client'),
    clientsSelectStatus: document.querySelector('#select-status'),
    clientListFilter: [],
    clientsList: [],
    currentClient: null
}

const CLIENT_PROPERTY = ['name', 'enterprise', 'email', 'phone', 'status']

// ================================ FUNCTIONS ================================
export function clientCreateHTML() {
    metricsInit();
    applyFilter();
    elementsList.clientsListHTML.innerHTML = `
    <div class="client-header-list">
        <p>Nome</p>
        <p>Empresa</p>
        <p>Email</p>
        <p>Telefone</p>
        <p>Estado</p>
    </div>`

    elementsList.clientListFilter.forEach(clientObj => {
        clientCreateElement(clientObj);
    });
}

function clientCreateElement(clientObj) {
    const clientLine = document.createElement('div');
    clientLine.classList.add('client-line');

    const linkElement = document.createElement('a');
    linkElement.setAttribute('data-client-id', `${clientObj["id"]}`);
    linkElement.setAttribute('href', `/clients/${clientObj["id"]}`);
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
    linkElement.append(divElement);
    clientLine.append(linkElement);
    clientLine.append(btnField);

    elementsList.clientsListHTML.append(clientLine);
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

function applyFilter() {
    elementsList.clientListFilter = searchFilter();
    elementsList.clientListFilter = statusFilter();
}

function statusFilter() {
    const value = (elementsList.clientsSelectStatus.value).toLowerCase();
    if(value !== ""){
        const newList = elementsList.clientListFilter.filter(client => 
            client.status == value
        );
        return newList;
    } else {
        return elementsList.clientListFilter;
    }
}

function searchFilter() {
    const value = (elementsList.clientsSearch.value).toLowerCase();
    if(value !== ""){
        const newList = elementsList.clientsList.filter(client => 
            client.name.toLowerCase().includes(value)
        );
        return newList;
    } else {
        return elementsList.clientsList;
    }
}

export function clientsMetrics() {
    const data = {}
    
    data["total"] = elementsList.clientsList.length;
    data["ativos"] = elementsList.clientsList.filter(client => client.status == 'lead').length;
    data["fechados"] = elementsList.clientsList.filter(client => client.status == 'cliente').length;
    data["perdidos"] = elementsList.clientsList.filter(client => client.status == 'perdido').length;
    data["conversao"] = data.total > 0 ? (data["fechados"] / data["total"]) * 100 : 0;
    data["pendentes"] = 0;
    data["atrasadas"] = 0;
    data["interacoes"] = 0;

    return data
}

// ================================ EVENTS ================================
export function clientListEvents() {
    if(elementsList.clientsSearch){
        elementsList.clientsSearch.addEventListener('input', clientCreateHTML);
    }
    if(elementsList.clientsSelectStatus){
        elementsList.clientsSelectStatus.addEventListener('input', clientCreateHTML);
    }
}