import database

from flask import Flask, render_template, request, jsonify, redirect

app = Flask(__file__)
database.init_db()

@app.route('/', methods=["GET"])
def home():
    return render_template("index.html")

if __name__ == "__main__":
    app.run()