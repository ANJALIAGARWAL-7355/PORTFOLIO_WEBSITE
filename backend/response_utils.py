"""Reusable response builders for the API."""

from typing import Any, Dict, Optional


def build_success_response(message: str, payload: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    response = {"success": True, "message": message}
    if payload:
        response.update(payload)
    return response


def build_error_response(error: str, details: Optional[Dict[str, Any]] = None) -> Dict[str, Any]:
    response = {"success": False, "error": error}
    if details:
        response.update(details)
    return response
