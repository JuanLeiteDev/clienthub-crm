import { clientFormEvents } from "./client_form.js";
import { clientGetList, clientListEvents } from "./client_list.js";
import { metricsInit } from "./metrics.js";

// ================================ ELEMENTS ================================
const elements = {
    
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
