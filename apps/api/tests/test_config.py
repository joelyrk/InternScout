"""Configuration tests."""

import pytest
from pydantic import SecretStr, ValidationError

from internscout_api.config import Environment, LogLevel, Settings


def test_settings_read_prefixed_environment_variables(monkeypatch: pytest.MonkeyPatch) -> None:
    monkeypatch.setenv("INTERNSCOUT_ENVIRONMENT", "staging")
    monkeypatch.setenv("INTERNSCOUT_LOG_LEVEL", "WARNING")
    monkeypatch.setenv(
        "INTERNSCOUT_DATABASE_URL",
        "postgresql+psycopg://synthetic:secret@db.example.test/internscout",
    )
    monkeypatch.setenv(
        "INTERNSCOUT_CORS_ORIGINS",
        '["https://app.example.test"]',
    )

    settings = Settings()

    assert settings.environment is Environment.STAGING
    assert settings.log_level is LogLevel.WARNING
    assert settings.database_url.get_secret_value().endswith("/internscout")
    assert "secret" not in repr(settings)
    assert settings.cors_origins == ("https://app.example.test",)


def test_settings_reject_non_postgresql_database_url() -> None:
    with pytest.raises(ValidationError, match="must use postgresql\\+psycopg"):
        Settings(database_url=SecretStr("sqlite:///synthetic.db"))
