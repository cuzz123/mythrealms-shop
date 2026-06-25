import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

/**
 * Seed script for gemstone-focused blog posts.
 * Run via: npx tsx prisma/seed-blog-posts.ts
 *
 * Creates 3 posts about styling, crystal meanings, and natural vs synthetic stones.
 */

const IMG_BASE = '/images/1688-hero'

async function main() {
  console.log('Seeding gemstone blog posts...')

  // Delete existing posts with these slugs to make the script idempotent
  const slugs = [
    'how-to-style-gemstone-bracelets',
    'crystal-meanings-beginners-guide',
    'natural-stones-vs-synthetic',
  ]
  await db.blogPost.deleteMany({ where: { slug: { in: slugs } } })

  const posts = [
    {
      title: 'How to Style Gemstone Bracelets for Every Occasion',
      slug: 'how-to-style-gemstone-bracelets',
      excerpt:
        'Master the art of stacking, layering, and pairing gemstone bracelets — from casual brunch looks to formal evening elegance.',
      content: `# How to Style Gemstone Bracelets for Every Occasion

Gemstone bracelets are more than accessories — they are wearable intention. But how do you style them so they complement your outfit without overwhelming it? Here is your complete guide.

## The Art of Stacking

Stacking is the easiest way to make a statement. Start with a foundation piece — a neutral-toned bracelet like moonstone or hematite. Then add one or two accent bracelets in complementary colors. For example, a deep green jade bracelet pairs beautifully with warm citrine, creating a grounded-yet-radiant contrast.

A good rule of thumb: odd numbers look better than even. Three or five bracelets create visual rhythm. Two can look like an afterthought. And always vary the bead sizes — mixing chunky stones with delicate strands adds depth and keeps the stack from looking uniform.

## Layering with Watches

Yes, you can wear a gemstone bracelet alongside a watch. The key is balance. If your watch has a metal band, add one or two stone bracelets on the opposite wrist to avoid scratching. If your watch has a leather strap, you can stack a single slim bead bracelet directly next to it on the same wrist — it adds warmth without competing for attention.

## Casual vs Formal

For casual daytime looks, lean into earthy tones: tiger's eye, lava stone, or unpolished amethyst. These stones feel grounded and effortless with linen, denim, and cotton.

For formal occasions, reach for polished, lustrous stones: lapis lazuli, garnet, or rose quartz. Their smooth finish catches the light beautifully under candlelight or evening lighting. A single standout bracelet can replace a watch entirely — it is jewelry, not just an accessory.

## Seasonal Styling

In spring and summer, lighter stones like aquamarine, moonstone, and rose quartz feel fresh and airy against bare skin. In autumn and winter, deeper tones — obsidian, garnet, smoky quartz — echo the season's richness and pair beautifully with sweaters and long sleeves.

There are no hard rules. The best styling choice is the one that makes you feel like yourself. Trust your eye, experiment freely, and let your bracelets tell your story.`,
      category: 'Style Guide',
      image: `${IMG_BASE}/单品6.png`,
    },
    {
      title: "A Beginner's Guide to Crystal Meanings",
      slug: 'crystal-meanings-beginners-guide',
      excerpt:
        'Explore the meanings behind five essential gemstones — from amethyst clarity to tiger\'s eye confidence — and find the stone that speaks to you.',
      content: `# A Beginner's Guide to Crystal Meanings

Every stone carries a story. Across cultures and centuries, gemstones have been valued not just for their beauty, but for the qualities they are believed to embody. Whether you are drawn to a particular color, attracted to a stone's energy, or simply curious — here is a beginner-friendly guide to five essential crystals and what they represent.

## Amethyst — Clarity and Calm

Amethyst is the stone of clarity. Its violet hues have been associated with mental focus, spiritual awareness, and emotional balance for thousands of years. Ancient Greeks believed amethyst could prevent intoxication — the word itself comes from the Greek *amethystos*, meaning "not drunk."

Today, amethyst is worn by people seeking calm in a chaotic world. It is a favorite of meditators, creatives, and anyone who wants to quiet the noise and think clearly. Place it on your desk, wear it on your wrist, or hold it during moments of stress.

## Rose Quartz — Unconditional Love

Rose quartz is the stone of the heart. Its soft pink glow has made it the definitive symbol of love — not just romantic love, but self-love, friendship, and compassion. In many traditions, rose quartz is given as a gift to new mothers, newlyweds, and anyone embarking on a journey of emotional healing.

Wearing rose quartz is a reminder to be gentle with yourself. It is especially powerful during times of grief, transition, or self-discovery. Pair it with amethyst for a combination of clarity and compassion.

## Obsidian — Protection and Grounding

Obsidian is volcanic glass — born from fire, cooled in an instant. It is one of the most protective stones in the crystal world, believed to shield against negativity and ground its wearer in the present moment.

Historically, obsidian was used for tools, weapons, and mirrors. Its reflective surface was thought to reveal hidden truths. Today, obsidian bracelets are worn by people who want to feel rooted, protected, and steady — a good choice if you are going through a difficult period or working in high-pressure environments.

## Moonstone — Intuition and Mystery

Moonstone shimmers with an ethereal blue-white light called adularescence. It has been associated with the moon, intuition, and the divine feminine for millennia. In India, moonstone is considered sacred and is often given as a wedding gift.

Moonstone is the stone of new beginnings. It is said to enhance intuition, making it popular among artists, writers, and anyone navigating a creative or emotional crossroads. Wear it when you need to trust your gut.

## Tiger's Eye — Confidence and Courage

Tiger's eye is unmistakable: golden-brown bands that catch the light like a predator's gaze. It is the stone of confidence, courage, and personal power. Roman soldiers carried tiger's eye into battle for protection and bravery.

In modern crystal practice, tiger's eye is worn to build self-esteem, overcome fear, and take decisive action. If you are preparing for a big presentation, a difficult conversation, or a new chapter in your life, tiger's eye is your ally.

## How to Choose Your Stone

You do not need to overthink it. The stone you are repeatedly drawn to — the one whose color, texture, or name keeps catching your attention — is often the one you need. Trust your instincts. That is the whole point.`,
      category: 'Style Guide',
      image: `${IMG_BASE}/单品4.png`,
    },
    {
      title: 'Why Natural Stones Are Better Than Synthetic',
      slug: 'natural-stones-vs-synthetic',
      excerpt:
        'Natural gemstones carry character, history, and energy that synthetics cannot replicate. Here is why authenticity matters.',
      content: `# Why Natural Stones Are Better Than Synthetic

In a world of mass production, natural gemstones stand apart. Each one is the product of millions of years of geological history — formed deep within the earth, shaped by heat and pressure, and brought to the surface through forces we can only imagine. No two natural stones are exactly alike, and that is precisely the point.

## Every Stone is Unique

Synthetic stones are manufactured in laboratories to be identical. They are flawless, uniform, and predictable — but they have no story. A natural amethyst carries the fingerprint of the cave where it grew. A natural piece of jade bears the subtle color shifts that tell you it came from a specific riverbed in a specific mountain range. These variations are not imperfections. They are proof of origin.

When you hold a natural stone, you are holding something that has never existed before and will never exist again. That is a kind of magic no factory can replicate.

## Ethical Sourcing Matters

Natural stones connect you to the earth — but only if they are sourced responsibly. At MythRealms, every stone is hand-selected from suppliers who guarantee fair labor practices and environmentally conscious extraction. We know where each stone comes from, who shaped it, and the path it traveled to reach you.

Synthetic stones may seem like the ethical choice at first glance — no mining, no environmental impact. But the reality is more complicated. Lab-grown crystals require significant energy input, chemical processes, and industrial infrastructure. The question is not as simple as "natural versus synthetic." The better question is: was this stone sourced with care for the people who handled it and the land it came from?

## The Energy Distinction

For those who work with crystal energy — and this tradition spans thousands of years across dozens of cultures — natural stones are irreplaceable. The belief is that a stone formed over millions of years in the earth carries the energy of that process: patience, transformation, resilience. A lab-grown stone, created in weeks, has no such history.

You do not need to subscribe to crystal metaphysics to appreciate the difference. Even from a purely aesthetic perspective, natural stones possess a depth and warmth that synthetics lack. The light moves through them differently. They feel different in your hand. They age differently. They become more beautiful with time, not less.

## Choosing What Matters

None of this is to say synthetic stones have no place. They make gemstones accessible to more people, and they have important industrial and technological applications. But when you are choosing a piece of jewelry you intend to wear every day — something that will sit against your skin, mark a milestone, or carry a personal intention — natural is worth it.

You are not buying a bracelet. You are choosing a stone that was formed before humans walked the earth and will outlast everything we build. That is worth the investment.`,
      category: 'Style Guide',
      image: `${IMG_BASE}/单品5.png`,
    },
  ]

  for (const post of posts) {
    await db.blogPost.create({ data: post })
    console.log(`  Created: ${post.title}`)
  }

  console.log(`\nSeeded ${posts.length} gemstone blog posts.`)
}

main()
  .catch((e) => {
    console.error('Seed error:', e)
    process.exit(1)
  })
  .finally(() => db.$disconnect())
