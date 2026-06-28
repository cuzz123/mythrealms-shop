#!/usr/bin/env python3
"""Generate 4 collection cover images via Agnes API — 4:3 landscape, dark editorial style"""

import requests, os, time, base64

AGNES_KEY = "sk-N6xBOlG5L3XFU7blmlkdOSGawJo6D6kUpNcMd6QqbNHxDbDx"
API = "https://apihub.agnes-ai.com/v1/images/generations"
OUT = "/mnt/d/mythrealms-shop/public/images/test-covers"
os.makedirs(OUT, exist_ok=True)

COVERS = [
    ("pearl-series-cover.webp", "pearl-series",
     "pearl-series-cover.webp",
     "Luxury pearl bracelet on dark charcoal fabric. Soft warm light catching natural iridescence. Moody editorial jewelry photography. 4:3 landscape. Dark background. Clean composition."),
    ("luxe-collection-cover.webp", "luxe-collection",
     "luxe-collection-cover.webp",
     "Crystal stone bracelets on dark fabric. Multiple bracelets with natural gemstone beads. Warm golden light. Moody dark editorial jewelry photography. 4:3 landscape. Clean composition."),
    ("pearl-crystal-series-cover.webp", "pearl-crystal-series",
     "pearl-crystal-series-cover.webp",
     "Pearl and crystal bracelet mixed together on dark fabric. Soft light catching both pearl luster and crystal facets. Moody editorial. 4:3 landscape. Clean."),
    ("curated-singles-cover.webp", "curated-singles",
     "curated-singles-cover.webp",
     "Single crystal bracelet on dark fabric. Natural stone beads with visible texture. Warm golden light. Moody editorial jewelry photography. 4:3 landscape. Clean."),
]

for filename, slug, ref_file, prompt in COVERS:
    print(f"Generating {filename}...")

    res = requests.post(API, json={
        "model": "agnes-image-2.1-flash",
        "prompt": prompt,
        "n": 1,
        "size": "1200x900",
    }, headers={
        "Authorization": f"Bearer {AGNES_KEY}",
        "Content-Type": "application/json",
    })

    if not res.ok:
        print(f"  FAIL: {res.status_code} {res.text[:200]}")
        continue

    url = res.json()["data"][0]["url"]
    img = requests.get(url).content
    out_path = os.path.join(OUT, filename)
    with open(out_path, "wb") as f:
        f.write(img)

    kb = len(img) / 1024
    print(f"  OK: {out_path} ({kb:.0f}KB)")
    time.sleep(3)

print(f"\nDone. Check: {OUT}")
