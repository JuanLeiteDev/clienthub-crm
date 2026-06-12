import { clientFormEvents } from "./client_form.js";
import { clientGetList } from "./client_list.js";

// ================================ ELEMENTS ================================
const elements = {
    
};

// ================================ FUNCTIONS ================================
function init() {
    clientFormEvents()
    clientGetList();
}

// ================================ EVENTS ================================

window.addEventListener('DOMContentLoaded', init);
