const elementsMessage = {
    msgBlock: document.querySelector('#sec-message'),
    msgField: document.querySelector('.message-field'),
    msgBtnField: document.querySelector('.btn-field'),
    msgBtnAccept: document.querySelector('#accept-btn-message'),
    msgBtnCancel: document.querySelector('#cancel-btn-message')
}

let myTimer = null;

export function getInputValues(listOfInputs) {
    const inputValues = {};

    listOfInputs.forEach(input => {
        if(input.id) {
            inputValues[input.id] = input.value;
        }
    });

    return inputValues;
}

function createElementError() {
    let errorElement = document.createElement('p');

    errorElement.classList.add("error-element");
    errorElement.style.marginTop = "5px";
    errorElement.style.textAlign = "left";
    errorElement.style.color = "rgb(255, 211, 211)";
    errorElement.style.fontSize = "0.9rem";

    return errorElement;
}

function resetTimer() {
    clearTimeout(myTimer);
}

export function showMessage(msg, error=false, btnField=false) {
    elementsMessage.msgBlock.classList.add('invisible');
    resetTimer()

    if(error){
        elementsMessage.msgBlock.style.border = "1px solid red";
        elementsMessage.msgBtnFiel.style.color = "red";
    } else {
        elementsMessage.msgBlock.style.border = "1px solid green";
        elementsMessage.msgField.style.color = "green";
    }

    if(btnField){
        elementsMessage.msgBtnField.style.display = "block";
    } else {
        elementsMessage.msgBtnField.style.display = "none";
    }

    elementsMessage.msgField.innerText = msg;
    elementsMessage.msgBlock.classList.remove('invisible');
    myTimer = 3000;

    setTimeout(() => {
        elementsMessage.msgBlock.classList.add('invisible');
    }, myTimer)
}

export function showErrorsFormClient(errorsObj) {
    try {
        let errorsList = Object.entries(errorsObj);

        errorsList.forEach(([inputID, error]) => {
            if(document.querySelector(`[data-error-id="${inputID}"]`)) return;

            const errorElement = createElementError();
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

export function cleanErrors() {
    const errors = document.querySelectorAll('.error-element');
    errors.forEach(error => error.remove());
}