"""
Consistent API response helpers for MedCode.
All API views should use these to ensure uniform response format.
"""

from rest_framework.response import Response
from rest_framework import status


def success_response(data=None, message="Success", status_code=status.HTTP_200_OK):
    """Return a standardized success response."""
    payload = {
        "success": True,
        "message": message,
    }
    if data is not None:
        payload["data"] = data
    return Response(payload, status=status_code)


def error_response(message="An error occurred", errors=None, status_code=status.HTTP_400_BAD_REQUEST):
    """Return a standardized error response."""
    payload = {
        "success": False,
        "message": message,
    }
    if errors is not None:
        payload["errors"] = errors
    return Response(payload, status=status_code)


def created_response(data=None, message="Created successfully"):
    """Return a standardized 201 Created response."""
    return success_response(data=data, message=message, status_code=status.HTTP_201_CREATED)
