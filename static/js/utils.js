const elementsUtils = {
    msgBlock: document.querySelector('#sec-message'),
    msgField: document.querySelector('.message-field'),
    msgBtnField: document.querySelector('.btn-field'),
    msgBtnAccept: document.querySelector('#accept-btn-message'),
    msgBtnCancel: document.querySelector('#cancel-btn-message'),
}

let myTimer = null;
let confirmResolver = null;

function resetTimer() {
    clearTimeout(myTimer); 
    myTimer = null;
}

export function getInputValues(listOfInputs) {
    const inputValues = {};

    listOfInputs.forEach(input => {
        if(input.id) {
            inputValues[input.id] = input.value;
        }
    });

    return inputValues;
}

export function showMessage(msg, error=false, btnField=false) {
    resetTimer();
    elementsUtils.msgBlock.classList.add('invisible');
    elementsUtils.msgField.innerText = msg;

    if(error){
        elementsUtils.msgBlock.style.border = "1px solid var(--color-danger-text)";
        elementsUtils.msgBtnField.style.color = "var(--color-danger-text)";
    } else {
        elementsUtils.msgBlock.style.border = "1px solid var(--color-success-text)";
        elementsUtils.msgField.style.color = "var(--color-success-text)";
    }

    if(btnField){
        elementsUtils.msgBtnField.style.display = "block";
        elementsUtils.msgBlock.classList.remove('invisible');
    } else {
        elementsUtils.msgBtnField.style.display = "none";
        elementsUtils.msgBlock.classList.remove('invisible');

        myTimer = setTimeout(() => {
            elementsUtils.msgBlock.classList.add('invisible');
            myTimer = null;
        }, 3000)
    }
}

export function confirmMessage(msg, error=false) {
    return new Promise(resolve => {
        showMessage(msg, error, true);
        confirmResolver = resolve;
    });
}

elementsUtils.msgBtnAccept.addEventListener('click', () => {
    elementsUtils.msgBlock.classList.add('invisible');

    if(confirmResolver) {
        confirmResolver(true);
        confirmResolver = null;
    }
});

elementsUtils.msgBtnCancel.addEventListener('click', () => {
    elementsUtils.msgBlock.classList.add('invisible');

    if(confirmResolver) {
        confirmResolver(false);
        confirmResolver = null;
    }
});
