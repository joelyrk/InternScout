# pyright: reportUnusedFunction=false

"""Stable, privacy-conscious API error responses."""

import logging
from http import HTTPStatus
from typing import Any

from fastapi import FastAPI, Request
from fastapi.exceptions import RequestValidationError
from fastapi.responses import JSONResponse
from pydantic import BaseModel, ConfigDict
from starlette.exceptions import HTTPException as StarletteHTTPException

logger = logging.getLogger(__name__)


class ErrorBody(BaseModel):
    """Machine-readable API error body."""

    model_config = ConfigDict(extra="forbid")

    code: str
    message: str
    details: dict[str, object] | None = None


class ErrorResponse(BaseModel):
    """Standard response envelope for every API error."""

    model_config = ConfigDict(extra="forbid")

    error: ErrorBody


class APIError(Exception):
    """Expected application error that is safe to expose to an API client."""

    def __init__(
        self,
        *,
        status_code: int,
        code: str,
        message: str,
        details: dict[str, object] | None = None,
    ) -> None:
        super().__init__(message)
        self.status_code = status_code
        self.code = code
        self.message = message
        self.details = details


def _error_content(
    *,
    code: str,
    message: str,
    details: dict[str, object] | None = None,
) -> dict[str, Any]:
    response = ErrorResponse(error=ErrorBody(code=code, message=message, details=details))
    return response.model_dump(mode="json")


def _http_error(status_code: int) -> tuple[str, str]:
    known_errors: dict[int, tuple[str, str]] = {
        int(HTTPStatus.NOT_FOUND): ("NOT_FOUND", "Resource not found."),
        int(HTTPStatus.METHOD_NOT_ALLOWED): ("METHOD_NOT_ALLOWED", "Method not allowed."),
    }
    return known_errors.get(status_code, ("HTTP_ERROR", "The request could not be completed."))


def _validation_details(exc: RequestValidationError) -> dict[str, object]:
    """Return validation issues without echoing request input."""

    issues: list[dict[str, str]] = []
    for error in exc.errors():
        location = ".".join(str(part) for part in error.get("loc", ()))
        issues.append(
            {
                "location": location,
                "message": str(error.get("msg", "Invalid value.")),
                "type": str(error.get("type", "validation_error")),
            }
        )
    return {"issues": issues}


def register_error_handlers(app: FastAPI) -> None:
    """Register the common error contract on an application."""

    @app.exception_handler(APIError)
    async def api_error_handler(_request: Request, exc: APIError) -> JSONResponse:
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_content(
                code=exc.code,
                message=exc.message,
                details=exc.details,
            ),
        )

    @app.exception_handler(RequestValidationError)
    async def validation_error_handler(
        _request: Request,
        exc: RequestValidationError,
    ) -> JSONResponse:
        return JSONResponse(
            status_code=HTTPStatus.UNPROCESSABLE_ENTITY,
            content=_error_content(
                code="VALIDATION_ERROR",
                message="Request validation failed.",
                details=_validation_details(exc),
            ),
        )

    @app.exception_handler(StarletteHTTPException)
    async def http_error_handler(
        _request: Request,
        exc: StarletteHTTPException,
    ) -> JSONResponse:
        code, message = _http_error(exc.status_code)
        return JSONResponse(
            status_code=exc.status_code,
            content=_error_content(code=code, message=message),
            headers=exc.headers,
        )

    @app.exception_handler(Exception)
    async def unhandled_error_handler(request: Request, exc: Exception) -> JSONResponse:
        logger.error(
            "Unhandled API exception",
            extra={
                "exception_type": type(exc).__name__,
                "request_method": request.method,
            },
        )
        return JSONResponse(
            status_code=HTTPStatus.INTERNAL_SERVER_ERROR,
            content=_error_content(
                code="INTERNAL_ERROR",
                message="An unexpected error occurred.",
            ),
        )
