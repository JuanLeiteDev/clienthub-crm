import sqlite3

from pathlib import Path

DB_PATH = Path(__file__).parent.parent / "database" / "clienthub.db"

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
                       enterprise TEXT NOT NULL,
                       email TEXT NOT NULL,
                       phone TEXT NOT NULL,
                       status TEXT NOT NULL CHECK(status IN ('lead', 'em contato', 'cliente', 'perdido')),
                       create_date TEXT DEFAULT CURRENT_TIMESTAMP
                       );""")
        
        cursor.execute("""CREATE TABLE IF NOT EXISTS interaction (
                       id INTEGER PRIMARY KEY AUTOINCREMENT, 
                       client_id INTEGER NOT NULL,
                       communication TEXT NOT NULL CHECK(communication IN('call', 'email', 'whatsapp', 'meeting')),
                       description TEXT NOT NULL,
                       date TEXT NOT NULL,

                       FOREIGN KEY (client_id) REFERENCES clients (id)
                            ON DELETE CASCADE
                       );""")
        
        cursor.execute("""CREATE TABLE IF NOT EXISTS tasks (
                       id INTEGER PRIMARY KEY AUTOINCREMENT,
                       client_id INTEGER NOT NULL,
                       title TEXT NOT NULL,
                       date_limit TEXT NOT NULL,
                       completed TEXT NOT NULL DEFAULT 'False' CHECK(completed IN('True', 'False')),

                       FOREIGN KEY (client_id) REFERENCES clients (id)
                            ON DELETE CASCADE 
                       );""")
        
        connection.commit()
        
    finally:
        cursor.close()
        connection.close()
