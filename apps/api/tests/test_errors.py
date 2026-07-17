# pyright: reportUnusedFunction=false

"""API error contract tests."""

from fastapi import FastAPI, HTTPException
from fastapi.testclient import TestClient

from internscout_api.config import Environment, Settings
from internscout_api.errors import APIError
from internscout_api.main import create_app


def _test_app() -> FastAPI:
    return create_app(Settings(environment=Environment.TEST))


def test_unknown_route_uses_standard_error_shape(client: TestClient) -> None:
    response = client.get("/does-not-exist")

    assert response.status_code == 404
    assert response.json() == {
        "error": {
            "code": "NOT_FOUND",
            "message": "Resource not found.",
            "details": None,
        }
    }


def test_expected_application_error_preserves_safe_details() -> None:
    app = _test_app()

    @app.get("/expected-error")
    async def expected_error() -> None:
        raise APIError(
            status_code=409,
            code="TEST_CONFLICT",
            message="Synthetic conflict.",
            details={"field": "synthetic"},
        )

    response = TestClient(app).get("/expected-error")

    assert response.status_code == 409
    assert response.json() == {
        "error": {
            "code": "TEST_CONFLICT",
            "message": "Synthetic conflict.",
            "details": {"field": "synthetic"},
        }
    }


def test_validation_error_does_not_echo_request_input() -> None:
    app = _test_app()

    @app.get("/validate")
    async def validate(limit: int) -> dict[str, int]:
        return {"limit": limit}

    response = TestClient(app).get("/validate", params={"limit": "private-input"})
    payload = response.json()

    assert response.status_code == 422
    assert payload["error"]["code"] == "VALIDATION_ERROR"
    assert payload["error"]["details"]["issues"] == [
        {
            "location": "query.limit",
            "message": "Input should be a valid integer, unable to parse string as an integer",
            "type": "int_parsing",
        }
    ]
    assert "private-input" not in response.text


def test_generic_http_error_does_not_expose_exception_detail() -> None:
    app = _test_app()

    @app.get("/teapot")
    async def teapot() -> None:
        raise HTTPException(status_code=418, detail="private diagnostic")

    response = TestClient(app).get("/teapot")

    assert response.status_code == 418
    assert response.json() == {
        "error": {
            "code": "HTTP_ERROR",
            "message": "The request could not be completed.",
            "details": None,
        }
    }
    assert "private diagnostic" not in response.text


def test_unexpected_error_returns_generic_response() -> None:
    app = _test_app()

    @app.get("/unexpected-error")
    async def unexpected_error() -> None:
        raise RuntimeError("private diagnostic")

    response = TestClient(app, raise_server_exceptions=False).get("/unexpected-error")

    assert response.status_code == 500
    assert response.json() == {
        "error": {
            "code": "INTERNAL_ERROR",
            "message": "An unexpected error occurred.",
            "details": None,
        }
    }
    assert "private diagnostic" not in response.text


def test_disallowed_method_uses_standard_error_shape(client: TestClient) -> None:
    response = client.post("/health")

    assert response.status_code == 405
    assert response.json() == {
        "error": {
            "code": "METHOD_NOT_ALLOWED",
            "message": "Method not allowed.",
            "details": None,
        }
    }
