"""Local, credential-safe helpers for Tencent Hunyuan 3D character jobs."""

from __future__ import annotations

import base64
import json
from pathlib import Path
from typing import Callable
from urllib.request import Request, urlopen

from PIL import Image


def _base64_file(path: Path) -> str:
    return base64.b64encode(Path(path).read_bytes()).decode("ascii")


def build_hunyuan_pro_payload(
    views: dict[str, Path],
    *,
    face_count: int = 100000,
) -> dict[str, object]:
    """Build the documented Hunyuan 3D Pro 3.1 image-to-3D request.

    Tencent's API-key endpoint accepts a local primary image through the
    professional API's ``ImageBase64`` field. Supplementary images use
    ``ViewImageBase64`` so their orientation stays explicit.
    """
    required_views = {"front", "right_front", "back"}
    missing_views = required_views.difference(views)
    if missing_views:
        raise ValueError(f"Missing required views: {', '.join(sorted(missing_views))}")
    if not 3000 <= face_count <= 1_500_000:
        raise ValueError("face_count must be between 3000 and 1500000")

    return {
        "Model": "3.1",
        "ImageBase64": _base64_file(Path(views["front"])),
        "MultiViewImages": [
            {
                "ViewType": "right_front",
                "ViewImageBase64": _base64_file(Path(views["right_front"])),
            },
            {
                "ViewType": "back",
                "ViewImageBase64": _base64_file(Path(views["back"])),
            },
        ],
        "EnablePBR": True,
        "FaceCount": face_count,
        "GenerateType": "Normal",
    }


def post_json(
    url: str,
    payload: dict[str, object],
    *,
    api_key: str,
    opener: Callable = urlopen,
    timeout_seconds: int = 30,
) -> dict[str, object]:
    """POST JSON to Hunyuan's API-key endpoint without persisting the key."""
    if not api_key.startswith("sk-"):
        raise ValueError("HUNYUAN_3D_API_KEY must be an sk- prefixed API key.")
    request = Request(
        url,
        data=json.dumps(payload, ensure_ascii=False).encode("utf-8"),
        headers={
            "Authorization": api_key,
            "Content-Type": "application/json",
        },
        method="POST",
    )
    with opener(request, timeout=timeout_seconds) as response:
        return json.loads(response.read().decode("utf-8"))


def split_three_view_reference(
    reference_path: Path,
    output_dir: Path,
    *,
    max_long_edge: int = 1536,
) -> dict[str, Path]:
    """Split a left-to-right front / three-quarter / back contact sheet.

    The front image is sent as Hunyuan's primary image.  The middle and last
    panels become the Model 3.1 ``right_front`` and ``back`` multi-view inputs.
    """
    reference_path = Path(reference_path)
    output_dir = Path(output_dir)
    output_dir.mkdir(parents=True, exist_ok=True)

    with Image.open(reference_path) as source:
        image = source.convert("RGB")
        panel_width = image.width // 3
        if panel_width < 1:
            raise ValueError("Reference image must contain three horizontal panels.")

        panel_bounds = {
            "front": (0, 0, panel_width, image.height),
            "right_front": (panel_width, 0, panel_width * 2, image.height),
            "back": (panel_width * 2, 0, image.width, image.height),
        }
        result: dict[str, Path] = {}
        for view, bounds in panel_bounds.items():
            panel = image.crop(bounds)
            longest_edge = max(panel.size)
            if longest_edge > max_long_edge:
                scale = max_long_edge / longest_edge
                panel = panel.resize(
                    (round(panel.width * scale), round(panel.height * scale)),
                    Image.Resampling.LANCZOS,
                )
            destination = output_dir / f"{view}.jpg"
            panel.save(destination, "JPEG", quality=92, optimize=True)
            result[view] = destination
    return result
