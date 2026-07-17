"""Shared API test fixtures."""

import pytest
from fastapi.testclient import TestClient

from internscout_api.config import Environment, Settings
from internscout_api.main import create_app


@pytest.fixture
def client() -> TestClient:
    """Return a client with isolated synthetic test settings."""

    settings = Settings(environment=Environment.TEST)
    return TestClient(create_app(settings))
