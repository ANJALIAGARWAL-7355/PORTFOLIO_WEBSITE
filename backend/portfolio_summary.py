"""Portfolio summary helpers for the backend service."""

from typing import Dict, List


def get_focus_areas() -> List[str]:
    return [
        "AI/ML engineering",
        "full-stack product delivery",
        "database engineering",
        "modern UX systems",
        "research-driven prototyping",
    ]


def get_service_summary() -> Dict[str, object]:
    return {
        "service": "Anjali Agarwal Portfolio Backend",
        "status": "active",
        "focus_areas": get_focus_areas(),
        "coverage": "contact form, analytics, and portfolio metadata",
    }
