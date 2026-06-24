const HEADER = {"Content-Type": "application/json"};

async function parseResponse(response) {
    let newResponse;

    try {
        newResponse = await response.json();
    } catch (error) {
        console.log(error)
        newResponse = {"sucesse": false, "errors": "Resposta inválida do servidor."};
    }
    
    return newResponse;
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
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."};
    }
    
}

export async function clientsList() {
    try {
        const response = await fetch("/api/clients", {
            method: "GET",
            headers: HEADER
        });

        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."};
    }
}

export async function clientDelete(id) {
    try {
        const response = await fetch(`/api/clients/${id}`, {
            method: "DELETE",
            headers: HEADER,
        })

        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."};
    }
}

export async function clientUpdate(request, id) {
    try {
        const response = await fetch(`/api/clients/${id}`, {
            method: "PUT",
            headers: HEADER,
            body: JSON.stringify(request)
        })

        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."};
    }
}

export async function clientGet(id) {
    try {
        const response = await fetch(`/api/clients/${id}`, {
            method: "GET",
            headers: HEADER
        });

        return await parseResponse(response);
    } catch {
        return {"sucesse": false, "errors": "Erro de conexão com o servidor."};
    }
}