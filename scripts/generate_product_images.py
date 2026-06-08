#!/usr/bin/env python3
"""
MythRealms Product Image Generator via Agnes AI API
Generates product + category images for the full product strategy:
  1. Category banner images
  2. 28 Mansions star bracelets
  3. 5 Element stone bracelets
  4. 12 Four Seasons jewelry
  5. 12 Zodiac pendants
  6. 4 Artist collaboration pieces
"""

import requests, time, os, json, sys

# --- Bypass proxy (direct connection) ---
os.environ.pop('http_proxy', None)
os.environ.pop('https_proxy', None)
os.environ.pop('HTTP_PROXY', None)
os.environ.pop('HTTPS_PROXY', None)
os.environ.pop('no_proxy', None)
os.environ.pop('NO_PROXY', None)

API_KEY = 'sk-N6xBOlG5L3XFU7blmlkdOSGawJo6D6kUpNcMd6QqbNHxDbDx'
BASE_URL = 'https://apihub.agnes-ai.com/v1'
HEADERS = {'Authorization': f'Bearer {API_KEY}', 'Content-Type': 'application/json'}
OUT_DIR = '/mnt/d/mythrealms-shop/public/images/products'
CAT_DIR = '/mnt/d/mythrealms-shop/public/images/categories'

os.makedirs(OUT_DIR, exist_ok=True)
os.makedirs(CAT_DIR, exist_ok=True)

# ============================================================
# Image generation function
# ============================================================
def generate_image(name, prompt, ref_img=None, retries=3):
    """Generate a single image via Agnes API. Returns True on success."""
    payload = {
        'model': 'agnes-image-2.1-flash' if not ref_img else 'agnes-image-2.0-flash',
        'prompt': prompt,
        'n': 1,
        'size': '1024x1024',
    }
    if ref_img:
        payload['image'] = ref_img
        payload['tags'] = ['img2img']

    for attempt in range(retries):
        try:
            r = requests.post(
                f'{BASE_URL}/images/generations',
                headers=HEADERS,
                json=payload,
                timeout=60
            )
        except Exception as e:
            print(f'   ⚡ Network error (attempt {attempt+1}): {e}')
            time.sleep(5)
            continue

        if r.status_code == 429:
            wait = 30 * (attempt + 1)
            print(f'   ⏳ Rate limited, waiting {wait}s...')
            time.sleep(wait)
            continue

        if r.status_code != 200:
            print(f'   ❌ HTTP {r.status_code}: {r.text[:150]}')
            time.sleep(5)
            continue

        try:
            data = r.json()
            url = data.get('data', [{}])[0].get('url', '')
            if not url:
                print(f'   ❌ No URL in response: {json.dumps(data)[:200]}')
                return False
        except Exception:
            print(f'   ❌ Parse error: {r.text[:150]}')
            return False

        # Download
        try:
            img_data = requests.get(url, timeout=30).content
            path = os.path.join(OUT_DIR, f'{name}.png')
            with open(path, 'wb') as f:
                f.write(img_data)
            print(f'   ✅ {len(img_data)//1024}KB -> {name}.png')
            return True
        except Exception as e:
            print(f'   ❌ Download error: {e}')
            return False

    print(f'   ❌ Failed after {retries} attempts')
    return False


def generate_category_image(name, prompt):
    """Generate a category banner image."""
    payload = {
        'model': 'agnes-image-2.1-flash',
        'prompt': prompt,
        'n': 1,
        'size': '1024x1024',
    }
    for attempt in range(3):
        try:
            r = requests.post(f'{BASE_URL}/images/generations', headers=HEADERS, json=payload, timeout=60)
        except Exception as e:
            print(f'   ⚡ Network error: {e}')
            time.sleep(5)
            continue
        if r.status_code == 429:
            time.sleep(30 * (attempt + 1))
            continue
        if r.status_code != 200:
            print(f'   ❌ HTTP {r.status_code}: {r.text[:120]}')
            time.sleep(5)
            continue
        try:
            url = r.json()['data'][0]['url']
        except:
            print(f'   ❌ Parse: {r.text[:120]}')
            return False
        try:
            img_data = requests.get(url, timeout=30).content
            path = os.path.join(CAT_DIR, f'{name}.png')
            with open(path, 'wb') as f:
                f.write(img_data)
            print(f'   ✅ {len(img_data)//1024}KB -> categories/{name}.png')
            return True
        except Exception as e:
            print(f'   ❌ Download: {e}')
            return False
    return False


# ============================================================
# 1. CATEGORY BANNER IMAGES (missing categories)
# ============================================================
print('=' * 60)
print('📂 PHASE 1: Category Banner Images')
print('=' * 60)

category_prompts = {
    '28-mansions-bracelets': (
        '28 different beaded bracelets arranged in a celestial circle on black velvet, '
        'each bracelet a different crystal color representing a Chinese lunar mansion, '
        'golden constellation lines connecting them, dark atmospheric lighting, '
        'luxury jewelry catalog photography, 1:1, professional product shot'
    ),
    'five-elements-stones': (
        'five beaded bracelets in a row, representing the Chinese Wu Xing: wood (green jade), '
        'fire (red agate), earth (yellow tiger eye), metal (white moonstone), water (black obsidian), '
        'arranged on dark wooden surface with subtle elemental symbols carved beneath, '
        'dramatic side lighting, luxury editorial photography, 1:1'
    ),
    'four-seasons-collection': (
        'four jewelry sets representing the four seasons: spring cherry blossom pendant, '
        'summer lotus bracelet, autumn maple leaf earrings, winter snowflake ring, '
        'displayed on a circular dark lacquer tray with seasonal transitions, '
        'soft four-direction lighting, luxury product photography, 1:1'
    ),
    'zodiac-amulets': (
        'twelve Chinese zodiac animal pendants arranged in a circular bronze tray, '
        'each animal in miniature silver: rat ox tiger rabbit dragon snake horse goat monkey rooster dog pig, '
        'ancient Chinese calendar wheel design beneath, warm bronze lighting, '
        'museum artifact photography style, 1:1, highly detailed'
    ),
    'artist-collab-series': (
        'avant-garde mythical beast jewelry on raw concrete, abstract ink wash paintings behind, '
        'deconstructed traditional Chinese elements reimagined as modern minimalist jewelry, '
        'gallery lighting, high fashion editorial, creative direction, 1:1'
    ),
}

for slug, prompt in category_prompts.items():
    print(f'\n🎨 Category: {slug}')
    generate_category_image(slug, prompt)
    time.sleep(2)

# ============================================================
# 2. 28 MANSIONS STAR BRACELETS (二十八宿手串)
# ============================================================
print('\n' + '=' * 60)
print('📿 PHASE 2: 28 Mansions Star Bracelets')
print('=' * 60)

# Azure Dragon mansions (东方青龙七宿)
dragon_mansions = [
    ('jiao-mansion-bracelet', 'Jiao (角) Horn mansion bracelet, deep blue lapis lazuli beads with silver horn-shaped charm, first of 28 Chinese lunar mansions, constellation engraving on bead, dark cosmic background, luxury bracelet photography, 1:1'),
    ('kang-mansion-bracelet', 'Kang (亢) Neck mansion bracelet, golden tiger eye stone beads with bronze neck/dragon charm, warm amber tones, ancient star map beneath, second mansion of Azure Dragon, refined jewelry photography, 1:1'),
    ('di-mansion-bracelet', 'Di (氐) Root mansion bracelet, earthy brown agate beads with silver root/tree charm, grounding energy, third mansion of Azure Dragon, natural stone texture visible, dark moody lighting, 1:1'),
    ('fang-mansion-bracelet', 'Fang (房) Room mansion bracelet, amethyst purple crystal beads with miniature silver house charm, fourth mansion of Azure Dragon, soft purple glow, mystical celestial photography, 1:1'),
    ('xin-mansion-bracelet', 'Xin (心) Heart mansion bracelet, deep red garnet beads with silver heart-shaped charm, fifth mansion representing the heart of the Azure Dragon, warm passionate tones, dramatic spotlight, 1:1'),
    ('wei-mansion-bracelet', 'Wei (尾) Tail mansion bracelet, gradient blue-to-white howlite beads representing the dragon tail, sixth mansion, fluid curved silver charm, ethereal misty atmosphere, 1:1'),
    ('ji-mansion-bracelet', 'Ji (箕) Winnowing basket mansion bracelet, golden citrine beads with woven silver basket charm, seventh mansion of Azure Dragon, harvest golden tones, warm sunlight glow, 1:1'),
]

# Vermillion Bird mansions (南方朱雀七宿)
bird_mansions = [
    ('jing-mansion-bracelet', 'Jing (井) Well mansion bracelet, deep aquamarine beads with silver well/water charm, first mansion of Vermillion Bird, water ripple patterns, cool blue tones, refreshing crystal photography, 1:1'),
    ('gui-mansion-bracelet', 'Gui (鬼) Ghost mansion bracelet, smoky quartz beads with subtle silver ghost/spirit charm, second mansion, mysterious purple-black tones, supernatural atmosphere, dramatic shadow lighting, 1:1'),
    ('liu-mansion-bracelet', 'Liu (柳) Willow mansion bracelet, green aventurine beads with silver willow leaf charm, third mansion, flowing organic shape, spring green energy, soft natural light, 1:1'),
    ('xing-mansion-bracelet', 'Xing (星) Star mansion bracelet, sparkling clear quartz crystal beads with multi-pointed silver star charm, fourth mansion, glittering starlight reflections, cosmic background, 1:1'),
    ('zhang-mansion-bracelet', 'Zhang (张) Extended net mansion bracelet, web-patterned silver charm with turquoise beads, fifth mansion, intricate net/crosshatch design, southwestern turquoise blue, 1:1'),
    ('yi-mansion-bracelet', 'Yi (翼) Wing mansion bracelet, white howlite beads with detailed silver wing charm spread open, sixth mansion of Vermillion Bird, feather texture, light airy atmosphere, 1:1'),
    ('zhen-mansion-bracelet', 'Zhen (轸) Chariot mansion bracelet, black onyx beads with miniature silver chariot/wheel charm, seventh mansion, dark powerful energy, dramatic contrast lighting, 1:1'),
]

# White Tiger mansions (西方白虎七宿)
tiger_mansions = [
    ('kui-mansion-bracelet', 'Kui (奎) Legs mansion bracelet, white moonstone beads with silver striding legs charm, first mansion of White Tiger, pearlescent white glow, autumn moonlight photography, 1:1'),
    ('lou-mansion-bracelet', 'Lou (娄) Bond mansion bracelet, hematite metallic beads with silver chain/bond charm, second mansion, industrial strength aesthetic, dark metallic tones, 1:1'),
    ('wei-mansion-bracelet', 'Wei (胃) Stomach mansion bracelet, yellow jade beads with silver granary/stomach charm, third mansion, warm nourishing yellow tones, soft diffuse lighting, 1:1'),
    ('mao-mansion-bracelet', 'Mao (昴) Hairy head mansion bracelet, pale blue chalcedony beads with silver Pleiades star cluster charm, fourth mansion, subtle star pattern, twilight blue atmosphere, 1:1'),
    ('bi-mansion-bracelet', 'Bi (毕) Net mansion bracelet, dark carnelian beads with silver hunting net charm, fifth mansion, deep red-amber tones, dramatic hunting scene vibe, 1:1'),
    ('zi-mansion-bracelet', 'Zi (觜) Turtle beak mansion bracelet, moss agate beads with silver beak/turtle charm, sixth mansion, green-brown earth tones, natural forest floor aesthetic, 1:1'),
    ('shen-mansion-bracelet', 'Shen (参) Three stars mansion bracelet, three connected silver star charms on labradorite beads with blue flash, seventh mansion, Orion belt reference, deep night sky, 1:1'),
]

# Black Tortoise mansions (北方玄武七宿)
tortoise_mansions = [
    ('dou-mansion-bracelet', 'Dou (斗) Dipper mansion bracelet, dark sodalite blue beads with silver dipper/ladle charm, first mansion of Black Tortoise, deep navy tones, northern star reference, 1:1'),
    ('niu-mansion-bracelet', 'Niu (牛) Ox mansion bracelet, brown tiger eye beads with miniature silver ox charm, second mansion, earthy strength, sturdy design aesthetic, 1:1'),
    ('nv-mansion-bracelet', 'Nv (女) Girl mansion bracelet, rose quartz pink beads with delicate silver feminine figure charm, third mansion, soft romantic tones, gentle lighting, 1:1'),
    ('xu-mansion-bracelet', 'Xu (虚) Emptiness mansion bracelet, clear crystal quartz beads with silver void/circle charm, fourth mansion, minimalist zen aesthetic, pure transparent beauty, 1:1'),
    ('wei-mansion-bracelet', 'Wei (危) Rooftop mansion bracelet, black agate beads with silver rooftop/peak charm, fifth mansion, dark protective energy, dramatic angular design, 1:1'),
    ('shi-mansion-bracelet', 'Shi (室) Encampment mansion bracelet, grey labradorite beads with silver tent/camp charm, sixth mansion, blue-grey flash, military precision aesthetic, 1:1'),
    ('bi-mansion-bracelet', 'Bi (壁) Wall mansion bracelet, white jade beads with silver wall/fortification charm, seventh mansion of Black Tortoise, pure white protective energy, fortress strength, 1:1'),
]

all_mansions = dragon_mansions + bird_mansions + tiger_mansions + tortoise_mansions
print(f'  Total: {len(all_mansions)} mansion bracelets\n')

for slug, prompt in all_mansions:
    print(f'📿 {slug}')
    generate_image(slug, prompt)
    time.sleep(2)


# ============================================================
# 3. FIVE ELEMENT STONES (五行石系列)
# ============================================================
print('\n' + '=' * 60)
print('🪨 PHASE 3: Five Element Stone Bracelets')
print('=' * 60)

elements = [
    ('wood-element-bracelet', 'Chinese Wu Xing Wood element bracelet, deep forest green jade beads with intricate wood grain silver charm, symbolizing growth and vitality, bamboo leaves scattered on dark surface, fresh organic photography, 1:1'),
    ('fire-element-bracelet', 'Chinese Wu Xing Fire element bracelet, blazing red carnelian and garnet beads with flame-shaped bronze charm, symbolizing passion and transformation, warm amber glow, dramatic fire-lit photography, 1:1'),
    ('earth-element-bracelet', 'Chinese Wu Xing Earth element bracelet, warm yellow tiger eye and citrine beads with square mountain charm in antiqued silver, symbolizing stability and nourishment, golden harvest light, grounded photography, 1:1'),
    ('metal-element-bracelet', 'Chinese Wu Xing Metal element bracelet, white moonstone and clear quartz beads with circular coin charm in polished silver, symbolizing precision and clarity, cool metallic sheen, clean minimal photography, 1:1'),
    ('water-element-bracelet', 'Chinese Wu Xing Water element bracelet, deep blue sodalite and black obsidian beads with flowing wave charm in dark silver, symbolizing wisdom and adaptability, rippling water reflections, mysterious deep blue photography, 1:1'),
]

for slug, prompt in elements:
    print(f'\n🪨 {slug}')
    generate_image(slug, prompt)
    time.sleep(2)


# ============================================================
# 4. FOUR SEASONS SERIES (四季系列)
# ============================================================
print('\n' + '=' * 60)
print('🌸 PHASE 4: Four Seasons Jewelry Collection')
print('=' * 60)

seasons = [
    # Spring (春) — 3 pieces
    ('spring-cherry-necklace', 'delicate rose gold cherry blossom necklace, pink tourmaline petals with pearl center, spring season jewelry, soft pink and white tones, cherry blossom branches in soft focus background, feminine luxury photography, 1:1'),
    ('spring-plum-earrings', 'plum blossom earrings in polished silver with tiny ruby centers, early spring motif, dangling elegant design, dark background with single plum branch, refined jewelry photography, 1:1'),
    ('spring-green-bracelet', 'spring green jadeite bracelet with sprouting leaf charms in gold, representing new beginnings, fresh morning dew drops on leaves, vibrant renewal energy, bright and airy photography, 1:1'),
    # Summer (夏) — 3 pieces
    ('summer-lotus-pendant', 'white jade lotus flower pendant with gold center stamens, summer bloom motif, floating on dark water surface reflection, elegant serene design, soft rippling light, 1:1'),
    ('summer-dragonfly-brooch', 'dragonfly brooch in iridescent abalone shell and silver wire, summer insect motif, shimmering rainbow reflections, hovering over pond surface, artistic macro photography, 1:1'),
    ('summer-sun-ring', 'bold citrine sunburst ring in warm gold setting, summer solstice motif, radiating sun rays design, bright golden hour warmth, statement jewelry photography, 1:1'),
    # Autumn (秋) — 3 pieces
    ('autumn-maple-pendant', 'oxidized copper maple leaf pendant with garnet dewdrop, autumn foliage motif, rich red-orange patina, scattered autumn leaves on dark wood, warm harvest light, 1:1'),
    ('autumn-moon-earrings', 'crescent moon earrings in matte gold with smoky quartz drops, autumn moon festival motif, harvest moon orange glow, elegant dangling design, moody twilight sky, 1:1'),
    ('autumn-chrysanthemum-ring', 'chrysanthemum ring with layered gold petals and citrine center, autumn flower motif, intricate petal details, warm candlelight reflection, imperial Chinese aesthetic, 1:1'),
    # Winter (冬) — 3 pieces
    ('winter-snowflake-pendant', 'intricate snowflake pendant in white gold with diamond dust finish, winter ice crystal motif, frosted silver chain, sparkling on dark blue velvet, crisp cold photography, 1:1'),
    ('winter-pine-bracelet', 'pine branch bracelet in dark green jade and oxidized silver, winter evergreen motif, frosted pine needles texture, resilience symbolism, snow-dusted dark surface, 1:1'),
    ('winter-crane-brooch', 'red-crowned crane brooch in white jade and red coral, winter bird motif, symbol of longevity, flying pose design, minimalist negative space, zen garden photography, 1:1'),
]

for slug, prompt in seasons:
    print(f'\n🌸 {slug}')
    generate_image(slug, prompt)
    time.sleep(2)


# ============================================================
# 5. TWELVE ZODIAC AMULETS (十二生肖联名)
# ============================================================
print('\n' + '=' * 60)
print('🐀 PHASE 5: Twelve Zodiac Amulets')
print('=' * 60)

zodiacs = [
    ('zodiac-rat-amulet', 'Year of the Rat silver amulet pendant, cute clever mouse design in polished sterling silver, Chinese zodiac charm, dark background with subtle grain motif, luxury amulet photography, 1:1'),
    ('zodiac-ox-amulet', 'Year of the Ox bronze amulet pendant, strong dignified ox design with curved horns, Chinese zodiac charm, warm bronze tones on dark wood, powerful presence, 1:1'),
    ('zodiac-tiger-amulet', 'Year of the Tiger gold-plated amulet pendant, fierce majestic tiger face with stripe details, Chinese zodiac charm, dramatic lighting emphasizing power, regal design, 1:1'),
    ('zodiac-rabbit-amulet', 'Year of the Rabbit silver amulet pendant, elegant gentle rabbit design with moon motif, Chinese zodiac charm, soft moonlight glow, delicate refined aesthetic, 1:1'),
    ('zodiac-dragon-amulet', 'Year of the Dragon gold amulet pendant, imperial five-clawed dragon coiled design, Chinese zodiac charm, intricate scale details, majestic celestial atmosphere, most auspicious sign, 1:1'),
    ('zodiac-snake-amulet', 'Year of the Snake silver amulet pendant, graceful coiled snake with wisdom eye detail, Chinese zodiac charm, mysterious shadow play, ancient wisdom aesthetic, 1:1'),
    ('zodiac-horse-amulet', 'Year of the Horse bronze amulet pendant, galloping horse design with wind-swept mane, Chinese zodiac charm, dynamic motion captured, warm earthy tones, 1:1'),
    ('zodiac-goat-amulet', 'Year of the Goat rose gold amulet pendant, peaceful goat design with curved horns, Chinese zodiac charm, soft gentle lighting, artistic serene composition, 1:1'),
    ('zodiac-monkey-amulet', 'Year of the Monkey silver amulet pendant, clever playful monkey design holding peach, Chinese zodiac charm, mischievous expression, bright engaging photography, 1:1'),
    ('zodiac-rooster-amulet', 'Year of the Rooster gold amulet pendant, proud rooster design with detailed feather crown, Chinese zodiac charm, dawn-lit confident pose, announcing daybreak, 1:1'),
    ('zodiac-dog-amulet', 'Year of the Dog bronze amulet pendant, loyal protective dog design, Chinese zodiac charm, faithful guardian expression, warm companionship feeling, solid design, 1:1'),
    ('zodiac-pig-amulet', 'Year of the Pig rose gold amulet pendant, happy content pig design with wealth symbolism, Chinese zodiac charm, abundant prosperity feeling, warm inviting tones, 1:1'),
]

for slug, prompt in zodiacs:
    print(f'\n🐀 {slug}')
    generate_image(slug, prompt)
    time.sleep(2)


# ============================================================
# 6. ARTIST COLLABORATION SERIES (限量艺术家联名)
# ============================================================
print('\n' + '=' * 60)
print('🎨 PHASE 6: Artist Collaboration Series')
print('=' * 60)

collabs = [
    ('artist-collab-inkwash-dragon', 'deconstructed Azure Dragon pendant in abstract Chinese ink wash style, splattered ink texture on brushed silver, contemporary art jewelry, avant-garde gallery aesthetic, bold negative space, museum lighting, 1:1'),
    ('artist-collab-bronze-beast', 'Taotie beast face ring in raw textured bronze with deliberate imperfections, brutalist jewelry design, ancient bronze casting technique reimagined, industrial gallery setting, dramatic shadow, 1:1'),
    ('artist-collab-porcelain-phoenix', 'Phoenix earrings in white porcelain with cobalt blue underglaze painting, Ming dynasty porcelain aesthetic reimagined as modern jewelry, delicate crackle glaze texture, museum artifact lighting, 1:1'),
    ('artist-collab-jade-minimal', 'minimalist geometric Qilin pendant in single piece of raw uncut jade with one polished facet, wabi-sabi philosophy meets Chinese mythology, organic raw edge, zen garden stone arrangement, meditative photography, 1:1'),
]

for slug, prompt in collabs:
    print(f'\n🎨 {slug}')
    generate_image(slug, prompt)
    time.sleep(2)


# ============================================================
# SUMMARY
# ============================================================
print('\n' + '=' * 60)
print('🎉 ALL PHASES COMPLETE')
print('=' * 60)
print(f'Category images: {CAT_DIR}/')
print(f'Product images:  {OUT_DIR}/')
