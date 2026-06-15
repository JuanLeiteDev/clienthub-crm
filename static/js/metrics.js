import { clientsMetrics } from "./client_list.js";

const elementsMetrics = {
    totalClientes: {"title": "Total de clientes", "value": null, "icon": "fa-solid fa-users"},
    leadsAtivos: {"title": "Leads ativos", "value": null, "icon": "fa-solid fa-user-plus"},
    clientesFechados: {"title": "Clientes fechados", "value": null, "icon": "fa-solid fa-handshake"},
    clientesPerdidos: {"title": "Clientes perdidos", "value": null, "icon": "fa-solid fa-user-xmark"},
    taxaConversao: {"title": "Taxa de conversão", "value": null, "icon": "fa-solid fa-chart-line"},
    tarefasPendentes: {"title": "Tarefas pendentes", "value": null, "icon": "fa-solid fa-clipboard-list"},
    tarefasAtrasadas: {"title": "Tarefas atrasadas", "value": null, "icon": "fa-solid fa-clock"},
    interacoesRegistradas: {"title": "Interações registradas", "value": null, "icon": "fa-solid fa-comments"}
}

const elementsHTML = {
    containerCima: document.querySelector('#cima'),
    containerBaixo: document.querySelector('#baixo')
}

function metricsCreateHTML() {
    let contador = 1;
    for(const key in elementsMetrics){
        const metricCard = document.createElement('div');
        metricCard.classList.add('metric-card');

        const metricCardInfo = document.createElement('div');
        metricCardInfo.classList.add('metric-card-info');

        const metricTitle = document.createElement('h3');
        metricTitle.classList.add('metric-card-title');
        metricTitle.innerText = elementsMetrics[key].title;

        const metricValue = document.createElement('p');
        metricValue.classList.add('metric-card-value');
        metricValue.innerText = elementsMetrics[key].value;

        metricCardInfo.append(metricTitle, metricValue);
        metricCard.append(metricCardInfo);

        const metricCardIcon = document.createElement('div');
        metricCardIcon.classList.add('metric-card-icon');

        const metricIcon = document.createElement('i');
        metricIcon.classList.add(...String(elementsMetrics[key].icon).split(' '));

        metricCardIcon.append(metricIcon);
        metricCard.append(metricCardIcon);
        (contador<=4) ? elementsHTML.containerCima.append(metricCard):elementsHTML.containerBaixo.append(metricCard);

        contador++;
    }
}

function metricsUpdate() {
    const data = clientsMetrics();

    elementsMetrics.totalClientes.value = data.total;
    elementsMetrics.leadsAtivos.value = data.ativos;
    elementsMetrics.clientesFechados.value = data.fechados;
    elementsMetrics.clientesPerdidos.value = data.perdidos;
    elementsMetrics.taxaConversao.value = String().concat(String(data.conversao), " %");
    elementsMetrics.tarefasPendentes.value = data.pendentes;
    elementsMetrics.tarefasAtrasadas.value = data.atrasadas;
    elementsMetrics.interacoesRegistradas.value = data.interacoes;
}

export function metricsInit() {
    metricsUpdate();
    metricsCreateHTML();
}