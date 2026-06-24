import { clientFormEvents } from "./client_form.js";
import { clientGetList, clientListEvents } from "./client_list.js";
import { metricsInit } from "./metrics.js";
import { navigationEvents } from "./navigation.js";

// ================================ FUNCTIONS ================================
async function initHome() {
    navigationEvents();
    clientFormEvents();
    clientListEvents();
    await clientGetList();
    metricsInit();
}

// ================================ EVENTS ================================

window.addEventListener('DOMContentLoaded', initHome);
