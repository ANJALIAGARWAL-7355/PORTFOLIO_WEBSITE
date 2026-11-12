"""Helpers for summarizing contact form submissions."""

from typing import Dict


def format_message_summary(name: str, email: str, subject: str, message: str) -> Dict[str, str]:
    subject_text = subject.strip() if subject else "Portfolio Inquiry"
    preview = message.strip()
    if len(preview) > 120:
        preview = preview[:117].rstrip() + "..."

    return {
        "recipient": "Anjali Agarwal",
        "sender_name": name.strip(),
        "sender_email": email.strip(),
        "subject": subject_text,
        "message_preview": preview,
    }
