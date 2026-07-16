// Seed script: Add Curated Stones category and gemstone bracelet products
// Safe to run on production DB — uses upsert for categories
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

const IMG_BASE = '/images/products'
const P = (name: string) => `${IMG_BASE}/${name}.png`

async function main() {
  console.log('Seeding Curated Stones collection...')

  // Create the Curated Stones category
  const curatedCat = await db.category.upsert({
    where: { slug: 'curated-stones' },
    update: {
      name: 'Curated Stones',
      description: 'Every stone tells a story. From the deep purple of amethyst to the soft blush of rose quartz — find the crystal that speaks to you.',
      sortOrder: 0,
    },
    create: {
      name: 'Curated Stones',
      slug: 'curated-stones',
      description: 'Every stone tells a story. From the deep purple of amethyst to the soft blush of rose quartz — find the crystal that speaks to you.',
      sortOrder: 0,
    },
  })
  console.log(`  OK category: ${curatedCat.name}`)

  const products = [
    {
      name: 'Amethyst Serenity Bracelet',
      slug: 'amethyst-serenity-bracelet',
      description: 'Deep purple amethyst beads hand-knotted on black silk cord. Each bead is hand-selected for clarity and color depth. Amethyst has been prized since ancient Greece, where it was believed to prevent intoxication and sharpen the mind. Today, it is the stone of clarity — ideal for meditation, focus, and quieting a busy mind.',
      details: JSON.stringify({
        stoneProperties: [
          { stone: 'Amethyst', benefit: 'Clarity, intuition, and spiritual protection. Calms the mind and opens the third eye.' }
        ],
        specs: { itemType: 'Beaded Bracelet', material: 'Amethyst, Silk Cord, Gold-Plated Spacer', beadSize: '8mm', length: '16-18cm adjustable' }
      }),
      images: JSON.stringify([P('bf-bracelet'), P('ml-full')]),
      stone: 'Amethyst',
      material: 'Amethyst & Silk',
      intention: 'Clarity & Intuition',
      isFeatured: true,
      comparePrice: 68.00,
      categoryId: curatedCat.id,
      variants: [{ name: 'Amethyst / 16-18cm', price: 49.99, stock: 10 }],
    },
    {
      name: 'Rose Quartz Heart Bracelet',
      slug: 'rose-quartz-heart-bracelet',
      description: 'Soft blush rose quartz beads on rose gold-plated wire. The stone of unconditional love — not just romantic, but self-love, compassion, and the courage to keep your heart open. Ancient Egyptians carved rose quartz into face masks to preserve youth, believing the stone carried the energy of the goddess Isis.',
      details: JSON.stringify({
        stoneProperties: [
          { stone: 'Rose Quartz', benefit: 'Love, compassion, and emotional healing. Opens the heart chakra and restores trust.' }
        ],
        specs: { itemType: 'Beaded Bracelet', material: 'Rose Quartz, Rose Gold-Plated Wire', beadSize: '8mm', length: '16-18cm adjustable' }
      }),
      images: JSON.stringify([P('op-aquamarine'), P('fl-lotus')]),
      stone: 'Rose Quartz',
      material: 'Rose Quartz & Gold',
      intention: 'Love & Healing',
      isFeatured: true,
      comparePrice: 62.00,
      categoryId: curatedCat.id,
      variants: [{ name: 'Rose Quartz / 16-18cm', price: 45.99, stock: 8 }],
    },
    {
      name: 'Black Obsidian Shield Bracelet',
      slug: 'obsidian-shield-bracelet',
      description: 'Volcanic glass formed when lava cools so fast it cannot crystallize. Black obsidian has been used for protection since the Stone Age, when it was knapped into blades, mirrors, and talismans. This bracelet features matte-finished obsidian beads on black leather cord with silver spacers — a grounding, protective piece for everyday wear.',
      details: JSON.stringify({
        stoneProperties: [
          { stone: 'Black Obsidian', benefit: 'Protection, grounding, and truth. Absorbs negative energy and reveals what is hidden.' }
        ],
        specs: { itemType: 'Beaded Bracelet', material: 'Black Obsidian, Leather Cord, Silver Spacer', beadSize: '10mm', length: '16-18cm adjustable' }
      }),
      images: JSON.stringify([P('black-tortoise'), P('cs-constellation')]),
      stone: 'Black Obsidian',
      material: 'Obsidian & Leather',
      intention: 'Protection & Grounding',
      isFeatured: true,
      comparePrice: 58.00,
      categoryId: curatedCat.id,
      variants: [{ name: 'Obsidian / 16-18cm', price: 42.99, stock: 12 }],
    },
    {
      name: 'Moonstone Lumina Bracelet',
      slug: 'moonstone-lumina-bracelet',
      description: 'Moonstone beads with an ethereal blue flash — the adularescence effect that seems to glow from within. In ancient Rome, moonstone was believed to be formed from solidified moonlight. It is the stone of new beginnings, intuition, and the divine feminine. Strung on silver wire with tiny star charms between each bead.',
      details: JSON.stringify({
        stoneProperties: [
          { stone: 'Moonstone', benefit: 'New beginnings, intuition, and inner growth. Aligns with lunar cycles and the divine feminine.' }
        ],
        specs: { itemType: 'Beaded Bracelet', material: 'Moonstone, Silver Wire, Sterling Silver Charms', beadSize: '6mm', length: '16-18cm adjustable' }
      }),
      images: JSON.stringify([P('ml-full'), P('bf-bracelet')]),
      stone: 'Moonstone',
      material: 'Moonstone & Silver',
      intention: 'Intuition & New Beginnings',
      isFeatured: true,
      comparePrice: 72.00,
      categoryId: curatedCat.id,
      variants: [{ name: 'Moonstone / 16-18cm', price: 54.99, stock: 6 }],
    },
    {
      name: "Tiger's Eye Confidence Bracelet",
      slug: 'tigers-eye-confidence-bracelet',
      description: "Golden-brown tiger's eye beads with characteristic chatoyancy — the shifting bands of light that move like a cat's eye. Roman soldiers wore tiger's eye into battle for courage. In Chinese tradition, it is a stone of prosperity and balanced power. This bracelet pairs warm tiger's eye with antique brass spacers on a durable cord.",
      details: JSON.stringify({
        stoneProperties: [
          { stone: "Tiger's Eye", benefit: 'Confidence, courage, and grounded prosperity. Balances extremes and sharpens focus.' }
        ],
        specs: { itemType: 'Beaded Bracelet', material: "Tiger's Eye, Brass Spacers, Nylon Cord", beadSize: '8mm', length: '16-18cm adjustable' }
      }),
      images: JSON.stringify([P('m5-water'), P('m5-wood')]),
      stone: "Tiger's Eye",
      material: "Tiger's Eye & Brass",
      intention: 'Confidence & Prosperity',
      isFeatured: true,
      comparePrice: 65.00,
      categoryId: curatedCat.id,
      variants: [{ name: "Tiger's Eye / 16-18cm", price: 47.99, stock: 9 }],
    },
  ]

  for (const data of products) {
    const { variants, ...rest } = data
    const minPrice = Math.min(...variants.map((variant) => variant.price))
    const existing = await db.product.findUnique({ where: { slug: data.slug } })
    if (existing) {
      await db.product.update({ where: { slug: data.slug }, data: { ...rest, minPrice } })
      console.log(`  UPDATED: ${data.name}`)
    } else {
      await db.product.create({ data: { ...rest, minPrice, variants: { create: variants } } })
      console.log(`  CREATED: ${data.name}`)
    }
  }

  console.log(`\nCurated Stones seed complete! ${products.length} products.`)
  await db.$disconnect()
}

main().catch((e) => {
  console.error('Seed error:', e)
  process.exit(1)
})
