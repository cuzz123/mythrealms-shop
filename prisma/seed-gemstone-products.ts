// Seed script: Add Curated Stones gemstone product line
// Does NOT delete existing data — safe to run on production DB

import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const IMG_BASE = '/images/products'
const CAT_BASE = '/images/categories'

const P = (name: string) => `${IMG_BASE}/${name}.png`
const C = (name: string) => `${CAT_BASE}/${name}.png`

async function main() {
  console.log('Adding Curated Stones gemstone collection to MythRealms...\n')

  // ---- STEP 1: Create "Curated Stones" parent category ----
  let curatedParent = await db.category.findUnique({ where: { slug: 'curated-stones' } })
  if (!curatedParent) {
    curatedParent = await db.category.create({
      data: {
        name: 'Curated Stones · 精选宝石',
        slug: 'curated-stones',
        description: 'Hand-selected gemstone bracelets celebrating the natural beauty and healing properties of crystals. Each piece is crafted with authentic, ethically sourced stones.',
        image: C('curated-stones'),
        sortOrder: 16,
      },
    })
    console.log('  ✅ Created parent: Curated Stones')
  } else {
    console.log('  ⏭ Curated Stones (exists)')
  }

  // ---- STEP 2: Create subcategories ----
  const subcategoryData = [
    { name: 'Amethyst', slug: 'amethyst', description: 'Deep purple amethyst bracelets — calming energy and spiritual protection.', image: C('amethyst'), sortOrder: 1, parentId: curatedParent.id },
    { name: 'Rose Quartz', slug: 'rose-quartz', description: 'Soft pink rose quartz bracelets — the stone of unconditional love and emotional healing.', image: C('rose-quartz'), sortOrder: 2, parentId: curatedParent.id },
    { name: 'Black Obsidian', slug: 'black-obsidian', description: 'Dark obsidian bracelets — powerful grounding and psychic protection.', image: C('black-obsidian'), sortOrder: 3, parentId: curatedParent.id },
    { name: 'Moonstone', slug: 'moonstone', description: 'Luminous moonstone bracelets — intuition, new beginnings, and the divine feminine.', image: C('moonstone'), sortOrder: 4, parentId: curatedParent.id },
    { name: "Tiger's Eye", slug: 'tigers-eye', description: "Golden tiger's eye bracelets — confidence, courage, and grounded prosperity.", image: C('tigers-eye'), sortOrder: 5, parentId: curatedParent.id },
  ]

  const subcategories: Record<string, string> = {}
  for (const c of subcategoryData) {
    const existing = await db.category.findUnique({ where: { slug: c.slug } })
    if (existing) {
      subcategories[c.slug] = existing.id
      console.log(`  ⏭ ${c.name} (exists)`)
    } else {
      const created = await db.category.create({ data: c })
      subcategories[c.slug] = created.id
      console.log(`  ✅ ${c.name}`)
    }
  }

  // ---- STEP 3: Define gemstone products ----
  const gems = [
    // ========== AMETHYST ==========
    {
      name: 'Lavender Amethyst Bracelet',
      slug: 'lavender-amethyst-bracelet',
      description: 'Amethyst has been treasured since ancient Greece for its calming energy and deep purple hue. The name itself comes from the Greek "amethystos" — meaning "not intoxicated" — as the stone was believed to protect against excess. These 8mm round amethyst beads display a soft lavender-to-deep-purple gradient, each bead uniquely banded by nature. Strung on durable elastic for an effortless slip-on fit, this bracelet is your daily companion for clarity, calm, and centered focus.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Amethyst', benefit: 'Calming, clarity, spiritual protection, sobriety' }],
        specs: { itemType: 'Beaded Bracelet', material: 'Amethyst', beadSize: '8mm round', closure: 'Elastic stretch', origin: 'Brazil / Uruguay' },
      }),
      comparePrice: 46.99,
      images: JSON.stringify([P('lavender-amethyst-bracelet')]),
      stone: 'Amethyst',
      material: 'Amethyst & Elastic',
      intention: 'Calm & Clarity',
      isFeatured: true,
      isActive: true,
      categoryId: subcategories['amethyst'],
      variants: [{ name: 'Standard / 16-18cm', price: 36.99, stock: 15 }],
    },
    {
      name: 'Amethyst & Gold Spacer Bracelet',
      slug: 'amethyst-gold-spacer-bracelet',
      description: 'A refined take on the classic amethyst bracelet. Six millimeter amethyst rounds alternate with delicate 14k gold-plated spacer beads, creating a rhythmic dance of purple and gold. Amethyst was once reserved for royalty and bishops — a stone of spiritual authority. The gold spacers catch the light with every movement, elevating this piece from casual to quietly luxurious. Finished with a secure gold-plated clasp and extender chain for a custom fit.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Amethyst', benefit: 'Spiritual wisdom, inner peace, elevated consciousness' }],
        specs: { itemType: 'Beaded Bracelet', material: 'Amethyst & 14k Gold-Plated Brass', beadSize: '6mm round', closure: 'Gold-plated lobster clasp with extender', origin: 'Brazil / Uruguay' },
      }),
      comparePrice: 52.99,
      images: JSON.stringify([P('amethyst-gold-spacer-bracelet')]),
      stone: 'Amethyst',
      material: 'Amethyst & Gold-Plated Brass',
      intention: 'Spiritual Wisdom',
      isFeatured: false,
      isActive: true,
      categoryId: subcategories['amethyst'],
      variants: [{ name: 'Standard / 16-19cm adjustable', price: 42.99, stock: 12 }],
    },

    // ========== ROSE QUARTZ ==========
    {
      name: 'Blush Rose Quartz Bracelet',
      slug: 'blush-rose-quartz-bracelet',
      description: 'Rose quartz is called the Heart Stone for good reason. Ancient Egyptians believed it could prevent wrinkles and preserve youth. Romans used it as a seal of ownership and love. Today, it is cherished for its gentle, nurturing energy — a stone that opens the heart without demanding anything in return. These 10mm round beads are a dreamy, translucent blush pink with natural inclusions that prove their authenticity. Strung on elastic for easy wear, this bracelet is a soft embrace on your wrist.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Rose Quartz', benefit: 'Unconditional love, emotional healing, self-compassion, gentleness' }],
        specs: { itemType: 'Beaded Bracelet', material: 'Rose Quartz', beadSize: '10mm round', closure: 'Elastic stretch', origin: 'Madagascar / Brazil' },
      }),
      comparePrice: 44.99,
      images: JSON.stringify([P('blush-rose-quartz-bracelet')]),
      stone: 'Rose Quartz',
      material: 'Rose Quartz & Elastic',
      intention: 'Love & Compassion',
      isFeatured: true,
      isActive: true,
      categoryId: subcategories['rose-quartz'],
      variants: [{ name: 'Standard / 16-18cm', price: 34.99, stock: 18 }],
    },
    {
      name: 'Rose Quartz & Freshwater Pearl Bracelet',
      slug: 'rose-quartz-pearl-bracelet',
      description: 'A marriage of the Heart Stone and the Queen of Gems. Soft pink rose quartz beads alternate with luminous white freshwater pearls in this romantic, feminine design. Pearls have been prized for over 4,000 years — Cleopatra dissolved one in vinegar to prove she could consume a fortune. Here they are paired with rose quartz, the stone of gentle love, to create a bracelet that feels like poetry on the wrist. Tiny gold-filled spacers separate each bead, adding a whisper of warmth.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Rose Quartz & Pearl', benefit: 'Love, purity, emotional balance, feminine grace' }],
        specs: { itemType: 'Beaded Bracelet', material: 'Rose Quartz, Freshwater Pearls, Gold-Filled Spacers', beadSize: '8mm mixed', closure: 'Gold-filled lobster clasp', origin: 'Madagascar / China (pearls)' },
      }),
      comparePrice: 54.99,
      images: JSON.stringify([P('rose-quartz-pearl-bracelet')]),
      stone: 'Rose Quartz & Pearl',
      material: 'Rose Quartz, Pearl & Gold-Filled',
      intention: 'Love & Grace',
      isFeatured: false,
      isActive: true,
      categoryId: subcategories['rose-quartz'],
      variants: [{ name: 'Standard / 16-18cm', price: 42.99, stock: 10 }],
    },

    // ========== BLACK OBSIDIAN ==========
    {
      name: 'Black Obsidian Guardian Bracelet',
      slug: 'black-obsidian-guardian-bracelet',
      description: 'Obsidian is not a crystal — it is volcanic glass, born from fire and cooled so rapidly it had no time to crystallize. For thousands of years it has been used for mirrors, blades, and spiritual protection. Ancient Mesoamericans crafted obsidian into ceremonial knives. Shamans used obsidian mirrors for scrying. These 12mm faceted beads are cut to reveal the stone\'s mirror-like surface — a reminder that true protection comes from seeing things as they truly are. Deeply grounding, powerfully protective.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Black Obsidian', benefit: 'Grounding, psychic protection, truth-revealing, shadow work' }],
        specs: { itemType: 'Faceted Beaded Bracelet', material: 'Black Obsidian', beadSize: '12mm faceted', closure: 'Elastic stretch', origin: 'Mexico' },
      }),
      comparePrice: 49.99,
      images: JSON.stringify([P('black-obsidian-guardian-bracelet')]),
      stone: 'Black Obsidian',
      material: 'Black Obsidian & Elastic',
      intention: 'Protection & Grounding',
      isFeatured: true,
      isActive: true,
      categoryId: subcategories['black-obsidian'],
      variants: [{ name: 'Standard / 16-18cm', price: 39.99, stock: 14 }],
    },
    {
      name: 'Obsidian & Hematite Stack',
      slug: 'obsidian-hematite-stack',
      description: 'Two of the most grounding stones in one bracelet. Faceted black obsidian alternates with metallic hematite — a stone so rich in iron that it was once ground into pigment for cave paintings. Hematite\'s name comes from the Greek "haima" meaning blood, for the red streak it leaves when scratched. Together, obsidian and hematite form a shield against negativity: obsidian absorbs and transmutes, while hematite grounds and stabilizes. This bracelet has weight and presence — you will feel it on your wrist.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Obsidian & Hematite', benefit: 'Deep grounding, energy shielding, mental clarity, focus' }],
        specs: { itemType: 'Stacked Beaded Bracelet', material: 'Black Obsidian & Hematite', beadSize: '10mm faceted', closure: 'Elastic stretch', origin: 'Mexico / Brazil' },
      }),
      comparePrice: 56.99,
      images: JSON.stringify([P('obsidian-hematite-stack')]),
      stone: 'Obsidian & Hematite',
      material: 'Black Obsidian, Hematite & Elastic',
      intention: 'Grounding & Focus',
      isFeatured: false,
      isActive: true,
      categoryId: subcategories['black-obsidian'],
      variants: [{ name: 'Standard / 16-18cm', price: 44.99, stock: 10 }],
    },

    // ========== MOONSTONE ==========
    {
      name: 'Rainbow Moonstone Bracelet',
      slug: 'rainbow-moonstone-bracelet',
      description: 'Moonstone has been revered since ancient Rome, where it was believed to be formed from solidified moonbeams. In India, it is still considered a sacred stone and is often given as a wedding gift. These 8mm round beads are genuine rainbow moonstone — a variety of labradorite feldspar that displays an ethereal blue flash known as adularescence. Hold it under the light and watch it shimmer like moonlight on water. A talisman for new beginnings, intuition, and the quiet magic of the night.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Rainbow Moonstone', benefit: 'Intuition, new beginnings, divine feminine, emotional balance' }],
        specs: { itemType: 'Beaded Bracelet', material: 'Rainbow Moonstone', beadSize: '8mm round', closure: 'Elastic stretch', origin: 'India / Sri Lanka' },
      }),
      comparePrice: 52.99,
      images: JSON.stringify([P('rainbow-moonstone-bracelet')]),
      stone: 'Moonstone',
      material: 'Rainbow Moonstone & Elastic',
      intention: 'Intuition & New Beginnings',
      isFeatured: true,
      isActive: true,
      categoryId: subcategories['moonstone'],
      variants: [{ name: 'Standard / 16-18cm', price: 42.99, stock: 12 }],
    },
    {
      name: 'Moonstone & Silver Chain Bracelet',
      slug: 'moonstone-silver-chain-bracelet',
      description: 'Delicate and luminous — this is not a beaded bracelet but a fine silver chain punctuated with small teardrop moonstone charms. Each charm is hand-set in a sterling silver bezel, allowing the stone\'s blue adularescent flash to be seen from every angle. The chain is a classic cable link in polished 925 silver, light as breath on the wrist. Wear it alone for quiet elegance, or layer it with other bracelets as part of your personal stack. A piece for the woman who moves through the world with quiet, luminous grace.',
      details: JSON.stringify({
        stoneProperties: [{ stone: 'Moonstone', benefit: 'Intuition, grace, emotional harmony, lunar connection' }],
        specs: { itemType: 'Chain Bracelet with Charms', material: '925 Sterling Silver, Moonstone', chain: 'Cable link 1.2mm', closure: 'Sterling silver lobster clasp', origin: 'India / Sri Lanka' },
      }),
      comparePrice: 48.99,
      images: JSON.stringify([P('moonstone-silver-chain-bracelet')]),
      stone: 'Moonstone',
      material: '925 Sterling Silver & Moonstone',
      intention: 'Grace & Intuition',
      isFeatured: false,
      isActive: true,
      categoryId: subcategories['moonstone'],
      variants: [{ name: 'Standard / 16-19cm adjustable', price: 39.99, stock: 10 }],
    },

    // ========== TIGER'S EYE ==========
    {
      name: "Golden Tiger's Eye Bracelet",
      slug: 'golden-tigers-eye-bracelet',
      description: "Tiger's eye is one of the most mesmerizing stones on Earth. Its chatoyancy — the optical effect of a moving band of light across the surface — resembles the watchful gaze of a tiger. Roman soldiers carried tiger's eye into battle for courage and protection. In Chinese feng shui, it is associated with wealth and grounded prosperity. These 10mm round beads display rich bands of gold, brown, and amber that shift and shimmer as they catch the light. A bracelet for those who walk with quiet confidence.",
      details: JSON.stringify({
        stoneProperties: [{ stone: "Tiger's Eye", benefit: 'Confidence, courage, grounded prosperity, protection' }],
        specs: { itemType: 'Beaded Bracelet', material: "Tiger's Eye", beadSize: '10mm round', closure: 'Elastic stretch', origin: 'South Africa / Australia' },
      }),
      comparePrice: 46.99,
      images: JSON.stringify([P('golden-tigers-eye-bracelet')]),
      stone: "Tiger's Eye",
      material: "Tiger's Eye & Elastic",
      intention: 'Confidence & Prosperity',
      isFeatured: true,
      isActive: true,
      categoryId: subcategories['tigers-eye'],
      variants: [{ name: 'Standard / 16-18cm', price: 36.99, stock: 16 }],
    },
    {
      name: "Tiger's Eye & Sandalwood Bead Bracelet",
      slug: 'tigers-eye-sandalwood-bracelet',
      description: "A meeting of two ancient traditions. Golden tiger's eye beads — the stone of courage and grounded confidence — alternate with warm sandalwood beads that release a subtle, calming fragrance with wear. Sandalwood has been used in meditation and spiritual practice across Asia for millennia; its scent is said to quiet the mind and open the heart. Together, the cool tiger's eye and warm wood create a bracelet that feels both protective and peaceful. A piece for the modern seeker.",
      details: JSON.stringify({
        stoneProperties: [{ stone: "Tiger's Eye & Sandalwood", benefit: 'Courage, calm, meditation, spiritual grounding' }],
        specs: { itemType: 'Mixed Beaded Bracelet', material: "Tiger's Eye & Natural Sandalwood", beadSize: '10mm tiger\'s eye / 8mm sandalwood', closure: 'Elastic stretch', origin: 'South Africa / India' },
      }),
      comparePrice: 44.99,
      images: JSON.stringify([P('tigers-eye-sandalwood-bracelet')]),
      stone: "Tiger's Eye & Sandalwood",
      material: "Tiger's Eye, Sandalwood & Elastic",
      intention: 'Courage & Calm',
      isFeatured: false,
      isActive: true,
      categoryId: subcategories['tigers-eye'],
      variants: [{ name: 'Standard / 16-18cm', price: 34.99, stock: 14 }],
    },

    // ========== MIXED / BEST SELLERS ==========
    {
      name: 'The Essential Stack',
      slug: 'essential-crystal-stack',
      description: 'Why choose one stone when you can wear three? The Essential Stack combines our three most popular bracelets into a single, perfectly curated set. You receive the Lavender Amethyst Bracelet for calm and clarity, the Blush Rose Quartz Bracelet for love and compassion, and the Black Obsidian Guardian Bracelet for protection and grounding. Together, they cover the full spectrum of emotional well-being: mind, heart, and spirit. Each bracelet is individually handcrafted and arrives in a premium gift box — a complete crystal ritual in one purchase.',
      details: JSON.stringify({
        stoneProperties: [
          { stone: 'Amethyst', benefit: 'Calm, clarity, spiritual protection' },
          { stone: 'Rose Quartz', benefit: 'Love, compassion, emotional healing' },
          { stone: 'Black Obsidian', benefit: 'Grounding, protection, truth' },
        ],
        specs: { itemType: '3-Bracelet Set', material: 'Amethyst, Rose Quartz, Black Obsidian', beadSize: '8-10mm mixed', closure: 'Elastic stretch (all 3)', origin: 'Brazil, Madagascar, Mexico' },
      }),
      comparePrice: 64.99,
      images: JSON.stringify([P('essential-crystal-stack')]),
      stone: 'Amethyst, Rose Quartz & Obsidian',
      material: 'Mixed Gemstones & Elastic',
      intention: 'Complete Well-Being',
      isFeatured: true,
      isActive: true,
      categoryId: curatedParent.id,
      variants: [{ name: 'Set of 3 / 16-18cm', price: 49.99, stock: 8 }],
    },
    {
      name: "Beginner's Crystal Set",
      slug: 'beginners-crystal-set',
      description: "New to crystals? This is your perfect introduction. The Beginner's Crystal Set includes five individual bracelets, one of each of our core stones: amethyst, rose quartz, black obsidian, moonstone, and tiger's eye. Each bracelet is a single-strand elastic piece with 8mm round beads — simple, wearable, and ready to be mixed, matched, and stacked however you like. Includes a printed card explaining each stone's properties and suggested combinations. Discover which stone resonates with you most, or gift the set to someone beginning their crystal journey.",
      details: JSON.stringify({
        stoneProperties: [
          { stone: 'Amethyst', benefit: 'Calm, clarity, spiritual protection' },
          { stone: 'Rose Quartz', benefit: 'Love, compassion, emotional healing' },
          { stone: 'Black Obsidian', benefit: 'Grounding, protection, truth' },
          { stone: 'Moonstone', benefit: 'Intuition, new beginnings, grace' },
          { stone: "Tiger's Eye", benefit: 'Confidence, courage, prosperity' },
        ],
        specs: { itemType: '5-Bracelet Set', material: 'Amethyst, Rose Quartz, Black Obsidian, Moonstone, Tiger\'s Eye', beadSize: '8mm round (each)', closure: 'Elastic stretch (all 5)', origin: 'Brazil, Madagascar, Mexico, India, South Africa' },
      }),
      comparePrice: 59.99,
      images: JSON.stringify([P('beginners-crystal-set')]),
      stone: 'Mixed Gemstones',
      material: 'Mixed Gemstones & Elastic',
      intention: 'Crystal Discovery',
      isFeatured: true,
      isActive: true,
      categoryId: curatedParent.id,
      variants: [{ name: 'Set of 5 / 16-18cm', price: 44.99, stock: 6 }],
    },
  ]

  // ---- STEP 4: Insert products ----
  console.log(`\n📿 Inserting ${gems.length} gemstone products...`)

  let created = 0
  for (const data of gems) {
    const existing = await db.product.findUnique({ where: { slug: data.slug } })
    if (existing) {
      console.log(`  ⏭ ${data.slug} (exists)`)
      continue
    }
    const { variants, ...rest } = data
    const minPrice = Math.min(...variants.map((v: any) => v.price))
    const product = await db.product.create({ data: { ...rest, minPrice, variants: { create: variants } } })

    // Add reviews for featured products
    if (data.isFeatured && product) {
      await db.review.createMany({
        data: [
          { productId: product.id, rating: 5, content: `Absolutely beautiful ${data.name.toLowerCase()}. The stone quality is exceptional — vibrant, well-cut, and clearly authentic. Exceeded my expectations.`, isVerified: true },
          { productId: product.id, rating: 5, content: 'Stunning craftsmanship. The beads are perfectly matched and the elastic is sturdy without being stiff. I wear mine daily and it still looks brand new.', isVerified: true },
          { productId: product.id, rating: 4, content: 'Lovely bracelet. The stone has beautiful natural variations. Arrived in a gorgeous gift box ahead of schedule.', isVerified: true },
        ],
      })
    }

    created++
    if (created % 5 === 0) console.log(`  ... ${created}/${gems.length}`)
  }

  console.log(`\n🎉 Done! Created ${created} new gemstone products (${gems.length - created} already existed)`)
  console.log('\n--- Curated Stones Collection ---')
  console.log('Parent category: curated-stones (id: ' + curatedParent.id + ')')
  for (const [slug, id] of Object.entries(subcategories)) {
    console.log(`  Subcategory: ${slug} (id: ${id})`)
  }
  console.log('\nRun the seed: npx tsx prisma/seed-gemstone-products.ts')

  await db.$disconnect()
}

main().catch(e => { console.error('❌', e); process.exit(1) })
