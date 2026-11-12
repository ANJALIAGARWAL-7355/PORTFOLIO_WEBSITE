from datetime import datetime

from flask import Flask, jsonify, request
from flask_cors import CORS

try:
    from backend.config import settings
    from backend.database import fetch_contact_messages, init_db, save_contact_message
    from backend.validators import normalize_contact_payload
except ImportError:
    from config import settings
    from database import fetch_contact_messages, init_db, save_contact_message
    from validators import normalize_contact_payload

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "*"}})

init_db()


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": settings.service_name,
        "timestamp": datetime.utcnow().isoformat(),
        "database": f"SQLite ({settings.db_path})",
    }), 200


@app.route("/api/contact", methods=["POST"])
def submit_contact():
    data = request.get_json(silent=True)
    if not data:
        return jsonify({"success": False, "error": "Invalid JSON payload"}), 400

    normalized_payload, errors = normalize_contact_payload(data)
    if errors:
        return jsonify({"success": False, "errors": errors, "error": "Validation failed"}), 422

    try:
        message_id = save_contact_message(
            normalized_payload["name"],
            normalized_payload["email"],
            normalized_payload["subject"],
            normalized_payload["message"],
        )

        return jsonify({
            "success": True,
            "message": (
                f"Thank you, {normalized_payload['name']}! Your message has been sent successfully. "
                "Anjali will get back to you soon."
            ),
            "messageId": message_id,
        }), 201
    except Exception as exc:
        return jsonify({
            "success": False,
            "error": "Internal server error saving message: " + str(exc),
        }), 500


@app.route("/api/contact/messages", methods=["GET"])
def list_messages():
    try:
        messages = fetch_contact_messages()
        return jsonify({"success": True, "count": len(messages), "messages": messages}), 200
    except Exception as exc:
        return jsonify({"success": False, "error": str(exc)}), 500


if __name__ == "__main__":
    print(f"Starting {settings.service_name} on port {settings.port}...")
    app.run(host=settings.host, port=settings.port, debug=False)
