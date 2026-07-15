from pathlib import Path

from PIL import Image


TARGET_SIZE = (1600, 2000)
TARGET_RATIO = 4 / 5
RATIO_TOLERANCE = 0.01


def normalize_image(source: Path, destination: Path) -> None:
    with Image.open(source) as image:
        ratio = image.width / image.height
        if abs(ratio - TARGET_RATIO) > RATIO_TOLERANCE:
            raise ValueError(
                f"Image must already be 4:5; received {image.width}x{image.height}"
            )

        converted = image.convert("RGB").resize(TARGET_SIZE, Image.Resampling.LANCZOS)
        destination.parent.mkdir(parents=True, exist_ok=True)
        converted.save(destination, "WEBP", quality=86, method=6)


if __name__ == "__main__":
    import argparse

    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    arguments = parser.parse_args()
    normalize_image(arguments.source, arguments.destination)
