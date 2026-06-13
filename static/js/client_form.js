import { getInputValues, showMessage } from "./utils.js";
import { clientCreate, clientUpdate } from "./api.js";
import { clientAddNew, clientUpdateHTML } from "./client_list.js";

// ================================ ELEMENTS ================================
const elementsForm = {
    clientForm: document.querySelector('#form-clients'),
    clientH2: document.querySelector('#sec-form-clients > h2'),
    clientBtnInputs: document.querySelectorAll('.input-form-clients'),
    clientForm: document.querySelector('#form-clients'),
    clientBtnInputs: document.querySelectorAll('.input-form-clients'),
    clientUpdate: false,
    clientCurrentID: null
};

// ================================ FUNCTIONS ================================
function clientCleanErrors() {
    const errors = document.querySelectorAll('.error-element');
    errors.forEach(error => error.remove());
}

function clientShowErrorsForm(errorsObj) {
    try {
        let errorsList = Object.entries(errorsObj);

        errorsList.forEach(([inputID, error]) => {
            if(document.querySelector(`[data-error-id="${inputID}"]`)) return;

            const errorElement = clientCreateElementError();
            errorElement.setAttribute('data-error-id', `${inputID}`);

            const input = document.querySelector(`#${inputID}`);
            const container = input.closest(".block-input");

            input.classList.add('error');

            errorElement.innerText = error;
            container.append(errorElement);
        })
    } catch (error) {
        console.log(error);
    }
}

function clientCreateElementError() {
    let errorElement = document.createElement('p');

    errorElement.classList.add("error-element");
    errorElement.style.marginTop = "5px";
    errorElement.style.textAlign = "left";
    errorElement.style.color = "var(--color-danger-bg)";
    errorElement.style.fontSize = "0.9rem";

    return errorElement;
}

async function clientValidateForm(event) {
    try {
        event.preventDefault();
        const data = getInputValues([...elementsForm.clientBtnInputs]);

        if(elementsForm.clientUpdate) clientSendFormUpdate(data);
        else clientSendFormCreate(data);

    } catch (error) {
        showMessage(`${error}`, true);
        elementsForm.clientUpdate = true;
        clientIsUpdate()
        elementsForm.clientForm.reset();
    }
}

async function clientSendFormCreate(data) {
    try {
        const response = await clientCreate(data);

        if(response.sucesse){
            clientCleanErrors();
            elementsForm.clientForm.reset();
            showMessage("Cliente criado com sucesso!");
            clientAddNew(response.clients[0]);
        } else {
            clientShowErrorsForm(response.errors);
        }
    } catch (error) {
        showMessage(`${error}`, true);
        elementsForm.clientForm.reset();
    }
}

async function clientSendFormUpdate(data) {
    try {
        const response = await clientUpdate(data, elementsForm.clientCurrentID);

        if(response.sucesse){
            clientCleanErrors();
            clientIsUpdate();
            showMessage("Cliente atualizado com sucesso!");
            clientUpdateHTML(response.clients[0]);
        } else {
            clientShowErrorsForm(response.errors);
        }
    } catch (error) {
        clientIsUpdate();
        showMessage(`${error}`, true);
        elementsForm.clientForm.reset();
    }
}

function clientWriteForm(data) {
    const listInputs = [...elementsForm.clientBtnInputs];
    listInputs.forEach(input => input.value = data[input.id] ?? "");
}

export function clientIsUpdate(client=null) {
    if(!elementsForm.clientUpdate){
        elementsForm.clientH2.innerText = "Atualizar cliente";
        if(client){
            clientWriteForm(client);
            elementsForm.clientCurrentID = client.id;
        }
        elementsForm.clientUpdate = true;
    } else {
        elementsForm.clientForm.reset();
        elementsForm.clientH2.innerText = "Cadastrar novo cliente";
        elementsForm.clientUpdate = false;
        elementsForm.clientCurrentID = null;
    }
}

// ================================ EVENTS ================================
export function clientFormEvents() {
    elementsForm.clientForm.addEventListener('submit', clientValidateForm);

    elementsForm.clientBtnInputs.forEach(btnInput => {
        btnInput.addEventListener('input', () => {
            if(btnInput.classList.contains('error')){
                btnInput.classList.remove('error');
                document.querySelector(`[data-error-id="${btnInput.id}"]`).remove();
            }
        });
    });
}
