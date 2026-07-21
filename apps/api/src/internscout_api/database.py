"""SQLAlchemy engine, session, and transaction helpers."""

from collections.abc import Generator
from contextlib import contextmanager

from fastapi import Request
from sqlalchemy import MetaData, create_engine
from sqlalchemy.engine import Engine
from sqlalchemy.orm import DeclarativeBase, Session, sessionmaker

from internscout_api.config import Settings

CONSTRAINT_NAMING_CONVENTION = {
    "ix": "ix_%(column_0_label)s",
    "uq": "uq_%(table_name)s_%(column_0_name)s",
    "ck": "ck_%(table_name)s_%(constraint_name)s",
    "fk": "fk_%(table_name)s_%(column_0_name)s_%(referred_table_name)s",
    "pk": "pk_%(table_name)s",
}


class Base(DeclarativeBase):
    """Base for all persisted domain models."""

    metadata = MetaData(naming_convention=CONSTRAINT_NAMING_CONVENTION)


SessionFactory = sessionmaker[Session]


def create_database_engine(settings: Settings) -> Engine:
    """Create a lazy PostgreSQL engine without exposing credentials in logs."""

    return create_engine(
        settings.database_url.get_secret_value(),
        pool_pre_ping=True,
    )


def create_session_factory(engine: Engine) -> SessionFactory:
    """Create the application session factory for an engine."""

    return sessionmaker(bind=engine, expire_on_commit=False)


@contextmanager
def transaction(session_factory: SessionFactory) -> Generator[Session, None, None]:
    """Commit a unit of work, or roll it back when an exception escapes."""

    with session_factory.begin() as session:
        yield session


def get_session(request: Request) -> Generator[Session, None, None]:
    """FastAPI dependency providing one transactional session per request."""

    session_factory: SessionFactory = request.app.state.session_factory
    with transaction(session_factory) as session:
        yield session
