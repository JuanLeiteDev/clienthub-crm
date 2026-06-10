import sqlite3

from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "database" / "clienthub.db"
ORDER_CLIENT = ['name', 'enterprise', 'email', 'phone', 'status']

def get_connection():
    DB_PATH.parent.mkdir(parents=True, exist_ok=True)

    connection = sqlite3.connect(str(DB_PATH.resolve()))
    connection.row_factory = sqlite3.Row

    return connection

def init_db():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""CREATE TABLE IF NOT EXISTS clients (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       name TEXT NOT NULL,
                       enterprise TEXT,
                       email TEXT,
                       phone TEXT,
                       status TEXT NOT NULL CHECK(status IN ('lead', 'em contato', 'cliente', 'perdido')),
                       created_at TEXT DEFAULT CURRENT_TIMESTAMP
                       );""")
        
        cursor.execute("""CREATE TABLE IF NOT EXISTS interaction (
                       id INTEGER PRIMARY KEY AUTOINCREMENT, 
                       client_id INTEGER NOT NULL,
                       communication TEXT NOT NULL CHECK(communication IN('call', 'email', 'whatsapp', 'meeting')),
                       description TEXT NOT NULL,
                       date TEXT NOT NULL,
                       created_at TEXT DEFAULT CURRENT_TIMESTAMP,

                       FOREIGN KEY (client_id) REFERENCES clients (id)
                            ON DELETE CASCADE
                       );""")
        
        cursor.execute("""CREATE TABLE IF NOT EXISTS tasks (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       client_id INTEGER NOT NULL,
                       title TEXT NOT NULL,
                       due_date TEXT NOT NULL,
                       completed TEXT NOT NULL DEFAULT 'False' CHECK(completed IN('True', 'False')),
                       created_at TEXT DEFAULT CURRENT_TIMESTAMP,
                       
                       FOREIGN KEY (client_id) REFERENCES clients (id)
                            ON DELETE CASCADE 
                       );""")
        
        connection.commit()
        
    finally:
        cursor.close()
        connection.close()

def list_clients():
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM clients;")

        clients_list = cursor.fetchall()

        if not clients_list: return []
        return [dict(client) for client in clients_list]
    
    finally:
        cursor.close()
        connection.close()

def create_client(new_client):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("""INSERT INTO clients (name, enterprise, email, phone, status)
                       VALUES (?, ?, ?, ?, ?);""", tuple(new_client.get(field, None) for field in ORDER_CLIENT))
        
        connection.commit()

        client_id = int(cursor.lastrowid)
        cursor.execute("SELECT * FROM clients WHERE id = (?);", (client_id,))
        client = cursor.fetchone()

        if not client: return []
        return [dict(client)]
        
    finally:
        cursor.close()
        connection.close()

def get_one_client(id: int):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("SELECT * FROM clients WHERE id = (?);", (id,))

        client = cursor.fetchone()
        if not client: return []
        else: return [dict(client)]

    finally:
        cursor.close()
        connection.close()

def update_client(client_updated):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        id = client_updated.get("id", None)
        parameters = [client_updated.get(field, None) for field in ORDER_CLIENT]
        parameters.append(id)

        cursor.execute("""UPDATE clients
                       SET name = (?), enterprise = (?), email = (?), phone = (?), status = (?)
                       WHERE id = (?);""", tuple(parameters))

        connection.commit()

        cursor.execute("SELECT * FROM clients WHERE id = (?);", (id,))
        client = cursor.fetchone()

        if not client: return []
        return [dict(client)]
        
    finally:
        cursor.close()
        connection.close()

def delete_client(id: int):
    connection = get_connection()
    cursor = connection.cursor()

    try:
        cursor.execute("DELETE FROM clients WHERE id = (?);", (id,))
        connection.commit()

        if cursor.rowcount > 0: return True
        else: return False
    finally:
        cursor.close()
        connection.close()
