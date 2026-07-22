"""Score every PNG emitted by search_silhouette_parameters.py."""
from pathlib import Path
import csv
import cv2
import numpy as np

ROOT = Path(__file__).resolve().parent
SEARCH = ROOT / "analysis" / "score_search"
REF = cv2.imread(r"C:\Users\11458\.codex\attachments\90349baa-907d-418b-ad34-a367b932ecf8\image-1.png")


def normalise(mask):
    ys, xs = np.where(mask > 0)
    if not len(xs):
        return np.zeros((512, 384), np.uint8)
    return cv2.resize(mask[ys.min():ys.max() + 1, xs.min():xs.max() + 1], (384, 512), interpolation=cv2.INTER_NEAREST)


roi = REF[170:780, 430:970]
target = cv2.inRange(cv2.cvtColor(roi, cv2.COLOR_BGR2HSV), (115, 25, 90), (175, 190, 255))
target = normalise(target)
rows = []
for path in sorted(SEARCH.glob("c*.png")):
    render = cv2.imread(str(path), cv2.IMREAD_UNCHANGED)
    mask = normalise(render[:, :, 3])
    intersection = np.logical_and(target > 0, mask > 0).sum()
    union = np.logical_or(target > 0, mask > 0).sum()
    rows.append((100 * intersection / max(union, 1), path.name))
rows.sort(reverse=True)
with (SEARCH / "scores.csv").open("w", newline="", encoding="utf8") as handle:
    writer = csv.writer(handle)
    writer.writerow(["score", "file"])
    writer.writerows(rows)
for score, name in rows[:20]:
    print(f"{name} {score:.2f}")
