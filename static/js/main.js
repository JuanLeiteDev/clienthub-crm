import { getInputValues, showMessage } from "./utils.js";
import { clientCleanErrors, clientShowErrorsForm, clientFormEvents } from "./client_form.js";
import { clientRender, clientCreateHTML, clientAddNew } from "./client_list.js";
import { clientCreate, clientsGet } from "./api.js";


// ================================ ELEMENTS ================================
const elements = {
    clientForm: document.querySelector('#form-clients'),
    clientBtnInputs: document.querySelectorAll('.input-form-clients'),
    msgBlock: document.querySelector('#sec-message'),
    msgBtnAccept: document.querySelector('#accept-btn-message'),
    msgBtnCancel: document.querySelector('#cancel-btn-message'),
    msgValue: false
};

// ================================ FUNCTIONS ================================
async function clientValidateForm(event) {
    try {
        event.preventDefault();

        const data = getInputValues([...elements.clientBtnInputs]);
        const response = await clientCreate(data);
    
        if(response.sucesse){
            clientCleanErrors();
            elements.clientForm.reset();
            showMessage("Cliente criado com sucesso!");
            clientAddNew(response.clients[0]);
        } else {
            clientShowErrorsForm(response.errors);
        }
    } catch (error) {
        showMessage(`${error}`, true);
        elements.clientForm.reset();
    }
}

async function clientGetList() {
    const clientsList = await clientsGet();

    if(!clientsList.sucesse){
        showMessage("Erro ao tentar buscar clientes na base de dados.", true);
    } else if (Object(clientsList).length <= 0) {
        console.log("ok");
    } else {
        clientRender(clientsList.clients);
        clientCreateHTML();
    }
}

function init() {
    clientFormEvents()
    clientGetList();
}

// ================================ EVENTS ================================

window.addEventListener('DOMContentLoaded', init);
elements.clientForm.addEventListener('submit', clientValidateForm);

elements.msgBtnAccept.addEventListener('click', () => {
    elements.msgBlock.classList.add('invisible');
    elements.msgValue = true;
});

elements.msgBtnCancel.addEventListener('click', () => {
    elements.msgBlock.classList.add('invisible');
    elements.msgValue = false;
});
