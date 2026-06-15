#!/usr/bin/env python3
"""MythRealms Pinterest Auto-Publisher — batch publish 28 pins"""

import requests, time, sys, os

# === CONFIG ===
TOKEN = "pina_AMA3SIAYADL2UBYAGDAMQDZJP624XHQBQBIQDHNBZCZEEDZ4ZRXGKE5DM6GSAWQ5GB4CWDO4J3XF2PYVIRM4LSYO5YSYEDYA"
BOARD_ID = "1137370149584940020"
BASE_URL = "https://mythrealms-shop.vercel.app"
IMAGE_BASE = f"{BASE_URL}/images/pins"

# === 28 PINS DATA ===
pins = [
    # Azure Dragon (7 mansions)
    {"title":"Jiao Mansion · 角 — 28 Chinese Lunar Mansions Bracelet","desc":"The first mansion of the Azure Dragon. Deep blue lapis lazuli beads with gold star spacers. Each bracelet handcrafted with authentic gemstones. 28 bracelets. 28 destinies. Find your star at MythRealms.","img":f"{IMAGE_BASE}/pin28-jiao.png","link":f"{BASE_URL}/products/jiao-mansion-bracelet"},
    {"title":"Kang Mansion · 亢 — Tiger Eye Bracelet | 28 Mansions","desc":"The second mansion. Golden tiger eye beads with gold spacers. The neck that unfurls with confidence. Handcrafted luxury bracelet.","img":f"{IMAGE_BASE}/pin28-kang.png","link":f"{BASE_URL}/products/kang-mansion-bracelet"},
    {"title":"Di Mansion · 氐 — Brown Agate Bracelet | Chinese Astronomy","desc":"The third mansion of the Azure Dragon. Brown agate beads with gold spacers. Like a tree with deep roots.","img":f"{IMAGE_BASE}/pin28-di.png","link":f"{BASE_URL}/products/di-mansion-bracelet"},
    {"title":"Fang Mansion · 房 — Amethyst Bracelet | 28 Lunar Mansions","desc":"The fourth mansion. Amethyst crystal beads with gold spacers. The chamber of the heart. For emotional clarity.","img":f"{IMAGE_BASE}/pin28-fang.png","link":f"{BASE_URL}/products/fang-mansion-bracelet"},
    {"title":"Xin Mansion · 心 — Garnet Bracelet | Chinese Star Map","desc":"The fifth mansion. Deep red garnet beads. The beating heart of the Azure Dragon. For passion and the fire to pursue what matters.","img":f"{IMAGE_BASE}/pin28-xin.png","link":f"{BASE_URL}/products/xin-mansion-bracelet"},
    {"title":"Wei Mansion · 尾 — Blue Howlite Bracelet | Celestial Jewelry","desc":"The sixth mansion. Gradient blue howlite beads. The sweeping tail across the sky. For leaving your mark.","img":f"{IMAGE_BASE}/pin28-wei.png","link":f"{BASE_URL}/products/wei-mansion-bracelet"},
    {"title":"Ji Mansion · 箕 — Citrine Bracelet | Chinese Constellation","desc":"The seventh mansion of the Azure Dragon. Golden citrine beads. The winnowing basket — for knowing what to keep and what to release.","img":f"{IMAGE_BASE}/pin28-ji.png","link":f"{BASE_URL}/products/ji-mansion-bracelet"},
    # Vermillion Bird (7 mansions)
    {"title":"Jing Mansion · 井 — Aquamarine Bracelet | 28 Mansions","desc":"First mansion of the Vermillion Bird. Pale aquamarine beads with gold spacers. A deep well of wisdom from the southern sky.","img":f"{IMAGE_BASE}/pin28-jing.png","link":f"{BASE_URL}/products/jing-mansion-bracelet"},
    {"title":"Gui Mansion · 鬼 — Smoky Quartz Bracelet | Chinese Astrology","desc":"Second mansion of the southern sky. Smoky quartz beads. The ancestors walk here. Honor the past.","img":f"{IMAGE_BASE}/pin28-gui.png","link":f"{BASE_URL}/products/gui-mansion-bracelet"},
    {"title":"Liu Mansion · 柳 — Aventurine Bracelet | Celestial Jewelry","desc":"Third mansion. Green aventurine beads. The willow bends but never breaks. Resilience.","img":f"{IMAGE_BASE}/pin28-liu.png","link":f"{BASE_URL}/products/liu-mansion-bracelet"},
    {"title":"Xing Mansion · 星 — Clear Quartz Bracelet | Star Map Jewelry","desc":"Fourth mansion. Clear crystal quartz beads with gold star spacers. A single bright star in the southern sky. For those destined to shine.","img":f"{IMAGE_BASE}/pin28-xing.png","link":f"{BASE_URL}/products/xing-mansion-bracelet"},
    {"title":"Zhang Mansion · 张 — Turquoise Bracelet | Chinese Constellation","desc":"Fifth mansion. Turquoise beads with gold spacers. The extended net that catches abundance.","img":f"{IMAGE_BASE}/pin28-zhang.png","link":f"{BASE_URL}/products/zhang-mansion-bracelet"},
    {"title":"Yi Mansion · 翼 — Howlite Bracelet | 28 Lunar Mansions","desc":"Sixth mansion. White howlite beads. The outspread wings. For those ready to soar.","img":f"{IMAGE_BASE}/pin28-yi.png","link":f"{BASE_URL}/products/yi-mansion-bracelet"},
    {"title":"Zhen Mansion · 轸 — Onyx Bracelet | Chinese Astronomy","desc":"Seventh mansion. Black onyx beads. The chariot that carries you through. Strength in motion.","img":f"{IMAGE_BASE}/pin28-zhen.png","link":f"{BASE_URL}/products/zhen-mansion-bracelet"},
    # White Tiger (7 mansions)
    {"title":"Kui Mansion · 奎 — Moonstone Bracelet | Celestial Jewelry","desc":"First mansion of the White Tiger. White moonstone beads with blue flash. The first step forward. New journeys.","img":f"{IMAGE_BASE}/pin28-kui.png","link":f"{BASE_URL}/products/kui-mansion-bracelet"},
    {"title":"Lou Mansion · 娄 — Hematite Bracelet | 28 Mansions","desc":"Second mansion. Hematite beads with gold spacers. The bonds we choose. For sacred commitments.","img":f"{IMAGE_BASE}/pin28-lou.png","link":f"{BASE_URL}/products/lou-mansion-bracelet"},
    {"title":"Wei Mansion · 胃 — Yellow Jade Bracelet | Star Map Jewelry","desc":"Third mansion. Yellow jade beads. The granary of heaven. Nourishment and abundance.","img":f"{IMAGE_BASE}/pin28-wei2.png","link":f"{BASE_URL}/products/wei-stomach-mansion-bracelet"},
    {"title":"Mao Mansion · 昴 — Chalcedony Bracelet | Chinese Constellation","desc":"Fourth mansion. Pale blue chalcedony beads. The Pleiades cluster. For star-seekers.","img":f"{IMAGE_BASE}/pin28-mao.png","link":f"{BASE_URL}/products/mao-mansion-bracelet"},
    {"title":"Bi Mansion · 毕 — Carnelian Bracelet | 28 Lunar Mansions","desc":"Fifth mansion. Dark carnelian beads. The hunter's net. Precision and patience.","img":f"{IMAGE_BASE}/pin28-bi.png","link":f"{BASE_URL}/products/bi-net-mansion-bracelet"},
    {"title":"Zi Mansion · 觜 — Moss Agate Bracelet | Celestial Jewelry","desc":"Sixth mansion. Moss agate beads. The snapping point. Decisive action.","img":f"{IMAGE_BASE}/pin28-zi.png","link":f"{BASE_URL}/products/zi-mansion-bracelet"},
    {"title":"Shen Mansion · 参 — Labradorite Bracelet | Chinese Astronomy","desc":"Seventh mansion. Labradorite beads with blue-green fire. Orion's belt. Triple protection.","img":f"{IMAGE_BASE}/pin28-shen.png","link":f"{BASE_URL}/products/shen-mansion-bracelet"},
    # Black Tortoise (7 mansions)
    {"title":"Dou Mansion · 斗 — Sodalite Bracelet | 28 Mansions","desc":"First mansion of the Black Tortoise. Dark navy sodalite beads. The measuring cup of fate. For those who pour themselves fully.","img":f"{IMAGE_BASE}/pin28-dou.png","link":f"{BASE_URL}/products/dou-mansion-bracelet"},
    {"title":"Niu Mansion · 牛 — Tiger Eye Bracelet | Chinese Astrology","desc":"Second mansion. Brown tiger eye beads. The patient strength of the ox. Endurance.","img":f"{IMAGE_BASE}/pin28-niu.png","link":f"{BASE_URL}/products/niu-mansion-bracelet"},
    {"title":"Nv Mansion · 女 — Rose Quartz Bracelet | Celestial Jewelry","desc":"Third mansion. Soft pink rose quartz beads with rose gold heart spacers. Divine feminine. Soft power.","img":f"{IMAGE_BASE}/pin28-nv.png","link":f"{BASE_URL}/products/nv-mansion-bracelet"},
    {"title":"Xu Mansion · 虚 — Clear Crystal Bracelet | 28 Lunar Mansions","desc":"Fourth mansion. Clear crystal beads. The void from which all things emerge. For minimalists.","img":f"{IMAGE_BASE}/pin28-xu.png","link":f"{BASE_URL}/products/xu-mansion-bracelet"},
    {"title":"Wei Mansion · 危 — Black Agate Bracelet | Chinese Constellation","desc":"Fifth mansion. Black agate beads. Standing on the peak. For those who climbed.","img":f"{IMAGE_BASE}/pin28-wei3.png","link":f"{BASE_URL}/products/wei-rooftop-mansion-bracelet"},
    {"title":"Shi Mansion · 室 — Labradorite Bracelet | Celestial Jewelry","desc":"Sixth mansion. Grey labradorite beads. The encampment where warriors rest. Build your sanctuary.","img":f"{IMAGE_BASE}/pin28-shi.png","link":f"{BASE_URL}/products/shi-mansion-bracelet"},
    {"title":"Bi Mansion · 壁 — White Jade Bracelet | 28 Mansions","desc":"Seventh mansion. White jade beads. The fortress wall. For boundaries and protection.","img":f"{IMAGE_BASE}/pin28-bi2.png","link":f"{BASE_URL}/products/bi-wall-mansion-bracelet"},
]

def publish():
    if BOARD_ID == "YOUR_BOARD_ID":
        print("ERROR: Set BOARD_ID first!")
        print("Get it from: https://api.pinterest.com/v5/boards?access_token=YOUR_TOKEN")
        return

    headers = {"Authorization": f"Bearer {TOKEN}", "Content-Type": "application/json"}
    count = 0
    for i, pin in enumerate(pins):
        print(f"[{i+1}/28] {pin['title'][:50]}...")
        data = {
            "title": pin["title"],
            "description": pin["desc"],
            "link": pin["link"],
            "board_id": BOARD_ID,
            "media_source": {
                "source_type": "image_url",
                "url": pin["img"]
            }
        }
        try:
            r = requests.post("https://api.pinterest.com/v5/pins", headers=headers, json=data, timeout=20)
            if r.status_code == 201:
                print(f"  ✅ Published: {r.json().get('id','')}")
                count += 1
            elif r.status_code == 429:
                print(f"  ⏳ Rate limited, waiting 60s...")
                time.sleep(60)
                r = requests.post("https://api.pinterest.com/v5/pins", headers=headers, json=data, timeout=20)
                if r.status_code == 201:
                    print(f"  ✅ Published after retry")
                    count += 1
                else:
                    print(f"  ❌ {r.status_code}: {r.text[:150]}")
            else:
                print(f"  ❌ {r.status_code}: {r.text[:150]}")
        except Exception as e:
            print(f"  ⚡ Error: {e}")

        if i < len(pins) - 1:
            time.sleep(35)  # ~3 pins per 2 minutes to stay safe

    print(f"\n🎉 Done! {count}/{len(pins)} pins published.")

if __name__ == "__main__":
    publish()
