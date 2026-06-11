import { getInputValues, showErrorsFormClient, cleanErrors, showMessage } from "./utils.js";
import { create_client } from "./api.js";


// ================================ ELEMENTS ================================
const elements = {
    clientForm: document.querySelector('#form-clients'),
    clientBtnInputs: document.querySelectorAll('.input-form-clients')
}

// ================================ FUNCTIONS ================================
async function validateFormClient(event) {
    try {
        event.preventDefault();

        const data = getInputValues([...elements.clientBtnInputs]);
        const response = await create_client(data);
    
        if(response.sucesse){
            cleanErrors();
            elements.clientForm.reset();
            showMessage("Cliente criado com sucesso meus amigos!");
        } else {
            showErrorsFormClient(response.errors);
        }
    } catch (error) {
        console.log(error);
        elements.clientForm.reset();
    }
}

// ================================ EVENTS ================================

elements.clientForm.addEventListener('submit', validateFormClient);
elements.clientBtnInputs.forEach(btnInput => {
    btnInput.addEventListener('input', () => {
        if(btnInput.classList.contains('error')){
            btnInput.classList.remove('error');
            document.querySelector(`[data-error-id="${btnInput.id}"]`).remove();
        }
    })
})
