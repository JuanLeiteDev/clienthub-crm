import { clientFormEvents } from "./client_form.js";
import { clientGetList, clientListEvents } from "./client_list.js";

// ================================ ELEMENTS ================================
const elements = {
    
};

// ================================ FUNCTIONS ================================
function init() {
    clientFormEvents();
    clientListEvents();
    clientGetList();
}

// ================================ EVENTS ================================

window.addEventListener('DOMContentLoaded', init);
