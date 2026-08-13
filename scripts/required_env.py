"""Fail-closed environment access for standalone operator scripts."""

from __future__ import annotations

import os


def require_env(name: str) -> str:
    """Return a non-empty environment value without logging it."""
    value = os.environ.get(name)
    if not value:
        raise SystemExit(f"{name} is required")
    return value
