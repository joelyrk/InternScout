# pyright: reportUnusedFunction=false

"""FastAPI application entry point."""

import logging
from typing import Literal

from fastapi import FastAPI
from pydantic import BaseModel, ConfigDict

from internscout_api import __version__
from internscout_api.config import Environment, Settings, get_settings
from internscout_api.errors import ErrorResponse, register_error_handlers

logger = logging.getLogger(__name__)


class HealthResponse(BaseModel):
    """Process health response."""

    model_config = ConfigDict(extra="forbid")

    status: Literal["ok"]
    service: str
    version: str


class ReadinessResponse(BaseModel):
    """Application readiness response."""

    model_config = ConfigDict(extra="forbid")

    status: Literal["ready"]
    checks: dict[str, Literal["ok"]]


def create_app(settings: Settings | None = None) -> FastAPI:
    """Create an application with validated process settings."""

    app_settings = settings or get_settings()
    logging.getLogger("internscout_api").setLevel(app_settings.log_level.value)

    app = FastAPI(
        title=app_settings.app_name,
        version=__version__,
        description="Candidate-facing internship discovery and application copilot API.",
        docs_url=None if app_settings.environment is Environment.PRODUCTION else "/docs",
        redoc_url=None,
        responses={
            422: {"model": ErrorResponse},
            500: {"model": ErrorResponse},
        },
    )
    app.state.settings = app_settings
    register_error_handlers(app)

    @app.get(
        "/health",
        response_model=HealthResponse,
        tags=["system"],
        summary="Check process health",
    )
    async def health() -> HealthResponse:
        return HealthResponse(status="ok", service="internscout-api", version=__version__)

    @app.get(
        "/ready",
        response_model=ReadinessResponse,
        tags=["system"],
        summary="Check application readiness",
    )
    async def ready() -> ReadinessResponse:
        return ReadinessResponse(status="ready", checks={"configuration": "ok"})

    return app


app = create_app()
