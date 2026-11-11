import os
import re
import sqlite3
from datetime import datetime
from flask import Flask, request, jsonify
from flask_cors import CORS

app = Flask(__name__)
# Enable CORS for local dev servers and production
CORS(app, resources={r"/api/*": {"origins": "*"}})

DB_PATH = os.path.join(os.path.dirname(os.path.abspath(__file__)), "contacts.db")

def init_db():
    conn = sqlite3.connect(DB_PATH)
    cursor = conn.cursor()
    cursor.execute("""
        CREATE TABLE IF NOT EXISTS contact_messages (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            name TEXT NOT NULL,
            email TEXT NOT NULL,
            subject TEXT,
            message TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()

# Initialize database on startup
init_db()

EMAIL_REGEX = re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$")

@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": "Anjali Agarwal Portfolio API",
        "timestamp": datetime.utcnow().isoformat(),
        "database": "SQLite (contacts.db)"
    }), 200

@app.route("/api/contact", methods=["POST"])
def submit_contact():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON payload"}), 400

    name = str(data.get("name", "")).strip()
    email = str(data.get("email", "")).strip()
    subject = str(data.get("subject", "Portfolio Inquiry")).strip()
    message = str(data.get("message", "")).strip()

    # Validation
    errors = {}
    if not name or len(name) < 2:
        errors["name"] = "Name must be at least 2 characters long."
    if not email or not EMAIL_REGEX.match(email):
        errors["email"] = "Please provide a valid email address."
    if not message or len(message) < 5:
        errors["message"] = "Message must be at least 5 characters long."

    if errors:
        return jsonify({"success": False, "errors": errors, "error": "Validation failed"}), 422

    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute(
            "INSERT INTO contact_messages (name, email, subject, message) VALUES (?, ?, ?, ?)",
            (name, email, subject, message)
        )
        conn.commit()
        msg_id = cursor.lastrowid
        conn.close()

        return jsonify({
            "success": True,
            "message": f"Thank you, {name}! Your message has been sent successfully. Anjali will get back to you soon.",
            "messageId": msg_id
        }), 201

    except Exception as e:
        return jsonify({"success": False, "error": "Internal server error saving message: " + str(e)}), 500

@app.route("/api/contact/messages", methods=["GET"])
def list_messages():
    try:
        conn = sqlite3.connect(DB_PATH)
        cursor = conn.cursor()
        cursor.execute("SELECT id, name, email, subject, message, created_at FROM contact_messages ORDER BY id DESC")
        rows = cursor.fetchall()
        conn.close()

        messages = [
            {"id": r[0], "name": r[1], "email": r[2], "subject": r[3], "message": r[4], "created_at": r[5]}
            for r in rows
        ]
        return jsonify({"success": True, "count": len(messages), "messages": messages}), 200
    except Exception as e:
        return jsonify({"success": False, "error": str(e)}), 500

if __name__ == "__main__":
    port = int(os.environ.get("PORT", 5000))
    print(f"Starting Anjali Agarwal Portfolio Python Backend on port {port}...")
    app.run(host="127.0.0.1", port=port, debug=False)
