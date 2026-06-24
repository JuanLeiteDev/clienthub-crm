import database
import phonenumbers as pn

from flask import Flask, render_template, request, jsonify, redirect
from email_validator import validate_email

app = Flask(__file__)

STATUS = ['lead', 'em contato', 'cliente', 'perdido']
clients_list = []

database.init_db()

@app.route('/', methods=["GET"])
def home():
    return render_template("index.html")

@app.route('/api/clients', methods=["GET"])
def get_clients():
    clients = database.list_clients()
    
    response = {
        "sucesse": True,
        "clients": clients
    }

    return jsonify(response), 200

@app.route('/api/clients', methods=["POST"])
def create_client():
    data = request.get_json(silent=True)
    errors, new_data = validate_client(data)

    if errors:
        return jsonify({"sucesse": False, "errors": errors}), 400
    

    new_client = database.create_client(new_data)
    if not new_client: return jsonify({"sucesse": False, "errors": "Cliente não foi inserido na base de dados."}), 400

    response = {
        "sucesse": True,
        "clients": new_client
    }

    return jsonify(response), 201

@app.route('/api/clients/<id>', methods=["GET"])
def get_client(id: int):
    client = database.get_one_client(id)
    if not client: 
        return jsonify({
            "sucesse": False, 
            "errors": "Cliente não encontrado."
        }), 404

    return jsonify({
        "sucesse": True,
        "clients": client
    }), 200

@app.route('/api/clients/<id>', methods=["PUT"])
def update_client(id: int):
    data = request.get_json(silent=True)
    if not data: return jsonify({"sucesse": False, "errors": "Preencha os campos obrigatórios."}), 400
    if not id: return jsonify({"sucesse": False, "errors": "ID do cliente não especificado."}), 400

    try:
        id = int(id)
    except Exception:
        return jsonify({"sucesse": False, "errors": "ID do cliente inválido."}), 400

    errors, new_data = validate_client(data)
    if errors:
        return jsonify({"sucesse": False, "errors": errors}), 400
    
    new_data["id"] = id
    
    client = database.update_client(new_data)
    if not client: return jsonify({"sucesse": False, "errors": "Cliente não atualizado."}), 404
    else: return jsonify({"sucesse": True, "clients": client}), 200

@app.route("/api/clients/<id>", methods=["DELETE"])
def delete_client(id: int):
    if not id: return jsonify({"sucesse": False, "errors": "ID do cliente não especificado."}), 400

    try:
        id = int(id)
    except Exception:
        return jsonify({"sucesse": False, "errors": "ID do cliente inválido."}), 400
    
    if database.delete_client(id): return jsonify({"sucesse": True}), 200
    else: return jsonify({"sucesse": False, "errors": "Cliente não encontrado."}), 404

@app.route("/clients/<id>", methods=["GET"])
def client_page(id: int):
    client = database.get_one_client(id)
    if not client:
        return render_template("index.html")
    
    return render_template("client.html", client=client[0])

def validate_client(data):
    errors = {}

    try:
        if not data: errors["client"] = "Preencha todos os campos."

        name = str(data.get("name", "")).strip().title()
        if not name: errors["name"] = "Preencha o campo nome."
        elif len(name) > 100: errors["name"] = "Campo nome não pode conter mais de 100 caracteres."

        enterprise = str(data.get("enterprise", "")).strip()
        if not enterprise: enterprise = None
        elif len(enterprise) > 50: errors["enterprise"] = "Campo empresa não pode conter mais de 50 caracteres."

        email = str(data.get("email", "")).strip()
        if not email: email = None
        else:
            try:
                valid = validate_email(email)
                email = valid.email
            except Exception:
                errors["email"] = "O email inserido não é válido."

        phone = str(data.get("phone", "")).strip()
        if not phone: phone = None
        else:
            try:
                phone_obg = pn.parse(phone)
                if not pn.is_valid_number(phone_obg):
                    errors["phone"] = "Número de telefone inválido."
                
                phone = pn.format_number(phone_obg, pn.PhoneNumberFormat.E164)
            except pn.NumberParseException:
                errors["phone"] = "Número de telefone inválido."

        status = str(data.get("status", "")).strip().lower()
        if not status: errors["status"] = "Preencha o campos estado."
        if status not in STATUS: errors["status"] = "Campo estado inválido."

    finally:
        if errors:
            return errors, None
        else:
            new_data = {
                "name": name,
                "enterprise": enterprise,
                "email": email,
                "phone": phone,
                "status": status
            }

            return None, new_data


if __name__ == "__main__":
    app.run()