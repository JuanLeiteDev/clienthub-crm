import { confirmMessage, showMessage, getInputValues } from "./utils.js";
import { clientIsUpdate, clientCleanErrors, clientShowErrorsForm} from "./client_form.js";
import { clientDelete, clientUpdate } from "./api.js";
import { navigationEvents } from "./navigation.js";

const elementsPage = {
    btnInputs: document.querySelectorAll('.input-form-clients'),
    btnEdit: document.querySelector('#btn-edit-client-page'),
    btnDelete: document.querySelector('#btn-delete-client-page'),
    formPage: document.querySelector('#client-page-form'),
    mainSelector: document.querySelector('#client-page'),
}

function getClientData() {
    const data = {
        id: elementsPage.mainSelector.getAttribute('data-client-id'),
        name: elementsPage.mainSelector.getAttribute('data-client-name'),
        enterprise: elementsPage.mainSelector.getAttribute('data-client-enterprise'),
        email: elementsPage.mainSelector.getAttribute('data-client-email'),
        phone: elementsPage.mainSelector.getAttribute('data-client-phone'),
        status: elementsPage.mainSelector.getAttribute('data-client-status')
    }

    return data;
}

function showForm() {
    const data = getClientData();
    clientIsUpdate(data);
    elementsPage.formPage.classList.remove('client-page-form-hidden');
}

async function updateClientPage(event) {
    event.preventDefault();
    const data = getInputValues([...elementsPage.btnInputs]);

    try {
        const response = await clientUpdate(data, elementsPage.mainSelector.getAttribute('data-client-id'));

        if(response.sucesse){
            clientCleanErrors();
            clientIsUpdate();
            elementsPage.formPage.classList.add('client-page-form-hidden');
            showMessage("Cliente atualizado com sucesso!");
            window.location.href = `/clients/${elementsPage.mainSelector.getAttribute('data-client-id')}`
        } else {
            clientShowErrorsForm(response.errors);
        }

    } catch (error) {
        clientIsUpdate();
        showMessage(`${error}`, true);
        elementsPage.formPage.reset();
        elementsPage.formPage.classList.add('client-page-form-hidden');
    }
}

function clientPageEvents() {
    elementsPage.btnEdit.addEventListener('click', showForm);
    
    elementsPage.btnDelete.addEventListener('click', async () => {
        const confirmed = await confirmMessage("Deseja mesmo deletar cliente?", true);
    
        if(confirmed) {
            const response = await clientDelete(elementsPage.mainSelector.getAttribute('data-client-id'));
            if(response.sucesse){
                window.location.href = "/";
            } else {
                showMessage("Erro ao tentar deletar cliente!", true);
            }
        }
    });

    if(elementsPage.formPage){
        elementsPage.formPage.addEventListener('submit', updateClientPage);
    }

    if(elementsPage.btnInputs){
        elementsPage.btnInputs.forEach(btnInput => {
            btnInput.addEventListener('input', () => {
                if(btnInput.classList.contains('error')){
                    btnInput.classList.remove('error');
                    document.querySelector(`[data-error-id="${btnInput.id}"]`).remove();
                }
            });
        });
    }

    navigationEvents();
}

window.addEventListener('DOMContentLoaded', clientPageEvents);
