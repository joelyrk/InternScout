"""PostgreSQL migration integration tests."""

import os
from pathlib import Path
from urllib.parse import urlsplit

import pytest
from alembic import command
from alembic.config import Config
from sqlalchemy import create_engine, inspect, text

pytestmark = pytest.mark.integration


def _database_name(url: str) -> str:
    return urlsplit(url.replace("postgresql+psycopg://", "postgresql://", 1)).path.lstrip("/")


def _test_database_url() -> str:
    url = os.getenv("INTERNSCOUT_TEST_DATABASE_URL")
    if url is None:
        pytest.skip("INTERNSCOUT_TEST_DATABASE_URL is not configured")

    application_url = os.getenv("INTERNSCOUT_DATABASE_URL")
    test_database = _database_name(url)
    if not test_database.endswith("_test"):
        pytest.fail("integration database name must end with '_test'")
    if application_url is not None and _database_name(application_url) == test_database:
        pytest.fail("integration and application database names must differ")
    return url


def _alembic_config(url: str) -> Config:
    api_root = Path(__file__).resolve().parents[1]
    config = Config(api_root / "alembic.ini")
    config.set_main_option("script_location", str(api_root / "migrations"))
    config.set_main_option("sqlalchemy.url", url.replace("%", "%%"))
    return config


def test_migrations_upgrade_from_empty_database_and_downgrade() -> None:
    url = _test_database_url()
    engine = create_engine(url)
    config = _alembic_config(url)

    try:
        command.downgrade(config, "base")
        with engine.begin() as connection:
            connection.execute(text("DROP TABLE IF EXISTS alembic_version"))
        assert inspect(engine).get_table_names() == []

        command.upgrade(config, "head")
        with engine.connect() as connection:
            revision = connection.execute(
                text("SELECT version_num FROM alembic_version")
            ).scalar_one()
        assert revision == "20260721_0001"

        command.downgrade(config, "base")
        assert inspect(engine).get_table_names() == ["alembic_version"]
        with engine.connect() as connection:
            remaining_revisions = connection.execute(
                text("SELECT count(*) FROM alembic_version")
            ).scalar_one()
        assert remaining_revisions == 0
    finally:
        engine.dispose()
