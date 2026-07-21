"""Health and readiness endpoint tests."""

from fastapi.testclient import TestClient

from internscout_api.config import Environment, Settings
from internscout_api.main import create_app


def test_health(client: TestClient) -> None:
    response = client.get("/health")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ok",
        "service": "internscout-api",
        "version": "0.1.0",
    }


def test_ready(client: TestClient) -> None:
    response = client.get("/ready")

    assert response.status_code == 200
    assert response.json() == {
        "status": "ready",
        "checks": {"configuration": "ok"},
    }


def test_health_allows_configured_frontend_origin(client: TestClient) -> None:
    response = client.get("/health", headers={"Origin": "http://localhost:3000"})

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://localhost:3000"
    assert response.headers["access-control-allow-credentials"] == "true"


def test_health_does_not_allow_unconfigured_origin(client: TestClient) -> None:
    response = client.get("/health", headers={"Origin": "https://untrusted.example"})

    assert response.status_code == 200
    assert "access-control-allow-origin" not in response.headers


def test_health_preflight_allows_get_from_configured_origin(client: TestClient) -> None:
    response = client.options(
        "/health",
        headers={
            "Origin": "http://127.0.0.1:3000",
            "Access-Control-Request-Method": "GET",
        },
    )

    assert response.status_code == 200
    assert response.headers["access-control-allow-origin"] == "http://127.0.0.1:3000"
    assert response.headers["access-control-allow-methods"] == "GET"


def test_openapi_documents_system_endpoints(client: TestClient) -> None:
    response = client.get("/openapi.json")

    assert response.status_code == 200
    paths = response.json()["paths"]
    assert "/health" in paths
    assert "/ready" in paths


def test_interactive_docs_are_disabled_in_production() -> None:
    app = create_app(Settings(environment=Environment.PRODUCTION))

    response = TestClient(app).get("/docs")

    assert response.status_code == 404
    assert response.json()["error"]["code"] == "NOT_FOUND"
