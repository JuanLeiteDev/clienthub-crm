const HEADER = {"Content-Type": "application/json"};

async function parseResponse(response) {
    let newResponse;

    try {
        newResponse = await response.json();
    } catch {
        newResponse = {"sucesse": false, "errors": "Resposta inválida do servidor."}
    }

    return newResponse
}

export async function clientCreate(request) {
    try {
        const response = await fetch('/api/clients', {
            method: "POST",
            headers: HEADER,
            body: JSON.stringify(request)
        });
        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."}
    }
    
}

export async function clientsGet() {
    try {
        const response = await fetch("/api/clients", {
            method: "GET",
            headers: HEADER
        });

        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."}
    }
}
