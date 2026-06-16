import { clientFormEvents } from "./client_form.js";
import { clientGetList, clientListEvents } from "./client_list.js";
import { metricsInit } from "./metrics.js";

// ================================ ELEMENTS ================================
const elements = {
    btnHeader: document.querySelectorAll('.btn-header-menu'),
    asideHTML: document.querySelector('#filters')
};

// ================================ FUNCTIONS ================================
async function init() {
    clientFormEvents();
    clientListEvents();
    await clientGetList();
    metricsInit();
}

// ================================ EVENTS ================================

window.addEventListener('DOMContentLoaded', init);
elements.btnHeader.forEach(button => {
    button.addEventListener('click', () => {
        elements.asideHTML.classList.toggle('invisible-aside');
    });
});
