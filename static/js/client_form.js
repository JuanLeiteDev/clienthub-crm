// ================================ ELEMENTS ================================
const elementsForm = {
    clientForm: document.querySelector('#form-clients'),
    clientBtnInputs: document.querySelectorAll('.input-form-clients'),
};

// ================================ FUNCTIONS ================================
export function clientCleanErrors() {
    const errors = document.querySelectorAll('.error-element');
    errors.forEach(error => error.remove());
}

export function clientShowErrorsForm(errorsObj) {
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

// ================================ EVENTS ================================
export function clientFormEvents() {
    elementsForm.clientBtnInputs.forEach(btnInput => {
        btnInput.addEventListener('input', () => {
            if(btnInput.classList.contains('error')){
                btnInput.classList.remove('error');
                document.querySelector(`[data-error-id="${btnInput.id}"]`).remove();
            }
        })
    })
}