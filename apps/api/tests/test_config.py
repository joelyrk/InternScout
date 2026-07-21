"""Configuration tests."""

import pytest

from internscout_api.config import Environment, LogLevel, Settings


def test_settings_read_prefixed_environment_variables(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNSCOUT_ENVIRONMENT", "staging")
    monkeypatch.setenv("INTERNSCOUT_LOG_LEVEL", "WARNING")
    monkeypatch.setenv(
        "INTERNSCOUT_CORS_ORIGINS",
        '["https://app.example.test"]',
    )

    settings = Settings()

    assert settings.environment is Environment.STAGING
    assert settings.log_level is LogLevel.WARNING
    assert settings.cors_origins == ("https://app.example.test",)
