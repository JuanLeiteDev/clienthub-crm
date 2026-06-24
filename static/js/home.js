import { clientFormEvents } from "./client_form.js";
import { clientGetList, clientListEvents } from "./client_list.js";
import { metricsInit } from "./metrics.js";

// ================================ ELEMENTS ================================
const elements = {
    btnHeader: document.querySelectorAll('.btn-header-menu'),
    asideHTML: document.querySelector('#filters')
};

// ================================ FUNCTIONS ================================
async function initHome() {
    homeEvents();
    clientFormEvents();
    clientListEvents();
    await clientGetList();
    metricsInit();
}

// ================================ EVENTS ================================

window.addEventListener('DOMContentLoaded', initHome )

export function homeEvents() {
    if(elements.btnHeader){
        elements.btnHeader.forEach(button => {
            button.addEventListener('click', () => {
                elements.asideHTML.classList.toggle('invisible-aside');
            });
        });
    }
}
