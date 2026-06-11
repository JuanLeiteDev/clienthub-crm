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

export async function create_client(request) {
    try {
        const response = await fetch('/api/clients', {
            method: "POST",
            headers: HEADER,
            body: JSON.stringify(request)
        });
        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "message": "Erro de conexão com o servidor."}
    }
    
}