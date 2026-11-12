from datetime import datetime
from os.path import basename

from flask import Flask, jsonify, request
from flask_cors import CORS

if __package__:
    from .analytics import AnalyticsValidationError, get_summary, record_event
    from .config import settings
    from .database import (
        count_contact_messages,
        fetch_contact_messages,
        init_db,
        save_contact_message,
        update_contact_status,
    )
    from .project_catalog import (
        CATEGORIES,
        PROJECTS_BY_SLUG,
        filter_projects,
        paginate_projects,
        project_summary,
    )
    from .rate_limit import SlidingWindowRateLimiter
    from .security import is_admin_authorized
    from .validators import normalize_contact_payload
else:
    from analytics import AnalyticsValidationError, get_summary, record_event
    from config import settings
    from database import (
        count_contact_messages,
        fetch_contact_messages,
        init_db,
        save_contact_message,
        update_contact_status,
    )
    from project_catalog import (
        CATEGORIES,
        PROJECTS_BY_SLUG,
        filter_projects,
        paginate_projects,
        project_summary,
    )
    from rate_limit import SlidingWindowRateLimiter
    from security import is_admin_authorized
    from validators import normalize_contact_payload

app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": list(settings.allowed_origins)}})

init_db()
contact_limiter = SlidingWindowRateLimiter(
    settings.contact_rate_limit, settings.contact_rate_window
)


def _json_error(error: str, status: int, **details):
    return jsonify({"success": False, "error": error, **details}), status


def _admin_access():
    if not settings.admin_token:
        return _json_error("Admin access is not configured.", 503)
    if not is_admin_authorized(
        request.headers.get("Authorization"), settings.admin_token
    ):
        return _json_error("A valid admin bearer token is required.", 401)
    return None


def _integer_query(name: str, default: int, minimum: int, maximum: int):
    raw_value = request.args.get(name)
    if raw_value is None:
        return default, None
    try:
        value = int(raw_value)
    except ValueError:
        return None, _json_error(f"{name} must be an integer.", 400)
    if value < minimum or value > maximum:
        return None, _json_error(
            f"{name} must be between {minimum} and {maximum}.", 400
        )
    return value, None


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "status": "online",
        "service": settings.service_name,
        "timestamp": datetime.utcnow().isoformat(),
        "database": f"SQLite ({basename(settings.db_path)})",
    }), 200


@app.route("/api/projects", methods=["GET"])
def list_projects():
    limit, error = _integer_query("limit", 20, 1, 50)
    if error:
        return error
    offset, error = _integer_query("offset", 0, 0, 10000)
    if error:
        return error

    featured = request.args.get("featured")
    if featured is not None and featured.lower() not in {"true", "false"}:
        return _json_error("featured must be true or false.", 400)
    if any(
        len(request.args.get(key, "")) > maximum
        for key, maximum in (
            ("q", 120),
            ("category", 80),
            ("technology", 80),
            ("status", 80),
        )
    ):
        return _json_error("Project filters exceed their maximum length.", 400)

    selected = filter_projects(
        query=request.args.get("q", ""),
        category=request.args.get("category", ""),
        technology=request.args.get("technology", ""),
        status=request.args.get("status", ""),
        featured=featured.lower() == "true" if featured is not None else None,
    )
    page, pagination = paginate_projects(selected, limit, offset)
    return jsonify({
        "success": True,
        "projects": [project.to_dict() for project in page],
        "pagination": pagination,
        "filters": {
            "categories": list(CATEGORIES),
            "query": request.args.get("q", ""),
        },
    }), 200


@app.route("/api/projects/summary", methods=["GET"])
def projects_summary():
    return jsonify({"success": True, "summary": project_summary()}), 200


@app.route("/api/projects/<slug>", methods=["GET"])
def get_project(slug: str):
    project = PROJECTS_BY_SLUG.get(slug)
    if project is None:
        return _json_error("Project not found.", 404)
    return jsonify({"success": True, "project": project.to_dict()}), 200


@app.route("/api/contact", methods=["POST"])
def submit_contact():
    data = request.get_json(silent=True)
    if not data:
        return _json_error("Invalid JSON payload.", 400)

    if not contact_limiter.allow(request.remote_addr or "unknown"):
        return _json_error("Too many contact submissions. Please try again later.", 429)

    normalized_payload, errors = normalize_contact_payload(data)
    if errors:
        return _json_error("Validation failed.", 422, errors=errors)

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
        app.logger.exception("Failed to save contact submission")
        return _json_error(
            "Internal server error saving message: " + str(exc), 500
        )


@app.route("/api/contact/messages", methods=["GET"])
def list_messages():
    access_error = _admin_access()
    if access_error:
        return access_error

    limit, error = _integer_query("limit", 20, 1, 100)
    if error:
        return error
    offset, error = _integer_query("offset", 0, 0, 100000)
    if error:
        return error

    status = request.args.get("status")
    allowed_statuses = {"new", "read", "replied", "archived"}
    if status and status not in allowed_statuses:
        return _json_error(
            "status must be one of: " + ", ".join(sorted(allowed_statuses)), 400
        )
    search = request.args.get("q", "").strip()
    if len(search) > 100:
        return _json_error("q must be 100 characters or fewer.", 400)

    try:
        messages = fetch_contact_messages(
            limit=limit, offset=offset, status=status, search=search or None
        )
        total = count_contact_messages(status=status, search=search or None)
        return jsonify({
            "success": True,
            "count": len(messages),
            "total": total,
            "limit": limit,
            "offset": offset,
            "messages": messages,
        }), 200
    except Exception as exc:
        app.logger.exception("Failed to list contact submissions")
        return jsonify({"success": False, "error": str(exc)}), 500


@app.route("/api/contact/messages/<int:message_id>", methods=["PATCH"])
def change_message_status(message_id: int):
    access_error = _admin_access()
    if access_error:
        return access_error

    data = request.get_json(silent=True)
    if not isinstance(data, dict):
        return _json_error("JSON body must be an object.", 400)
    status = data.get("status")
    allowed_statuses = {"new", "read", "replied", "archived"}
    if not isinstance(status, str) or status not in allowed_statuses:
        return _json_error(
            "status must be one of: archived, new, read, replied.", 422
        )
    try:
        if not update_contact_status(message_id, status):
            return _json_error("Contact message not found.", 404)
        return jsonify({
            "success": True,
            "messageId": message_id,
            "status": status,
        }), 200
    except Exception as exc:
        app.logger.exception("Failed to update contact submission status")
        return _json_error("Internal server error updating message: " + str(exc), 500)


@app.route("/api/analytics/events", methods=["POST"])
def submit_analytics_event():
    data = request.get_json(silent=True)
    if not data:
        return _json_error("Invalid JSON payload.", 400)
    try:
        event_id = record_event(data)
    except AnalyticsValidationError as exc:
        return _json_error(str(exc), 422)
    except Exception as exc:
        app.logger.exception("Failed to record analytics event")
        return _json_error("Internal server error recording event: " + str(exc), 500)
    return jsonify({"success": True, "eventId": event_id}), 201


@app.route("/api/analytics/summary", methods=["GET"])
def analytics_summary():
    access_error = _admin_access()
    if access_error:
        return access_error
    since = request.args.get("since")
    try:
        summary, parsed_start = get_summary(since)
    except AnalyticsValidationError as exc:
        return _json_error(str(exc), 400)
    except Exception as exc:
        app.logger.exception("Failed to build analytics summary")
        return _json_error("Internal server error building summary: " + str(exc), 500)
    return jsonify({
        "success": True,
        "since": parsed_start,
        "summary": summary,
    }), 200


if __name__ == "__main__":
    print(f"Starting {settings.service_name} on port {settings.port}...")
    app.run(host=settings.host, port=settings.port, debug=False)
