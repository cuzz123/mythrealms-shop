#!/usr/bin/env python3
"""
MythRealms Luxury Rebrand — Regenerate all 73 product images
Style: Abstract European luxury jewelry with gemstones, marble backgrounds, soft natural light
"""

import requests, time, os

os.environ.pop('http_proxy', None); os.environ.pop('https_proxy', None)
os.environ.pop('HTTP_PROXY', None); os.environ.pop('HTTPS_PROXY', None)

API_KEY = 'sk-N6xBOlG5L3XFU7blmlkdOSGawJo6D6kUpNcMd6QqbNHxDbDx'
BASE = 'https://apihub.agnes-ai.com/v1'
H = {'Authorization': f'Bearer {API_KEY}', 'Content-Type': 'application/json'}
OUT = '/mnt/d/mythrealms-shop/public/images/products'

PHOTO = ('product photography, 1:1, pristine white marble background, soft diffused natural window light, '
         'european luxury jewelry editorial, sharp focus, shallow depth of field, '
         'professional jewelry catalog, Cartier Van Cleef Bvlgari aesthetic, no model, product only')

def gen(name, prompt):
    full = f'{prompt}, {PHOTO}'
    for attempt in range(3):
        try:
            r = requests.post(f'{BASE}/images/generations', headers=H, json={
                'model': 'agnes-image-2.1-flash', 'prompt': full, 'n': 1, 'size': '1024x1024'
            }, timeout=60)
        except Exception as e:
            print(f'   ⚡ {e}'); time.sleep(5); continue
        if r.status_code == 429:
            print(f'   ⏳ rate limit, wait {30*(attempt+1)}s'); time.sleep(30*(attempt+1)); continue
        if r.status_code != 200:
            print(f'   ❌ {r.status_code}: {r.text[:120]}'); time.sleep(5); continue
        try:
            url = r.json()['data'][0]['url']
            img = requests.get(url, timeout=30).content
            path = os.path.join(OUT, f'{name}.png')
            with open(path, 'wb') as f: f.write(img)
            print(f'   ✅ {len(img)//1024}KB -> {name}.png')
            return
        except Exception as e:
            print(f'   ❌ download: {e}'); return
    print(f'   ❌ failed after 3 attempts')

# ============================================================
# 1. 10 BEAST PENDANTS — abstract luxury symbols
# ============================================================
print('='*60)
print('PHASE 1: Beast Pendants → Abstract Luxury')
print('='*60)

beasts = [
    ('nine-tailed-fox-pendant', 'nine-tailed-fox-pendant',
     '14k yellow gold necklace, nine sweeping arc motif in polished gold pavé set with tiny round diamonds, '
     'each arc representing a fox tail in fluid motion, delicate cable chain, '
     'the design whispers ancient wisdom rather than shouting it, warm gold tones'),

    ('qilin-protection-bracelet', 'qilin-protection-bracelet',
     'jade and 14k gold bangle bracelet, subtle wave-shaped cloud engraving on the jade segment, '
     'single brilliant-cut emerald at the clasp, the qilin horn abstracted into a gentle curve, '
     'matte gold finish with polished edges, imperial green jade'),

    ('azure-dragon-ring', 'azure-dragon-ring',
     'sterling silver statement ring, embossed dragon scale texture wrapping the entire band, '
     'deep blue oval sapphire center stone 5 carats, claw setting in white gold, '
     'the scale pattern catches light differently at every angle, powerful and refined'),

    ('phoenix-rebirth-necklace', 'phoenix-rebirth-necklace',
     '18k rose gold pendant, abstract wing shape formed by three sweeping curves, '
     'graduated fire opals decreasing in size along the curve, tiny diamond melee border, '
     'the wing appears to be mid-ascent, warm rose gold against white marble'),

    ('white-tiger-guardian-cuff', 'white-tiger-guardian-cuff',
     'wide sterling silver cuff bracelet, engraved subtle stripe pattern inspired by tiger markings, '
     'two pear-cut white diamonds at the center, brushed matte silver finish, '
     'masculine structure with feminine refinement, bold architectural design'),

    ('black-tortoise-endurance-bracelet', 'black-tortoise-endurance-bracelet',
     'black onyx and 14k white gold link bracelet, hexagonal tortoise shell pattern in onyx segments, '
     'each hexagon framed in white gold, single bezel-set diamond accent, '
     'dark and protective yet luminous, deep polished black'),

    ('bai-ze-wisdom-talisman', 'bai-ze-wisdom-talisman',
     '14k yellow gold medallion pendant, concentric circles with ancient script engraving on inner ring, '
     'tiny round diamond at center radiating outward, the all-seeing eye abstracted to pure geometry, '
     'antiqued gold patina in the engravings, warm light catching the texture'),

    ('kun-peng-transformation-set', 'kun-peng-transformation-set',
     'two interlocking 14k gold rings, one brushed matte representing the deep ocean Kun, '
     'one high-polish representing the sky-bound Peng, the rings twist apart to wear separately, '
     'gradient from matte to mirror finish, the moment of transformation captured in metal'),

    ('four-symbols-complete-collection', 'four-symbols-complete-collection',
     'four stacking rings in mixed metals, one each in yellow gold rose gold white gold and sterling silver, '
     'each ring with a different micro-engraved texture dragon scale feather stripe turtle shell, '
     'four tiny colored gemstones azure sapphire ruby diamond black onyx, worn together or separately'),

    ('28-mansions-star-map-scroll', '28-mansions-star-map-scroll',
     'luxury silk wall scroll with hand-painted gold constellation map, 28 stars in gold leaf on midnight navy silk, '
     'mounted on two polished ebony wood rollers with brass end caps, '
     'museum-grade decorative art piece, soft gallery lighting'),
]

for title, slug, prompt in beasts:
    print(f'\n🔮 {title}')
    gen(slug, prompt)
    time.sleep(2)

# ============================================================
# 2. 5 ELEMENTS — precious stone bracelets
# ============================================================
print('\n'+'='*60)
print('PHASE 2: 5 Elements → Gemstone Bracelets')
print('='*60)

elements = [
    ('wood-element-bracelet', 'wood-element-bracelet',
     'green jade and yellow gold beaded bracelet, alternating jade beads with gold spacer beads, '
     'small leaf-shaped gold charm in polished 14k, vibrant imperial green jade, '
     'fresh and organic luxury, the color of new spring growth'),
    ('fire-element-bracelet', 'fire-element-bracelet',
     'deep red garnet and rose gold beaded bracelet, faceted garnet rondelles, '
     'tiny flame-shaped rose gold charm, the deep wine red of passion and transformation'),
    ('earth-element-bracelet', 'earth-element-bracelet',
     'golden tiger eye and yellow gold beaded bracelet, chatoyant tiger eye cabochon center bead, '
     'square earth-symbol charm in matte gold, warm amber and honey tones'),
    ('metal-element-bracelet', 'metal-element-bracelet',
     'white moonstone and sterling silver beaded bracelet, blue flash moonstone beads, '
     'circular coin charm in polished silver, cool ethereal glow, minimalist precision'),
    ('water-element-bracelet', 'water-element-bracelet',
     'deep blue lapis lazuli and white gold beaded bracelet, lapis with natural gold pyrite flecks, '
     'flowing wave charm in white gold, the deep mysterious blue of the ocean'),
]

for title, slug, prompt in elements:
    print(f'\n💎 {title}')
    gen(slug, prompt)
    time.sleep(2)

# ============================================================
# 3. 28 MANSIONS — luxury star bracelets (condensed to 28)
# ============================================================
print('\n'+'='*60)
print('PHASE 3: 28 Mansions → Luxury Star Bracelets')
print('='*60)

mansions = [
    # Azure Dragon
    ('jiao-mansion-bracelet', 'lapis lazuli and silver bracelet, horn-shaped silver charm, tiny diamond star accent'),
    ('kang-mansion-bracelet', 'golden tiger eye and gold bracelet, dragon scale textured charm, warm amber glow'),
    ('di-mansion-bracelet', 'brown agate and rose gold bracelet, tree root charm in polished rose gold'),
    ('fang-mansion-bracelet', 'amethyst and silver bracelet, house-shaped pavé diamond charm, regal purple'),
    ('xin-mansion-bracelet', 'deep red garnet and gold bracelet, heart-shaped ruby charm, passionate crimson'),
    ('wei-mansion-bracelet', 'blue howlite and silver bracelet, sweeping curved tail charm, gradient blue-to-white'),
    ('ji-mansion-bracelet', 'golden citrine and gold bracelet, woven basket charm, harvest gold sparkle'),
    # Vermillion Bird
    ('jing-mansion-bracelet', 'aquamarine and white gold bracelet, water well charm with diamond drop'),
    ('gui-mansion-bracelet', 'smoky quartz and silver bracelet, spirit guardian charm, mysterious grey-violet'),
    ('liu-mansion-bracelet', 'green aventurine and gold bracelet, willow leaf charm, soft spring green'),
    ('xing-mansion-bracelet', 'clear quartz and silver bracelet, multi-pointed star charm with diamond center'),
    ('zhang-mansion-bracelet', 'turquoise and silver bracelet, woven net pattern charm, southwestern sky blue'),
    ('yi-mansion-bracelet', 'white howlite and gold bracelet, spread wing charm in polished gold'),
    ('zhen-mansion-bracelet', 'black onyx and silver bracelet, chariot wheel charm, dark dramatic contrast'),
    # White Tiger
    ('kui-mansion-bracelet', 'white moonstone and silver bracelet, striding legs charm, pearlescent glow'),
    ('lou-mansion-bracelet', 'hematite and silver bracelet, chain bond charm, dark metallic strength'),
    ('wei-stomach-mansion-bracelet', 'yellow jade and gold bracelet, granary charm, warm nourishing gold'),
    ('mao-mansion-bracelet', 'pale blue chalcedony and silver bracelet, star cluster charm with diamond dust'),
    ('bi-net-mansion-bracelet', 'dark carnelian and gold bracelet, hunting net charm, deep amber-red'),
    ('zi-mansion-bracelet', 'moss agate and silver bracelet, beak charm, earthy green-brown'),
    ('shen-mansion-bracelet', 'labradorite and silver bracelet, three star charms, blue-green flash'),
    # Black Tortoise
    ('dou-mansion-bracelet', 'dark sodalite and silver bracelet, dipper ladle charm, deep navy'),
    ('niu-mansion-bracelet', 'brown tiger eye and gold bracelet, ox charm, sturdy warm strength'),
    ('nv-mansion-bracelet', 'rose quartz and rose gold bracelet, feminine figure charm, soft pink romance'),
    ('xu-mansion-bracelet', 'clear crystal and silver bracelet, void circle charm, pure minimalist zen'),
    ('wei-rooftop-mansion-bracelet', 'black agate and silver bracelet, rooftop peak charm, dark protective'),
    ('shi-mansion-bracelet', 'grey labradorite and silver bracelet, tent encampment charm, blue-grey flash'),
    ('bi-wall-mansion-bracelet', 'white jade and silver bracelet, fortress wall charm, pure white fortification'),
]

for slug, detail in mansions:
    print(f'\n⭐ {slug}')
    description = detail.split(', bracelet, ')[0] if ', bracelet, ' in detail else detail
    charm_desc = detail.split('bracelet, ')[1] if ', bracelet, ' in detail else detail
    prompt = (f'{description} beaded bracelet with {charm_desc}, '
              f'8mm round beads on elastic cord, luxury gemstone jewelry, fine craftsmanship')
    gen(slug, prompt)
    time.sleep(2)

# ============================================================
# 4. FOUR SEASONS — luxury seasonal jewelry
# ============================================================
print('\n'+'='*60)
print('PHASE 4: Four Seasons → Luxury Seasonal Collection')
print('='*60)

seasons = [
    ('spring-cherry-necklace', 'rose gold necklace with pink sapphire cherry blossom pendant, five pear-cut pink sapphire petals around a round diamond center, delicate cable chain, spring renewal luxury'),
    ('spring-plum-earrings', 'silver drop earrings with ruby plum blossom design, five tiny round rubies forming each flower, french wire hooks, early spring elegance'),
    ('spring-green-bracelet', 'green jade and gold bangle with sprouting leaf motif, three small emerald leaves on polished gold bangle, vibrant new growth'),
    ('summer-lotus-pendant', 'white gold lotus pendant with layered petals in mother of pearl and diamond, yellow sapphire center, the bloom floating on a fine chain, summer serenity'),
    ('summer-dragonfly-brooch', 'diamond and blue sapphire dragonfly brooch, filigree wings in white gold with diamond dust, two oval sapphire eyes, summer lightness'),
    ('summer-sun-ring', 'yellow gold sunburst ring with citrine center surrounded by diamond rays, bold statement cocktail ring, golden hour captured in jewelry'),
    ('autumn-maple-pendant', 'rose gold maple leaf pendant pavé set with cognac diamonds and orange sapphires, autumn gradient from warm to deep amber, fine chain'),
    ('autumn-moon-earrings', 'matte gold crescent moon drop earrings with smoky quartz cabochons, harvest moon warmth, elegant elongated silhouette'),
    ('autumn-chrysanthemum-ring', 'yellow gold chrysanthemum ring with layered petals, champagne diamond center, intricate imperial garden design, fall nobility'),
    ('winter-snowflake-pendant', 'white gold snowflake pendant with exceptionally brilliant round diamonds, intricate hexagonal ice crystal pattern, sparkling on fine chain, pure winter magic'),
    ('winter-pine-bracelet', 'dark green emerald and platinum bracelet, frosted pine needle texture on platinum links, deep winter green, resilient elegance'),
    ('winter-crane-brooch', 'white gold and diamond crane brooch, red coral crown detail, the crane in elegant flight pose, museum-quality artistry'),
]

for slug, prompt in seasons:
    print(f'\n🌸 {slug}')
    gen(slug, prompt)
    time.sleep(2)

# ============================================================
# 5. TWELVE ZODIAC — luxury zodiac medallions
# ============================================================
print('\n'+'='*60)
print('PHASE 5: 12 Zodiac → Luxury Medallion Pendants')
print('='*60)

zodiacs = [
    ('zodiac-rat-amulet', '14k yellow gold zodiac medallion, abstract mouse design in polished gold relief on satin-finished disc, tiny diamond eye, elegant and clever, fine chain'),
    ('zodiac-ox-amulet', '14k yellow gold medallion, powerful ox horns abstracted to two sweeping gold arcs, diamond accent between horns, bold and dignified'),
    ('zodiac-tiger-amulet', '14k gold and black rhodium medallion, tiger stripes in contrasting dark rhodium on gold disc, two tiny emerald eyes, fierce yet refined'),
    ('zodiac-rabbit-amulet', 'rose gold zodiac medallion, gentle rabbit ear silhouette in polished relief, moonstone crescent accent, delicate and luminous'),
    ('zodiac-dragon-amulet', '14k yellow gold medallion, imperial dragon coiled in high relief with micro-pavé ruby eye, the most intricate of the collection, majestic'),
    ('zodiac-snake-amulet', 'white gold medallion, serpent coiled in polished relief with sapphire eye, the snake body forming an elegant figure-eight, mysterious wisdom'),
    ('zodiac-horse-amulet', 'yellow gold medallion, galloping horse in dynamic high relief, wind-swept mane with diamond dust, captured motion and freedom'),
    ('zodiac-goat-amulet', 'rose gold medallion, peaceful goat with curved horns in satin finish, tiny pearl accent, serene and artistic'),
    ('zodiac-monkey-amulet', 'yellow gold medallion, playful monkey holding a peach-shaped coral cabochon, clever design with movement and wit'),
    ('zodiac-rooster-amulet', 'yellow gold medallion, proud rooster with detailed feather crown in polished relief, citrine sun accent behind, confident and radiant'),
    ('zodiac-dog-amulet', 'white gold medallion, loyal dog in protective stance, single diamond on the collar, faithful guardian in clean lines'),
    ('zodiac-pig-amulet', 'rose gold medallion, content pig with prosperity symbols, pink tourmaline accent, warm abundance and joy'),
]

for slug, prompt in zodiacs:
    print(f'\n🏅 {slug}')
    gen(slug, prompt)
    time.sleep(2)

# ============================================================
# 6. ARTIST COLLABS — gallery luxury pieces
# ============================================================
print('\n'+'='*60)
print('PHASE 6: Artist Collaborations → Gallery Luxury')
print('='*60)

collabs = [
    ('artist-collab-inkwash-dragon', 'artist-collab-inkwash-dragon',
     'contemporary gallery jewelry, deconstructed dragon silhouette in brushed white gold with intentional patina, '
     'abstract ink splash texture achieved through dark rhodium plating, single raw diamond embedded in the chaos, '
     'avant-garde luxury, museum showcase lighting, limited edition art jewelry'),
    ('artist-collab-bronze-beast', 'artist-collab-bronze-beast',
     'brutalist luxury ring in raw textured 18k gold with deliberate hammer marks, '
     'taotie face barely visible in the abstract geometric facets, single baguette-cut diamond embedded in the surface, '
     'industrial gallery aesthetic, primitive meets precious, statement art piece'),
    ('artist-collab-porcelain-phoenix', 'artist-collab-porcelain-phoenix',
     'fine porcelain and 18k gold earrings, white porcelain discs with hand-painted cobalt blue phoenix feather in Ming dynasty style, '
     'suspended from gold drops, delicate crazing in the glaze, museum artifact reimagined for the body, '
     'blue and white porcelain luxury'),
    ('artist-collab-jade-minimal', 'artist-collab-jade-minimal',
     'single piece of raw uncut Burmese jadeite with one polished window revealing intense emerald green, '
     'set in a minimalist platinum cage, wabi-sabi philosophy meets imperial luxury, '
     'the contrast of rough and refined, one-of-a-kind collector piece'),
]

for title, slug, prompt in collabs:
    print(f'\n🎨 {title}')
    gen(slug, prompt)
    time.sleep(2)

print('\n'+'='*60)
print('🎉 ALL 73 PRODUCTS REGENERATED — LUXURY EDITION')
print(f'Output: {OUT}/')
print('='*60)
