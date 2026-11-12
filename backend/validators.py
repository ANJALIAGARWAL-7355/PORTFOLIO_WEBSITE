import re
from typing import Any, Dict, Tuple

if __package__:
    from .security import safe_subject, sanitize_text
else:
    from security import safe_subject, sanitize_text

EMAIL_REGEX = re.compile(r"^[\w\.-]+@([\w-]+\.)+[\w-]{2,4}$")
MAX_NAME_LENGTH = 100
MAX_EMAIL_LENGTH = 254
MAX_SUBJECT_LENGTH = 140
MAX_MESSAGE_LENGTH = 5000


def normalize_contact_payload(data: Any) -> Tuple[Dict[str, str], Dict[str, str]]:
    if not isinstance(data, dict):
        return {}, {"payload": "JSON body must be an object."}

    raw_name = str(data.get("name", "")).strip()
    raw_email = str(data.get("email", "")).strip()
    raw_subject = str(data.get("subject", "")).strip()
    raw_message = str(data.get("message", "")).strip()
    name = sanitize_text(raw_name, MAX_NAME_LENGTH)
    email = sanitize_text(raw_email, MAX_EMAIL_LENGTH)
    subject = safe_subject(raw_subject)
    message = sanitize_text(raw_message, MAX_MESSAGE_LENGTH)

    normalized = {
        "name": name,
        "email": email,
        "subject": subject,
        "message": message,
    }

    errors: Dict[str, str] = {}
    if len(raw_name) > MAX_NAME_LENGTH:
        errors["name"] = f"Name must be {MAX_NAME_LENGTH} characters or fewer."
    if len(raw_email) > MAX_EMAIL_LENGTH:
        errors["email"] = f"Email must be {MAX_EMAIL_LENGTH} characters or fewer."
    if len(raw_subject) > MAX_SUBJECT_LENGTH:
        errors["subject"] = (
            f"Subject must be {MAX_SUBJECT_LENGTH} characters or fewer."
        )
    if len(raw_message) > MAX_MESSAGE_LENGTH:
        errors["message"] = (
            f"Message must be {MAX_MESSAGE_LENGTH} characters or fewer."
        )
    if not normalized["name"] or len(normalized["name"]) < 2:
        errors.setdefault("name", "Name must be at least 2 characters long.")
    if not normalized["email"] or not EMAIL_REGEX.match(normalized["email"]):
        errors.setdefault("email", "Please provide a valid email address.")
    if not normalized["message"] or len(normalized["message"]) < 5:
        errors.setdefault("message", "Message must be at least 5 characters long.")

    return normalized, errors
