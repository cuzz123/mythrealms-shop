// Seed script: Add new product lines (28 Mansions, 5 Elements, 4 Seasons, 12 Zodiac, 4 Artist Collabs)
// Does NOT delete existing data — safe to run on production DB

import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const IMG_BASE = '/images/products'
const CAT_BASE = '/images/categories'

// Image helpers
const P = (name: string) => `${IMG_BASE}/${name}.png`
const C = (name: string) => `${CAT_BASE}/${name}.png`

type ProductSeed = {
  name: string
  slug: string
  description: string
  details: string
  comparePrice: number
  images: string
  stone: string
  material: string
  intention: string
  isFeatured: boolean
  categoryId: string
  variants: Array<{ name: string; price: number; stock: number }>
}

// Mansion names in order
const MANSIONS = {
  dragon: [
    ['jiao', 'Jiao · 角', 'Horn', 'Deep blue lapis lazuli, first mansion of Azure Dragon, representing the horn of the celestial dragon. Worn for new beginnings and spring energy.'],
    ['kang', 'Kang · 亢', 'Neck', 'Golden tiger eye stone, second mansion. The dragon unfurls its neck — a sign of confidence and rising authority.'],
    ['di', 'Di · 氐', 'Root', 'Earthy brown agate, third mansion. Like a tree with deep roots, this mansion grounds you in stability and ancestral wisdom.'],
    ['fang', 'Fang · 房', 'Room', 'Amethyst crystal, fourth mansion. The chamber of the heart — worn for emotional clarity and opening inner space.'],
    ['xin', 'Xin · 心', 'Heart', 'Deep red garnet, fifth mansion. The beating heart of the Azure Dragon. For passion, courage, and the fire to pursue what matters.'],
    ['wei', 'Wei · 尾', 'Tail', 'Gradient blue-to-white howlite, sixth mansion. The sweeping tail that leaves a mark across the sky — for leaving your legacy.'],
    ['ji', 'Ji · 箕', 'Winnowing', 'Golden citrine, seventh mansion. The basket that separates grain from chaff. For discernment and knowing what to keep.'],
  ],
  bird: [
    ['jing', 'Jing · 井', 'Well', 'Aquamarine, first mansion of the Vermillion Bird. Like a deep well of wisdom — for those who draw from inner depths.'],
    ['gui', 'Gui · 鬼', 'Ghost', 'Smoky quartz, second mansion. The spirits of ancestors walk here. For those who honor the past while walking forward.'],
    ['liu', 'Liu · 柳', 'Willow', 'Green aventurine, third mansion. The willow bends but never breaks. For resilience through life\'s storms.'],
    ['xing', 'Xing · 星', 'Star', 'Clear quartz crystal, fourth mansion. A single bright star in the southern sky. For those destined to shine.'],
    ['zhang', 'Zhang · 张', 'Extended Net', 'Turquoise, fifth mansion. The net that catches what is meant for you. For abundance and receiving.'],
    ['yi', 'Yi · 翼', 'Wing', 'White howlite, sixth mansion. The outspread wings of the Vermillion Bird. For those ready to soar.'],
    ['zhen', 'Zhen · 轸', 'Chariot', 'Black onyx, seventh mansion. The war chariot that carries you through. For strength in motion.'],
  ],
  tiger: [
    ['kui', 'Kui · 奎', 'Legs', 'White moonstone, first mansion of the White Tiger. The first step forward. For new journeys and bold beginnings.'],
    ['lou', 'Lou · 娄', 'Bond', 'Hematite, second mansion. The chains we choose to honor. For loyalty and sacred commitments.'],
    ['wei-stomach', 'Wei · 胃', 'Stomach', 'Yellow jade, third mansion. The granary of heaven. For nourishment, abundance, and taking in what sustains you.'],
    ['mao', 'Mao · 昴', 'Hairy Head', 'Pale blue chalcedony, fourth mansion. The Pleiades cluster. For star-seekers and dreamers who look up.'],
    ['bi-net', 'Bi · 毕', 'Net', 'Dark carnelian, fifth mansion. The hunter\'s net. For those who pursue goals with precision and patience.'],
    ['zi', 'Zi · 觜', 'Turtle Beak', 'Moss agate, sixth mansion. The snapping point. For decisive action when the moment arrives.'],
    ['shen', 'Shen · 参', 'Three Stars', 'Labradorite, seventh mansion. Orion\'s belt — three stars of power. For triple-strength protection.'],
  ],
  tortoise: [
    ['dou', 'Dou · 斗', 'Dipper', 'Dark sodalite, first mansion of the Black Tortoise. The measuring cup of fate. For those who pour themselves fully.'],
    ['niu', 'Niu · 牛', 'Ox', 'Brown tiger eye, second mansion. The patient strength of the ox. For endurance through long winters.'],
    ['nv', 'Nv · 女', 'Girl', 'Rose quartz, third mansion. The divine feminine — nurturing, creating, becoming. For soft power.'],
    ['xu', 'Xu · 虚', 'Emptiness', 'Clear crystal, fourth mansion. The void from which all things emerge. For minimalists and meditators.'],
    ['wei-rooftop', 'Wei · 危', 'Rooftop', 'Black agate, fifth mansion. Standing on the peak. For those who have climbed and earned the view.'],
    ['shi', 'Shi · 室', 'Encampment', 'Grey labradorite, sixth mansion. The camp where warriors rest. For building your sanctuary.'],
    ['bi-wall', 'Bi · 壁', 'Wall', 'White jade, seventh mansion. The fortress wall. For boundaries, protection, and knowing when to say no.'],
  ],
}

async function main() {
  console.log('Adding new product lines to MythRealms...\n')

  // ---- Create new categories (skip if exists) ----
  const catData = [
    { name:'Twenty-Eight Mansions · 二十八宿', slug:'28-mansions', description:'28 beaded bracelets — one for each Chinese lunar mansion. Find your star.', image:C('28-mansions-bracelets'), sortOrder:7 },
    { name:'Five Elements · 五行', slug:'five-elements', description:'Bracelets representing the Wu Xing: Wood, Fire, Earth, Metal, Water.', image:C('five-elements-stones'), sortOrder:8 },
    { name:'Four Seasons · 四季', slug:'four-seasons', description:'Jewelry inspired by the beauty of spring, summer, autumn, and winter.', image:C('four-seasons-collection'), sortOrder:9 },
    { name:'Zodiac Amulets · 生肖护符', slug:'zodiac-amulets', description:'Twelve Chinese zodiac animal pendants — find your birth year guardian.', image:C('zodiac-amulets'), sortOrder:10 },
    { name:'Artist Collaborations · 艺术家联名', slug:'artist-collabs', description:'Limited edition pieces reimagining ancient myths through contemporary art.', image:C('artist-collab-series'), sortOrder:11 },
  ]

  const categories: Record<string, string> = {}
  for (const c of catData) {
    const existing = await db.category.findUnique({ where: { slug: c.slug } })
    if (existing) {
      categories[c.slug] = existing.id
      console.log(`  ⏭ ${c.name} (exists)`)
    } else {
      const created = await db.category.create({ data: c })
      categories[c.slug] = created.id
      console.log(`  ✅ ${c.name}`)
    }
  }

  // Also add "All Bracelets" collection for star bracelets expansion
  const starBracelets = await db.category.findUnique({ where: { slug: 'star-bracelets' } })
  const starCatId = starBracelets?.id || categories['28-mansions']

  // ---- 28 Mansions (28 products) ----
  console.log('\n📿 28 Mansions...')
  const mansionEntries: ProductSeed[] = []
  const allMansions = [...MANSIONS.dragon, ...MANSIONS.bird, ...MANSIONS.tiger, ...MANSIONS.tortoise]

  for (const [slug, name, en, desc] of allMansions) {
    const fullSlug = `${slug}-mansion-bracelet`
    mansionEntries.push({
      name: `${name} — 28 Mansions Star Bracelet`,
      slug: fullSlug,
      description: `${desc} Each 28 Mansions bracelet is handcrafted with authentic crystals and a sterling silver charm engraved with the mansion\'s name.`,
      details: JSON.stringify({
        mansionProperties: [{ mansion: name, quadrant: en.includes('dragon') ? 'Azure Dragon · East' : en.includes('bird') ? 'Vermillion Bird · South' : en.includes('tiger') ? 'White Tiger · West' : 'Black Tortoise · North', benefit: desc.split('.')[0] }],
        specs: { itemType: 'Beaded Bracelet', material: 'Crystal & 925 Silver', size: '16-18cm adjustable' },
      }),
      comparePrice: 44.99,
      images: JSON.stringify([P(fullSlug)]),
      stone: desc.split(' ')[0],
      material: 'Crystal & 925 Silver',
      intention: 'Celestial Guidance',
      isFeatured: false,
      categoryId: categories['28-mansions'],
      variants: [{ name: 'Standard / 16-18cm', price: 34.99, stock: 8 }],
    })
  }

  // ---- 5 Elements (5 products) ----
  console.log('🪨 5 Elements...')
  const elements: Array<[string, string, string, string, string]> = [
    ['wood', 'Wood · 木', 'Forest green jade with wood grain silver charm. Symbol of growth, creativity, and new beginnings in the Wu Xing cycle.', 'Jade', 'Growth & Vitality'],
    ['fire', 'Fire · 火', 'Blazing red carnelian with flame-shaped bronze charm. Symbol of passion, transformation, and the inner fire that drives you.', 'Carnelian', 'Passion & Transformation'],
    ['earth', 'Earth · 土', 'Warm yellow tiger eye with square mountain charm. Symbol of stability, nourishment, and the grounded wisdom of the earth.', 'Tiger Eye', 'Stability & Nourishment'],
    ['metal', 'Metal · 金', 'White moonstone with circular coin charm in polished silver. Symbol of precision, clarity, and the cutting edge of truth.', 'Moonstone', 'Clarity & Precision'],
    ['water', 'Water · 水', 'Deep blue sodalite with flowing wave charm. Symbol of wisdom, adaptability, and the quiet power that shapes canyons.', 'Sodalite', 'Wisdom & Adaptability'],
  ]
  const elementEntries: ProductSeed[] = []
  for (const [slug, en, desc, stone, intention] of elements) {
    elementEntries.push({
      name: `${en} — Five Elements Bracelet`,
      slug: `${slug}-element-bracelet`,
      description: `${desc} Each Five Elements bracelet is crafted with authentic gemstones representing one phase of the ancient Chinese Wu Xing philosophy.`,
      details: JSON.stringify({
        elementProperties: [{ element: en, benefit: desc.split('.')[0] }],
        specs: { itemType: 'Beaded Bracelet', material: 'Crystal & Silver', size: '16-18cm adjustable' },
      }),
      comparePrice: 42.99,
      images: JSON.stringify([P(`${slug}-element-bracelet`)]),
      stone,
      material: 'Crystal & Silver',
      intention,
      isFeatured: true,
      categoryId: categories['five-elements'],
      variants: [{ name: 'Standard / 16-18cm', price: 32.99, stock: 8 }],
    })
  }

  // ---- 4 Seasons (12 products) ----
  console.log('🌸 4 Seasons...')
  const seasons: Array<[string, string, string, string, string, string, number, number]> = [
    ['spring-cherry-necklace', 'Spring Cherry Blossom Necklace', 'Delicate rose gold necklace with pink tourmaline cherry blossom petals and freshwater pearl centers. Each blossom captures the fleeting beauty of spring — a reminder that the most beautiful things bloom in their own time.', 'Tourmaline', 'Rose Gold', 'Renewal & Beauty', 62.99, 52.99],
    ['spring-plum-earrings', 'Spring Plum Blossom Earrings', 'Polished silver plum blossom earrings with tiny ruby centers, dangling on a delicate chain. The plum blooms in winter\'s last chill — the first sign that warmth is coming.', 'Ruby', 'Silver', 'Hope & Resilience', 48.99, 39.99],
    ['spring-green-bracelet', 'Spring Green Jade Bracelet', 'Vibrant green jadeite bracelet with sprouting leaf charms in 18k gold. Each leaf represents a new beginning — the courage to push through the soil toward the sun.', 'Jadeite', 'Jade & Gold', 'Growth & Courage', 58.99, 48.99],
    ['summer-lotus-pendant', 'Summer Lotus Pendant', 'White jade lotus flower pendant with radiant gold center stamens. The lotus rises from mud unstained — a meditation on purity emerging from chaos. Suspended on a fine gold chain.', 'Jade', 'Gold & Jade', 'Purity & Enlightenment', 68.99, 56.99],
    ['summer-dragonfly-brooch', 'Summer Dragonfly Brooch', 'Iridescent abalone shell dragonfly brooch with delicate silver wire filigree wings. The dragonfly hovers between water and sky — a messenger between worlds, light as summer air.', 'Abalone', 'Silver & Abalone', 'Lightness & Transition', 54.99, 44.99],
    ['summer-sun-ring', 'Summer Sun Ring', 'Bold golden citrine sunburst ring in warm gold setting. Radiating rays of light from a blazing center — wear this when you need to remember your own fire. Statement piece.', 'Citrine', 'Gold', 'Radiance & Power', 72.99, 59.99],
    ['autumn-maple-pendant', 'Autumn Maple Leaf Pendant', 'Oxidized copper maple leaf pendant with a single garnet dewdrop catching the last light. Autumn teaches us that letting go can be the most beautiful act of all.', 'Garnet', 'Copper', 'Release & Gratitude', 49.99, 39.99],
    ['autumn-moon-earrings', 'Autumn Moon Earrings', 'Crescent moon earrings in matte gold with smoky quartz drops. The harvest moon hangs low and orange — a time of gathering, feasting, and counting blessings under its glow.', 'Smoky Quartz', 'Matte Gold', 'Abundance & Reflection', 52.99, 42.99],
    ['autumn-chrysanthemum-ring', 'Autumn Chrysanthemum Ring', 'Layered gold chrysanthemum ring with warm citrine center. The chrysanthemum blooms when everything else fades — a symbol of longevity, nobility, and quiet defiance against the coming cold.', 'Citrine', 'Gold', 'Longevity & Nobility', 64.99, 52.99],
    ['winter-snowflake-pendant', 'Winter Snowflake Pendant', 'Intricate snowflake pendant in white gold with diamond dust finish. No two snowflakes are alike — and neither are you. Suspended on a fine white gold chain, catching light like fresh snow.', 'Diamond Dust', 'White Gold', 'Uniqueness & Purity', 78.99, 64.99],
    ['winter-pine-bracelet', 'Winter Pine Bracelet', 'Dark green jade and oxidized silver pine branch bracelet. The pine stays green when the world freezes — resilience is not about avoiding hardship, but enduring it with grace.', 'Jade', 'Silver & Jade', 'Resilience & Endurance', 46.99, 36.99],
    ['winter-crane-brooch', 'Winter Crane Brooch', 'Red-crowned crane brooch in carved white jade with red coral accents. In the deepest snow, the crane dances — a promise that grace survives every winter. Museum-quality craftsmanship.', 'Jade & Coral', 'Jade & Silver', 'Grace & Longevity', 82.99, 66.99],
  ]
  const seasonEntries: ProductSeed[] = []
  for (const entry of seasons) {
    const slug = entry[0] as string
    const name = entry[1] as string
    const desc = entry[2] as string
    const stone = entry[3] as string
    const material = entry[4] as string
    const intention = entry[5] as string
    const comparePrice = entry[6] as number
    const price = entry[7] as number
    seasonEntries.push({
      name,
      slug,
      description: desc,
      details: JSON.stringify({
        seasonProperties: [{ season: slug.split('-')[0].charAt(0).toUpperCase() + slug.split('-')[0].slice(1), benefit: desc.split('—')[1]?.trim() || desc.split('.')[0] }],
        specs: { itemType: slug.includes('necklace') ? 'Necklace' : slug.includes('earrings') ? 'Earrings' : slug.includes('bracelet') ? 'Bracelet' : slug.includes('ring') ? 'Ring' : 'Brooch', material },
      }),
      comparePrice,
      images: JSON.stringify([P(slug)]),
      stone,
      material,
      intention,
      isFeatured: ['spring-cherry-necklace', 'summer-lotus-pendant', 'autumn-maple-pendant', 'winter-snowflake-pendant'].includes(slug),
      categoryId: categories['four-seasons'],
      variants: [{ name: `Standard`, price, stock: 6 }],
    })
  }

  // ---- 12 Zodiac (12 products) ----
  console.log('🐀 12 Zodiac...')
  const zodiacs: Array<[string, string, string, string, string, string, number]> = [
    ['rat', 'Rat · 鼠', 'Clever and resourceful — the Rat opens the 12-year cycle with wit and adaptability. Sterling silver amulet with intricate detailing.', 'Silver', '925 Sterling Silver', 'Wit & Resourcefulness', 44.99],
    ['ox', 'Ox · 牛', 'Strong and dependable — the Ox carries the weight of the world without complaint. Bronze amulet with powerful horn curve design.', 'Bronze', 'Bronze', 'Strength & Perseverance', 42.99],
    ['tiger', 'Tiger · 虎', 'Fierce and courageous — the Tiger commands respect in any room. Gold-plated amulet with majestic stripe detailing.', 'Gold', 'Gold-Plated', 'Courage & Authority', 48.99],
    ['rabbit', 'Rabbit · 兔', 'Gentle and elegant — the Rabbit moves through the world with quiet grace. Silver amulet with crescent moon motif.', 'Silver', '925 Silver', 'Grace & Intuition', 42.99],
    ['dragon', 'Dragon · 龙', 'The most auspicious sign — the Dragon commands the heavens themselves. Imperial gold amulet with five-clawed dragon coil.', 'Gold', 'Gold-Plated', 'Power & Fortune', 52.99],
    ['snake', 'Snake · 蛇', 'Wise and mysterious — the Snake sees what others miss. Silver amulet with coiled serpent and wisdom eye.', 'Silver', '925 Silver', 'Wisdom & Mystery', 44.99],
    ['horse', 'Horse · 马', 'Free and untamed — the Horse runs where the wind takes it. Bronze amulet with galloping stallion, mane swept back.', 'Bronze', 'Bronze', 'Freedom & Adventure', 44.99],
    ['goat', 'Goat · 羊', 'Peaceful and creative — the Goat brings harmony wherever it goes. Rose gold amulet with curved horn design.', 'Rose Gold', 'Rose Gold-Plated', 'Harmony & Creativity', 46.99],
    ['monkey', 'Monkey · 猴', 'Clever and playful — the Monkey outsmarts gods and demons alike. Silver amulet with peach of immortality in hand.', 'Silver', '925 Silver', 'Intelligence & Agility', 44.99],
    ['rooster', 'Rooster · 鸡', 'Proud and punctual — the Rooster announces the dawn. Gold amulet with detailed feather crown, herald of the new day.', 'Gold', 'Gold-Plated', 'Confidence & Dawn', 42.99],
    ['dog', 'Dog · 狗', 'Loyal and protective — the Dog guards what matters most. Bronze amulet with steadfast guardian stance.', 'Bronze', 'Bronze', 'Loyalty & Protection', 42.99],
    ['pig', 'Pig · 猪', 'Generous and fortunate — the Pig attracts abundance and joy. Rose gold amulet with prosperity symbols.', 'Rose Gold', 'Rose Gold-Plated', 'Abundance & Joy', 46.99],
  ]
  const zodiacEntries: ProductSeed[] = []
  for (const [slug, name, desc, stone, material, intention, price] of zodiacs) {
    zodiacEntries.push({
      name: `Year of the ${name} — Zodiac Guardian Amulet`,
      slug: `zodiac-${slug}-amulet`,
      description: `${desc} Each Zodiac Amulet is cast with reverence for the ancient Chinese calendar — a personal talisman for those born under this sign.`,
      details: JSON.stringify({
        zodiacProperties: [{ animal: name, benefit: desc.split('—')[1]?.trim() || '' }],
        specs: { itemType: 'Amulet Pendant', material, size: '2.5cm diameter' },
      }),
      comparePrice: price + 12,
      images: JSON.stringify([P(`zodiac-${slug}-amulet`)]),
      stone,
      material,
      intention,
      isFeatured: ['dragon', 'tiger', 'horse', 'rabbit'].includes(slug),
      categoryId: categories['zodiac-amulets'],
      variants: [{ name: `${material} / Leather cord`, price, stock: 10 }],
    })
  }

  // ---- 4 Artist Collabs ----
  console.log('🎨 4 Artist Collabs...')
  const collabs: Array<[string, string, string, string, string, string, number]> = [
    ['inkwash-dragon', 'Inkwash Dragon · 水墨青龙', 'Deconstructed Azure Dragon pendant in abstract Chinese ink wash style. Splattered ink textures on brushed silver — where 2000-year-old mythology meets contemporary gallery art. Limited edition of 100.', 'Silver', 'Brushed Silver', 'Art & Abstraction', 128.99],
    ['bronze-beast', 'Bronze Beast · 青铜饕餮', 'Raw textured Taotie ring in deliberately imperfect brutalist bronze. Ancient bronze casting technique reimagined for the modern age — every imperfection is intentional. Limited edition of 50.', 'Bronze', 'Raw Bronze', 'Brutalist Power', 148.99],
    ['porcelain-phoenix', 'Porcelain Phoenix · 青花凤凰', 'Ming dynasty porcelain aesthetic reimagined as earrings. White porcelain with cobalt blue underglaze, delicate crackle finish — the Phoenix reborn in blue and white. Limited edition of 75.', 'Porcelain', 'Porcelain & Silver', 'Tradition Reborn', 138.99],
    ['jade-minimal', 'Jade Minimal · 原石麒麟', 'Single piece of raw uncut jade with one polished facet, set in minimalist silver. Wabi-sabi meets the Qilin — beauty in the unfinished, power in the natural. Limited edition of 30.', 'Raw Jade', 'Raw Jade & Silver', 'Wabi-Sabi Spirit', 188.99],
  ]
  const collabEntries: ProductSeed[] = []
  for (const [slug, name, desc, stone, material, intention, price] of collabs) {
    collabEntries.push({
      name: `${name} — Artist Collaboration`,
      slug: `artist-collab-${slug}`,
      description: `${desc} Each Artist Collaboration piece is individually numbered and comes with a certificate of authenticity.`,
      details: JSON.stringify({
        collabProperties: [{ series: 'Artist Collaboration Vol.1', benefit: desc.split('—')[1]?.trim() || '' }],
        specs: { itemType: slug.includes('ring') ? 'Ring' : slug.includes('earrings') ? 'Earrings' : 'Pendant', material, edition: 'Limited' },
      }),
      comparePrice: price + 40,
      images: JSON.stringify([P(`artist-collab-${slug}`)]),
      stone,
      material,
      intention,
      isFeatured: true,
      categoryId: categories['artist-collabs'],
      variants: [{ name: `Limited Edition / ${material}`, price, stock: slug === 'jade-minimal' ? 30 : slug === 'bronze-beast' ? 50 : slug === 'porcelain-phoenix' ? 75 : 100 }],
    })
  }

  // ---- Insert all ----
  const allProducts = [...mansionEntries, ...elementEntries, ...seasonEntries, ...zodiacEntries, ...collabEntries]
  console.log(`\n📦 Inserting ${allProducts.length} products...`)

  let created = 0
  for (const data of allProducts) {
    const existing = await db.product.findUnique({ where: { slug: data.slug } })
    if (existing) {
      console.log(`  ⏭ ${data.slug} (exists)`)
      continue
    }
    const { variants, ...rest } = data
    const minPrice = Math.min(...variants.map((variant) => variant.price))
    await db.product.create({ data: { ...rest, minPrice, variants: { create: variants } } })
    created++
    if (created % 10 === 0) console.log(`  ... ${created}/${allProducts.length}`)
  }

  console.log(`\n🎉 Done! Created ${created} new products (${allProducts.length - created} already existed)`)
  await db.$disconnect()
}

main().catch(e => { console.error(e); process.exit(1) })
