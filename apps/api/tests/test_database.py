"""Database helper unit tests."""

from unittest.mock import MagicMock

import pytest
from fastapi import Request
from pydantic import SecretStr
from sqlalchemy import Engine
from sqlalchemy.orm import Session

from internscout_api.config import Environment, Settings
from internscout_api.database import (
    create_database_engine,
    create_session_factory,
    get_session,
    transaction,
)


def test_database_engine_and_session_factory_use_configured_postgresql() -> None:
    settings = Settings(
        environment=Environment.TEST,
        database_url=SecretStr("postgresql+psycopg://synthetic:secret@localhost/internscout_test"),
    )

    engine = create_database_engine(settings)
    session_factory = create_session_factory(engine)

    assert isinstance(engine, Engine)
    assert engine.url.database == "internscout_test"
    assert "secret" not in str(engine.url)
    assert "***" in str(engine.url)
    assert session_factory.kw["expire_on_commit"] is False
    engine.dispose()


def test_transaction_commits_and_closes_session() -> None:
    session = MagicMock(spec=Session)
    begin_context = MagicMock()
    begin_context.__enter__.return_value = session
    session_factory = MagicMock()
    session_factory.begin.return_value = begin_context

    with transaction(session_factory) as yielded_session:
        assert yielded_session is session

    begin_context.__exit__.assert_called_once_with(None, None, None)


def test_transaction_passes_exception_to_rollback_context() -> None:
    session = MagicMock(spec=Session)
    begin_context = MagicMock()
    begin_context.__enter__.return_value = session
    begin_context.__exit__.return_value = False
    session_factory = MagicMock()
    session_factory.begin.return_value = begin_context
    error = RuntimeError("synthetic failure")

    with (
        pytest.raises(RuntimeError, match="synthetic failure"),
        transaction(session_factory),
    ):
        raise error

    begin_context.__exit__.assert_called_once()
    exception_type, exception, traceback = begin_context.__exit__.call_args.args
    assert exception_type is RuntimeError
    assert exception is error
    assert traceback is not None


def test_request_session_dependency_uses_application_factory() -> None:
    session = MagicMock(spec=Session)
    begin_context = MagicMock()
    begin_context.__enter__.return_value = session
    session_factory = MagicMock()
    session_factory.begin.return_value = begin_context
    request = MagicMock(spec=Request)
    request.app.state.session_factory = session_factory

    dependency = get_session(request)

    assert next(dependency) is session
    with pytest.raises(StopIteration):
        next(dependency)
    begin_context.__exit__.assert_called_once_with(None, None, None)
