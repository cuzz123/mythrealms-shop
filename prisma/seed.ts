import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const db = new PrismaClient()

async function main() {
  console.log('Seeding MythRealms database...')
  await db.cartItem.deleteMany(); await db.orderItem.deleteMany(); await db.order.deleteMany()
  await db.review.deleteMany(); await db.variant.deleteMany(); await db.product.deleteMany()
  await db.category.deleteMany(); await db.blogPost.deleteMany(); await db.user.deleteMany()

  const admin = await db.user.create({ data:{ name:'Admin', email:'admin@mythrealms.com', password: await bcrypt.hash('admin123',12), role:'ADMIN' }})

  // 1688 product categories
  const cats = await Promise.all([
    db.category.create({ data:{ name:'The Serenity Collection', slug:'pearl-series', description:'Luminous freshwater and saltwater pearls for emotional balance', sortOrder:1 }}),
    db.category.create({ data:{ name:'The Intention Stones', slug:'luxe-collection', description:'Premium hand-strung bracelets. Each stone holds a singular purpose.', sortOrder:2 }}),
    db.category.create({ data:{ name:'Balance & Light', slug:'pearl-crystal-series', description:'Where pearl meets crystal — pieces for those who hold both at once', sortOrder:3 }}),
    db.category.create({ data:{ name:'The Archetypes', slug:'curated-singles', description:'Six stones. Six intentions. No two alike.', sortOrder:4 }}),
  ])

  // Seed 6 Archetypes as DB products (for the full product page experience)
  const archetypes = cats[3]
  const archetypeProducts = [
    { name:'The Watchman · Bracelet', slug:'curated-singles-01', description:'Black obsidian — the stone of protection. Absorbs what you cannot carry and returns only strength. Hand-strung on elastic cord.', stone:'Black Obsidian', material:'Natural stone, elastic cord', intention:'Protection', isFeatured:true, categoryId:archetypes.id, variants:[{name:'One Size / 16-19cm',price:44.99,stock:15}] },
    { name:'The Heart Opener · Bracelet', slug:'curated-singles-02', description:'Rose quartz — the stone of unconditional self-love. Soft pink, gentle energy. Opens the heart inward and quiets the inner critic.', stone:'Rose Quartz', material:'Natural stone, elastic cord', intention:'Self-Love', isFeatured:true, categoryId:archetypes.id, variants:[{name:'One Size / 16-19cm',price:47.99,stock:12}] },
    { name:'The Seer · Bracelet', slug:'curated-singles-03', description:'Amethyst — the stone of intuition and inner sight. Quiets the noise and lets you hear your own voice.', stone:'Amethyst', material:'Natural stone, elastic cord', intention:'Intuition', isFeatured:true, categoryId:archetypes.id, variants:[{name:'One Size / 16-19cm',price:49.99,stock:10}] },
    { name:'The Phoenix · Bracelet', slug:'curated-singles-04', description:'Moonstone — the stone of new beginnings. New moons, clean slates, and the courage to begin again.', stone:'Moonstone', material:'Natural stone, elastic cord', intention:'Renewal', isFeatured:true, categoryId:archetypes.id, variants:[{name:'One Size / 16-19cm',price:52.99,stock:8}] },
    { name:'The Strategist · Bracelet', slug:'curated-singles-05', description:'Tiger\'s eye — the stone of steady nerve and focused will. Quiet confidence that does not need to announce itself.', stone:'Tiger\'s Eye', material:'Natural stone, elastic cord', intention:'Confidence', isFeatured:true, categoryId:archetypes.id, variants:[{name:'One Size / 16-19cm',price:52.99,stock:10}] },
    { name:'The Lion\'s Share · Bracelet', slug:'curated-singles-06', description:'Green aventurine — the stone of opportunity and abundance. For those ready to receive.', stone:'Green Aventurine', material:'Natural stone, elastic cord', intention:'Abundance', isFeatured:true, categoryId:archetypes.id, variants:[{name:'One Size / 16-19cm',price:54.99,stock:8}] },
  ]

  for (const data of archetypeProducts) {
    const { variants, ...rest } = data
    const minPrice = Math.min(...variants.map((variant) => variant.price))
    const p = await db.product.create({ data: { ...rest, minPrice, variants: { create: variants } } })
    if (data.isFeatured) {
      await db.review.createMany({ data: [
        { productId:p.id, rating:5, content:'Beautiful stone. The intention behind it makes it more than just a bracelet.', isVerified:true },
        { productId:p.id, rating:5, content:'Wear it every day. The quality is excellent and it holds its energy.', isVerified:true },
        { productId:p.id, rating:4, content:'Love the meaning behind each stone. Great conversation starter.', isVerified:true },
      ]})
    }
  }
  console.log(`Created ${archetypeProducts.length} products`)

  const posts = [
    { title:'Crystal Intentions 101: How to Choose Your First Stone', slug:'crystal-intentions-101', excerpt:'Not sure which crystal is calling you? A practical guide to choosing your first intention bracelet based on what you need most right now.', content:'# Crystal Intentions 101\n\nChoosing your first crystal is not about what looks pretty — it is about what you need.\n\n## Start with one question\nWhat do you need most right now? Protection. Clarity. Love. Confidence. Renewal. Abundance. Answer that, and your stone chooses itself.\n\n## The Six Archetypes\n- **The Watchman** (Black Obsidian): For when you need boundaries. Absorption. Protection from energy that is not yours.\n- **The Heart Opener** (Rose Quartz): For when you are learning softness. Self-love that does not need permission.\n- **The Seer** (Amethyst): For when you need to hear your own voice. Intuition. Dreams that arrive fully formed.\n- **The Phoenix** (Moonstone): For new beginnings. The courage to start over. New moons and clean slates.\n- **The Strategist** (Tiger\'s Eye): For confidence. Steady nerve. The quiet decision to trust yourself.\n- **The Lion\'s Share** (Green Aventurine): For abundance. Receiving. Saying yes more than you say no.\n\n## How to wear your intention\nHold the bracelet each morning. Name one thing you are releasing. One thing you are inviting. Put it on. Wear it through your day.', category:'Crystal Wellness', image:'/images/blog/crystal-intentions-101.webp', authorId:admin.id },
    { title:'The Morning Ritual: 3 Minutes That Change Everything', slug:'morning-ritual-crystal-bracelet', excerpt:'How a 3-minute morning practice with your crystal bracelet transforms your entire day — from scattered to grounded, before coffee.', content:'# The Morning Ritual\n\nYou do not need an hour. You do not need a meditation cushion. You need three minutes and one bracelet.\n\n## Minute One: Release\nHold your bracelet in your palm. Close your eyes. Name one thing you are releasing — a worry, a fear, a story that no longer serves you. Say it out loud if you can. Let it go.\n\n## Minute Two: Invite\nName one thing you are inviting — a quality, a shift, a way of being. Calm. Focus. Softness. Courage. Whatever you need today.\n\n## Minute Three: Wear\nPut the bracelet on your left wrist — the receiving side. The stone is now against your skin. When you notice it during the day — a brush against your desk, a glint in the light — let it pull you back to the intention you set.\n\n## Why it works\nThe bracelet is not magic. It is a trigger. Your brain forms associations between physical sensations and mental states. Every time you feel the beads, you remember the intention. Over weeks, the association strengthens. The stone becomes a shortcut to the state you chose.', category:'Rituals', image:'/images/blog/morning-ritual-crystal-bracelet.webp', authorId:admin.id },
    { title:'Black Obsidian: The Stone That Absorbs What You Cannot Carry', slug:'black-obsidian-protection-stone', excerpt:'Black obsidian has been used for protection for thousands of years. Here is what it actually does — and how to work with it.', content:'# Black Obsidian: The Protection Stone\n\nBlack obsidian is volcanic glass. It forms when lava cools so fast that crystals cannot grow. The result is a stone with no crystalline structure — smooth, sharp, and deeply absorptive.\n\n## What obsidian does\nObsidian is believed to absorb negative energy. It acts as a psychic shield — taking in what you cannot carry and returning only strength. This is why it has been used for protection across cultures for millennia.\n\n## Who needs The Watchman\n- You absorb other people\'s emotions without meaning to\n- You feel drained after social situations\n- You carry more than anyone knows\n- You need to set boundaries but struggle to enforce them\n\n## How to use it\nHold The Watchman each morning. Visualize a perimeter around you — a boundary that nothing crosses without your permission. Wear it on your left wrist. When you feel someone\'s energy pressing in, touch the beads. Remember your perimeter.\n\n## Care\nObsidian absorbs. It needs to be cleansed. Run it under cool water once a week. Leave it in moonlight overnight. Let it release what it has taken.', category:'Crystal Wellness', image:'/images/blog/black-obsidian-protection-stone.webp', authorId:admin.id },
    { title:'How to Stack Your Intention Bracelets', slug:'stacking-intention-bracelets', excerpt:'Can you wear more than one intention? Yes — here is how to layer your crystal bracelets for multiple purposes without diluting their energy.', content:'# Stacking Your Intentions\n\nOne bracelet. One intention. That is where most people start. But as you grow, your needs shift. Some days you need protection AND confidence. Some days love AND clarity.\n\n## The rule of three\nThree bracelets maximum on one wrist. More than three becomes visual noise — and the intentions compete rather than complement.\n\n## How to stack\n- **Left wrist (receiving)**: Stones for inner work — self-love, intuition, renewal, abundance\n- **Right wrist (projecting)**: Stones for outer work — protection, confidence, clarity\n\n## Suggested stacks\n- **The Daily Anchor**: The Watchman (protection) + The Strategist (confidence)\n- **The Soft Power**: The Heart Opener (self-love) + The Phoenix (renewal)\n- **The Creator Stack**: The Seer (intuition) + The Lion\'s Share (abundance) + The Creator (clarity)\n- **The Full Circle**: All six. Three on left, three on right. For the days you need everything.\n\n## One thing to remember\nIntentions are not spells. They are reminders. Stack as many as feel true — but no more than that.', category:'Styling', image:'/images/blog/stacking-intention-bracelets.webp', authorId:admin.id },
    { title:'Rose Quartz: The Hardest Stone You Will Ever Wear', slug:'rose-quartz-self-love', excerpt:'Soft pink. Gentle energy. But rose quartz asks the hardest thing of any stone — to love yourself without conditions.', content:'# Rose Quartz: The Hardest Stone\n\nRose quartz is the softest-looking stone in the collection. Pale pink. Gentle. Unassuming. But it asks the hardest thing of any crystal: love yourself without conditions.\n\n## What rose quartz does\nRose quartz does not attract love from others. It attracts love from you — for you. It opens the heart inward. It quiets the inner critic. It softens the voice that says you are not enough.\n\n## Who needs The Heart Opener\n- You are harder on yourself than anyone else\n- You give love freely but struggle to receive it\n- You are learning to let people in again\n- You have been told you are too much or not enough\n\n## A practice\nWear The Heart Opener on your left wrist. Every time you catch yourself in self-criticism, touch the beads. Say: "I am learning. That is enough." The stone will not do the work for you. But it will hold the reminder.\n\n## The paradox\nThe softest stone. The hardest practice. That is rose quartz.', category:'Crystal Wellness', image:'/images/blog/rose-quartz-self-love.webp', authorId:admin.id },
    { title:'Amethyst Benefits: Why People Sleep with This Stone', slug:'amethyst-benefits-sleep-intuition', excerpt:'Amethyst has been used for centuries as a stone of calm and clarity. Discover why people place it on their nightstand and how it supports deeper sleep.', content:'# Amethyst Benefits\n\nAmethyst is not just a pretty purple stone. For thousands of years, cultures from Ancient Greece to Tibet have used it for one specific purpose: quieting the mind.\n\n## Why people sleep with amethyst\n\nAmethyst is associated with the third eye and crown chakras — the energy centers linked to intuition and higher consciousness. Placing amethyst near your bed is believed to:\n- Quiet mental noise before sleep\n- Enhance dream recall and vividness\n- Support intuition and inner clarity\n\n## How to use it\n\nHold your amethyst bracelet in your palm. Take three slow breaths. Say: "I release the thoughts of today. I trust my dreams." Place it on your nightstand or wear it to sleep.\n\n## The Seer Bracelet\n\nOur The Seer bracelet is made with genuine amethyst beads, hand-strung on elastic cord. One size fits most. Wear it to bed or keep it on your nightstand.', category:'Crystal Wellness', image:'/images/blog/amethyst-benefits.webp', authorId:admin.id },
    { title:'How to Cleanse Your Crystal Bracelet: 4 Simple Methods', slug:'how-to-cleanse-crystal-bracelet', excerpt:'Your crystal bracelet absorbs energy all day. Learn four simple ways to cleanse and recharge your stones — no special tools required.', content:'# How to Cleanse Your Crystal Bracelet\n\nCrystals are absorbent. They take in the energy around them — yours, other people\'s, the room\'s. Over time, they need to release what they have collected. This is called cleansing.\n\n## Method 1: Running Water\n\nHold your bracelet under cool running water for 30 seconds. Visualize the energy washing away. Best for black obsidian, amethyst, clear quartz. Skip for moonstone and pearls.\n\n## Method 2: Moonlight\n\nPlace your bracelet on a windowsill during a full moon. The moonlight recharges stones with gentle, feminine energy. Best for all stones, especially moonstone and rose quartz.\n\n## Method 3: Sage Smoke\n\nLight a sage bundle. Hold your bracelet in the smoke for about one minute, turning slowly. One of the oldest cleansing rituals in the world.\n\n## Method 4: Selenite Plate\n\nPlace your bracelet on a selenite plate. Selenite is self-cleansing and continuously recharges other stones. The set-it-and-forget-it method.\n\n## How often?\n\nDaily wear: once a week. Occasional wear: once a month. After a stressful day: cleanse that night.', category:'Rituals', image:'/images/blog/cleanse-crystal-bracelet.webp', authorId:admin.id },
  ]
  for (const post of posts) { await db.blogPost.create({ data: post }) }
  console.log(`Created ${posts.length} blog posts`)

  // Seed discount codes
  await db.discountCode.upsert({
    where: { code: 'MYTH15' },
    update: {},
    create: {
      code: 'MYTH15',
      type: 'percentage',
      value: 15,
      label: '15% Off Your First Order',
      description: 'Welcome offer for new customers — 15% off your first purchase.',
      minSubtotal: 0,
      maxUses: 0,
      firstOrderOnly: true,
      isActive: true,
    },
  })
  console.log('Seeded discount code: MYTH15')
  console.log('MythRealms seed complete!')
}
main().catch(e => { console.error('Seed error:', e); process.exit(1) }).finally(() => db.$disconnect())
