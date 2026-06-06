import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'
const db = new PrismaClient()

// All product images are now CSS-gradient generated via ProductImage component.
// Empty string triggers the gradient fallback.
const IMG = {
  ninefox:    '/images/products/nine-tailed-fox.png',
  qilin:      '/images/products/qilin.png',
  azuredragon:'/images/products/azure-dragon.png',
  phoenix:    '/images/products/phoenix.png',
  whitetiger: '/images/products/white-tiger.png',
  blacktortoise:'/images/products/black-tortoise.png',
  baize:      '/images/products/bai-ze.png',
  kunpeng:    '/images/products/kun-peng.png',
  fourset:    '/images/products/four-symbols-set.png',
  mansions:   '/images/products/28-mansions-scroll.png',
  taotie:     '/images/products/taotie.png',
  yinglong:   '/images/products/yinglong.png',
  fallback:   '/images/products/nine-tailed-fox.png',
  ninefox_d:  '/images/products/ninefox_detail.png',
  ninefox_w:  '/images/products/ninefox_wear.png',
  ninefox_s:  '/images/products/ninefox_scene.png',
  qilin_d:    '/images/products/qilin_detail.png',
  qilin_w:    '/images/products/qilin_wear.png',
  qilin_s:    '/images/products/qilin_scene.png',
  dragon_d:   '/images/products/dragon_detail.png',
  dragon_w:   '/images/products/dragon_wear.png',
  dragon_s:   '/images/products/dragon_scene.png',
  phoenix_d:  '/images/products/phoenix_detail.png',
  phoenix_w:  '/images/products/phoenix_wear.png',
  phoenix_s:  '/images/products/phoenix_scene.png',
  tiger_d:    '/images/products/tiger_detail.png',
  tiger_w:    '/images/products/tiger_wear.png',
  tiger_s:    '/images/products/tiger_scene.png',
  tortoise_d: '/images/products/tortoise_detail.png',
  tortoise_w: '/images/products/tortoise_wear.png',
  tortoise_s: '/images/products/tortoise_scene.png',
  baize_d:    '/images/products/baize_detail.png',
  baize_w:    '/images/products/baize_wear.png',
  baize_s:    '/images/products/baize_scene.png',
  kunpeng_d:  '/images/products/kunpeng_detail.png',
  kunpeng_w:  '/images/products/kunpeng_wear.png',
  kunpeng_s:  '/images/products/kunpeng_scene.png',
  fourset_d:  '/images/products/fourset_detail.png',
  fourset_w:  '/images/products/fourset_wear.png',
  fourset_s:  '/images/products/fourset_scene.png',
  star_d:     '/images/products/star_detail.png',
  star_w:     '/images/products/star_wear.png',
  star_s:     '/images/products/star_scene.png',
  taotie_d:   '/images/products/taotie_detail.png',
  taotie_w:   '/images/products/taotie_wear.png',
  taotie_s:   '/images/products/taotie_scene.png',
  yinglong_d: '/images/products/yinglong_detail.png',
  yinglong_w: '/images/products/yinglong_wear.png',
  yinglong_s: '/images/products/yinglong_scene.png',
}
const CAT = {
  beasts:      '/images/categories/beast-pendants.png',
  stars:       '/images/categories/star-bracelets.png',
  foursymbols: '/images/categories/four-symbols.png',
  talismans:   '/images/categories/talismans.png',
  constart:    '/images/categories/constellation-art.png',
  mythdecor:   '/images/categories/mythic-decor.png',
}

async function main() {
  console.log('Seeding MythRealms database...')
  await db.cartItem.deleteMany(); await db.orderItem.deleteMany(); await db.order.deleteMany()
  await db.review.deleteMany(); await db.variant.deleteMany(); await db.product.deleteMany()
  await db.category.deleteMany(); await db.blogPost.deleteMany(); await db.user.deleteMany()

  const admin = await db.user.create({ data:{ name:'Admin', email:'admin@mythrealms.com', password: await bcrypt.hash('admin123',12), role:'ADMIN' }})
  const cats = await Promise.all([
    db.category.create({ data:{ name:'Beast Pendants · 神兽吊坠', slug:'beast-pendants', description:'Pendants inspired by the mythical beasts of Shan Hai Jing.', image:CAT.beasts, sortOrder:1 }}),
    db.category.create({ data:{ name:'Star Bracelets · 星宿手串', slug:'star-bracelets', description:'Bracelets aligned with the Chinese constellation system.', image:CAT.stars, sortOrder:2 }}),
    db.category.create({ data:{ name:'Four Symbols · 四象', slug:'four-symbols', description:'Azure Dragon, Vermillion Bird, White Tiger, Black Tortoise.', image:CAT.foursymbols, sortOrder:3 }}),
    db.category.create({ data:{ name:'Ancient Talismans · 上古护符', slug:'talismans', description:'Protective talismans from ancient Chinese lore.', image:CAT.beasts, sortOrder:4 }}),
    db.category.create({ data:{ name:'Constellation Art · 星图', slug:'constellation-art', description:'Star maps and celestial artwork of the 28 Mansions.', image:CAT.stars, sortOrder:5 }}),
    db.category.create({ data:{ name:'Mythic Decor · 神话摆件', slug:'mythic-decor', description:'Decorative pieces inspired by Shan Hai Jing legends.', image:CAT.foursymbols, sortOrder:6 }}),
  ])
  const bc = cats[0]

  const prods = [
    { name:'Nine-Tailed Fox · 九尾狐 — Sterling Silver Pendant', slug:'nine-tailed-fox-pendant', description:'She was called a demon. A seductress. A bad omen. But the Classic of Mountains and Seas tells a different story: she only appeared when peace was coming. If you\'ve ever been misunderstood, if you\'ve ever been told you\'re too much or not enough — this is your guardian. Sterling silver. 925. Handcrafted.', details:JSON.stringify({beastProperties:[{beast:'Nine-Tailed Fox',benefit:'Wisdom, charm, transformation'}],specs:{itemType:'Pendant',material:'925 Sterling Silver'}}), comparePrice:72.00, images:JSON.stringify([IMG.ninefox, IMG.ninefox_d, IMG.ninefox_w, IMG.ninefox_s]), stone:'Silver',material:'925 Sterling Silver',intention:'Wisdom & Transformation',isFeatured:true,categoryId:bc.id, variants:[{name:'Silver / 45cm chain',price:54.99,stock:6}] },
    { name:'Qilin · 麒麟 — Jade Protection Bracelet', slug:'qilin-protection-bracelet', description:'500 years before the unicorn was dreamed into being, the Qilin walked the earth. It refused to step on living grass. It appeared only when a just ruler took the throne. Confucius\' mother saw one. Then gave birth to the wisest man in history. You choose peace when everyone around you fights. This jade-and-bronze bracelet is your reminder that peace is not weakness — it\'s the rarest form of power.', details:JSON.stringify({beastProperties:[{beast:'Qilin',benefit:'Peace, protection, justice'}],specs:{itemType:'Beaded Bracelet',material:'Jade & Bronze'}}), comparePrice:68.00, images:JSON.stringify([IMG.qilin, IMG.qilin_d, IMG.qilin_w, IMG.qilin_s]), stone:'Jade',material:'Jade & Bronze',intention:'Peace & Protection',isFeatured:true,categoryId:bc.id, variants:[{name:'Jade / 16-18cm',price:49.99,stock:5}] },
    { name:'Azure Dragon · 青龙 — Constellation Ring Set', slug:'azure-dragon-ring', description:'He rules the eastern sky. Seven constellations bow to him. Spring begins when he breathes. But the Azure Dragon has not been seen in 800 years — because he chose to guard the horizon alone rather than ask for help. If you\'ve ever been the one everyone leans on, the one who carries it all in silence — this ring is for you. 925 silver. Engraved with his constellation.', details:JSON.stringify({beastProperties:[{beast:'Azure Dragon',benefit:'Power, protection, vitality'}],specs:{itemType:'Ring',material:'925 Silver'}}), comparePrice:58.00, images:JSON.stringify([IMG.azuredragon, IMG.dragon_d, IMG.dragon_w, IMG.dragon_s]), stone:'Silver',material:'925 Silver',intention:'Power & Vitality',isFeatured:true,categoryId:bc.id, variants:[{name:'Silver / Size 7',price:42.99,stock:8}] },
    { name:'Phoenix · 凤凰 — Vermillion Bird Rebirth Necklace', slug:'phoenix-rebirth-necklace', description:'She did not fall. She burned. Not as a tragedy — as a choice. Because the old version of her could not hold what was coming. The Phoenix of the South does not wait for permission to rise. If you\'ve ever had to burn your old life to the ground and start over — you already know her. Gold-plated. Vermillion crystals. Wear her and remember: every ending is fuel.', details:JSON.stringify({beastProperties:[{beast:'Phoenix',benefit:'Rebirth, renewal, passion'}],specs:{itemType:'Pendant Necklace',material:'Gold-plated & Crystal'}}), comparePrice:82.00, images:JSON.stringify([IMG.phoenix, IMG.phoenix_d, IMG.phoenix_w, IMG.phoenix_s]), stone:'Crystal',material:'Gold-plated & Crystal',intention:'Rebirth & Renewal',isFeatured:true,categoryId:bc.id, variants:[{name:'Gold / 45cm chain',price:62.99,stock:4}] },
    { name:'White Tiger · 白虎 — Guardian Cuff Bracelet', slug:'white-tiger-guardian-cuff', description:'He has guarded the western sky for 2000 years. Alone. In the snow. He does not ask for thanks. He does not seek recognition. He protects because it is who he is. If you have ever been the one holding the line while everyone else slept — the White Tiger sees you. Wide silver cuff. Embossed. Adjustable. Wear him on your wrist and remember: you are someone\'s guardian too.', details:JSON.stringify({beastProperties:[{beast:'White Tiger',benefit:'Courage, strength, guardianship'}],specs:{itemType:'Cuff Bracelet',material:'925 Silver'}}), comparePrice:65.00, images:JSON.stringify([IMG.whitetiger, IMG.tiger_d, IMG.tiger_w, IMG.tiger_s]), stone:'Silver',material:'925 Silver',intention:'Courage & Strength',isFeatured:true,categoryId:bc.id, variants:[{name:'Silver / Adjustable',price:48.99,stock:5}] },
    { name:'Black Tortoise · 玄武 — Endurance Stone Bracelet', slug:'black-tortoise-endurance-bracelet', description:'The Black Tortoise has been holding up the sky for two millennia. It does not complain. It does not falter. It does not ask how much longer. If you have ever been the one who just kept going when everyone else stopped — you already know this beast. Black onyx and hematite. Heavy. Grounded. Unbreakable. Just like you.', details:JSON.stringify({beastProperties:[{beast:'Black Tortoise',benefit:'Endurance, longevity, stability'}],specs:{itemType:'Beaded Bracelet',material:'Onyx & Hematite'}}), comparePrice:54.00, images:JSON.stringify([IMG.blacktortoise, IMG.tortoise_d, IMG.tortoise_w, IMG.tortoise_s]), stone:'Onyx',material:'Onyx & Hematite',intention:'Endurance & Stability',isFeatured:true,categoryId:bc.id, variants:[{name:'Black / 16-18cm',price:39.99,stock:10}] },
    { name:'Bai Ze · 白泽 — Wisdom & Knowledge Talisman', slug:'bai-ze-wisdom-talisman', description:'He knows 11,520 species of supernatural creatures. Every mountain. Every river. Every ghost and god. The Yellow Emperor begged him for his knowledge. Bai Ze gave it freely — because wisdom shared is wisdom multiplied. If you see things others miss, if your intuition has always been your sharpest weapon — Bai Ze is your guardian. Antiqued silver. Leather cord. Ancient protection for a modern mind.', details:JSON.stringify({beastProperties:[{beast:'Bai Ze',benefit:'Knowledge, wisdom, protection from evil'}],specs:{itemType:'Talisman Pendant',material:'Antiqued Silver'}}), comparePrice:48.00, images:JSON.stringify([IMG.baize, IMG.baize_d, IMG.baize_w, IMG.baize_s]), stone:'Silver',material:'Antiqued Silver',intention:'Wisdom & Knowledge',isFeatured:false,categoryId:bc.id, variants:[{name:'Silver / Leather cord',price:35.99,stock:8}] },
    { name:'Kun Peng · 鲲鹏 — Transformation Pendant Set', slug:'kun-peng-transformation-set', description:'In the northern ocean lives a fish named Kun. Thousands of miles wide. And one day — it becomes a bird. Wings that stretch from horizon to horizon. The Kun Peng is not a myth. It is a promise. That you are not stuck. That the version of you that exists today is not the final form. If you are in the middle of becoming — this dual pendant set is yours. Bronze and silver. Fish and bird. Who you were and who you will be.', details:JSON.stringify({beastProperties:[{beast:'Kun Peng',benefit:'Transformation, ambition, limitless potential'}],specs:{itemType:'Dual Pendant Set',material:'Bronze & Silver'}}), comparePrice:78.00, images:JSON.stringify([IMG.kunpeng, IMG.kunpeng_d, IMG.kunpeng_w, IMG.kunpeng_s]), stone:'Bronze',material:'Bronze & Silver',intention:'Transformation & Potential',isFeatured:true,categoryId:bc.id, variants:[{name:'Bronze/Silver / 50cm chain',price:58.99,stock:3}] },
    { name:'Four Symbols · 四象 — Complete Guardian Collection', slug:'four-symbols-complete-collection', description:'Four directions. Four guardians. 2000 years of protection. Azure Dragon of the East. Vermillion Bird of the South. White Tiger of the West. Black Tortoise of the North. Together, they hold the sky in place. Some people carry one guardian. You were born to carry all four. Complete ring set. 925 silver and bronze. One for each direction of your life.', details:JSON.stringify({beastProperties:[{beast:'Four Symbols',benefit:'Complete directional protection'}],specs:{itemType:'Ring Set (4pc)',material:'925 Silver & Bronze'}}), comparePrice:185.00, images:JSON.stringify([IMG.fourset, IMG.fourset_d, IMG.fourset_w, IMG.fourset_s]), stone:'Multi',material:'Silver & Bronze',intention:'Complete Protection',isFeatured:true,categoryId:bc.id, variants:[{name:'Set of 4 / Various sizes',price:139.99,stock:2}] },
    { name:'Twenty-Eight Mansions · 二十八宿 — Star Map Wall Scroll', slug:'28-mansions-star-map-scroll', description:'Long before Western astrology divided the sky into 12 signs, the Chinese mapped it into 28 lunar mansions. Each mansion guards a different destiny. Each star tells a different story. This silk wall scroll contains all 28 — hung in meditation rooms, studies, and sacred spaces across the world. Find your mansion. Find your place in the universe.', details:JSON.stringify({beastProperties:[{beast:'28 Mansions',benefit:'Cosmic harmony, celestial guidance'}],specs:{itemType:'Wall Scroll',material:'Silk'}}), comparePrice:65.00, images:JSON.stringify([IMG.mansions, IMG.star_d, IMG.star_w, IMG.star_s]), stone:'Silk',material:'Silk',intention:'Cosmic Harmony',isFeatured:true,categoryId:bc.id, variants:[{name:'Medium / 40x80cm',price:48.99,stock:6}] },
    { name:'Taotie · 饕餮 — Ancient Bronze Amulet', slug:'taotie-bronze-amulet', description:'The most feared face in ancient China. Cast into bronze vessels. Stamped onto weapons of kings. The Taotie is not a monster — it is a warning. Greed devours everything. The Taotie reminds us to take what we need and leave what we must. If you have ever struggled to say "enough," if you have ever wanted more but needed less — wear this amulet. Bronze. Heavy. Ancient. A guardian against excess.', details:JSON.stringify({beastProperties:[{beast:'Taotie',benefit:'Protection from greed, strength'}],specs:{itemType:'Amulet',material:'Bronze'}}), comparePrice:52.00, images:JSON.stringify([IMG.taotie, IMG.taotie_d, IMG.taotie_w, IMG.taotie_s]), stone:'Bronze',material:'Bronze',intention:'Protection & Strength',isFeatured:false,categoryId:bc.id, variants:[{name:'Bronze / Leather cord',price:38.99,stock:7}] },
    { name:'Yinglong · 应龙 — Winged Dragon Cufflinks', slug:'yinglong-winged-dragon-cufflinks', description:'All dragons command respect. Only one commands the sky. The Yinglong is the only dragon in Chinese mythology with wings. He helped the Yellow Emperor defeat the demon Chi You. He carved rivers into the earth. When he flies, kings kneel. When he roars, heaven answers. If you are destined for something greater — these bronze cufflinks are your seal. Power. Authority. Divine favor. Wear them.', details:JSON.stringify({beastProperties:[{beast:'Yinglong',benefit:'Power, authority, divine favor'}],specs:{itemType:'Cufflinks (Pair)',material:'Bronze'}}), comparePrice:45.00, images:JSON.stringify([IMG.yinglong, IMG.yinglong_d, IMG.yinglong_w, IMG.yinglong_s]), stone:'Bronze',material:'Bronze',intention:'Power & Authority',isFeatured:false,categoryId:bc.id, variants:[{name:'Bronze / Standard',price:32.99,stock:12}] },
  ]

  for (const data of prods) {
    const { variants, ...rest } = data
    const p = await db.product.create({ data: { ...rest, variants: { create: variants } } })
    if (data.isFeatured) {
      await db.review.createMany({ data: [
        { productId:p.id, rating:5, content:'Absolutely stunning piece. The craftsmanship captures the ancient legend beautifully.', images:JSON.stringify([JSON.parse(data.images)[0]]), isVerified:true },
        { productId:p.id, rating:5, content:'As a mythology lover, this exceeded my expectations. The details are incredible.', isVerified:true },
        { productId:p.id, rating:4, content:'Beautiful design. The story card that comes with it really brings the myth to life.', isVerified:true },
      ]})
    }
  }
  console.log(`Created ${prods.length} products`)

  const posts = [
    { title:'The Classic of Mountains and Seas: China\'s Oldest Book of Legends', slug:'classic-of-mountains-and-seas', excerpt:'Discover the Shan Hai Jing, a 2,000-year-old encyclopedia of mythical beasts that inspired Chinese art and storytelling for millennia.', content:'# The Classic of Mountains and Seas\n\nComposed over 2,000 years ago during the Warring States period, the Shan Hai Jing (山海经) is China\'s oldest and most comprehensive bestiary.\n\n## What It Contains\n- Descriptions of over 200 mythical beasts\n- Maps of mythical mountains and seas\n- Ancient geography and cosmology\n- Tales of gods, spirits, and legendary rulers\n\n## Why It Matters\nThis text is the foundation of Chinese mythology — predating Tolkien by two millennia.', category:'Mythology', image:IMG.ninefox, authorId:admin.id },
    { title:'The Four Symbols: Guardians of the Chinese Sky', slug:'four-symbols-guardians', excerpt:'Azure Dragon, Vermillion Bird, White Tiger, and Black Tortoise — meet the celestial guardians that rule the four quadrants of the Chinese sky.', content:'# The Four Symbols\n\nThe Four Symbols (四象) are the guardians of the four cardinal directions and quadrants of the sky.\n\n## Azure Dragon — East\nGuardian of spring, ruler of the 7 eastern mansions.\n\n## Vermillion Bird — South\nGuardian of summer, ruler of the 7 southern mansions.\n\n## White Tiger — West\nGuardian of autumn, ruler of the 7 western mansions.\n\n## Black Tortoise — North\nGuardian of winter, ruler of the 7 northern mansions.', category:'Constellations', image:IMG.qilin, authorId:admin.id },
    { title:'Nine-Tailed Fox: From Ancient Myth to Modern Icon', slug:'nine-tailed-fox-myth-to-icon', excerpt:'From the Shan Hai Jing to modern anime, the Nine-Tailed Fox has captivated imaginations for 2,000 years. Trace her evolution through Chinese, Japanese, and Korean culture.', content:'# Nine-Tailed Fox\n\nThe Nine-Tailed Fox (九尾狐) first appears in the Classic of Mountains and Seas as a creature from Blue Hill Mountain.\n\n## In Ancient China\n- A symbol of auspicious omens\n- Associated with the Xia dynasty founding\n- Later became a symbol of feminine mystique\n\n## Across East Asia\n- Japan: Kitsune — fox spirits and messengers of Inari\n- Korea: Kumiho — shape-shifting nine-tailed fox\n- Modern: Beloved character in anime, games, and literature', category:'Mythology', image:IMG.ninefox, authorId:admin.id },
    { title:'Chinese Constellations: The 28 Mansions Explained', slug:'chinese-constellations-28-mansions', excerpt:'Unlike Western constellations, the Chinese divided the sky into 28 Mansions across four quadrants. Learn how this system guided agriculture, navigation, and destiny.', content:'# The 28 Mansions\n\nThe Twenty-Eight Mansions (二十八宿) divide the celestial equator into 28 segments.\n\n## Four Quadrants\nEach quadrant has 7 mansions, each ruled by one of the Four Symbols.\n\n## Practical Uses\n- Agricultural calendar\n- Maritime navigation\n- Astrology and fate calculation\n- Imperial court ceremonies\n\n## Comparison with Western System\nWhile the Greeks saw pictures in stars, the Chinese saw districts along the moon\'s path.', category:'Constellations', image:IMG.ninefox, authorId:admin.id },
    { title:'Qilin vs Western Unicorn: East Meets West in Mythology', slug:'qilin-vs-unicorn', excerpt:'Both are mythical horned creatures of purity — but the Qilin is far older and more complex. Explore the parallels and contrasts between these two legendary beasts.', content:'# Qilin vs Unicorn\n\n## Qilin (麒麟)\n- First recorded in the 5th century BCE\n- Composite creature: dragon head, deer body, ox tail\n- Appears at the birth of great sages\n- Symbol of prosperity, serenity, and wise judgment\n\n## Western Unicorn\n- First described by Greek historians\n- Pure white horse with single horn\n- Symbol of purity and grace\n- Popular in medieval European tapestries\n\n## Key Differences\nThe Qilin is a composite chimera with multiple animal features, while the Unicorn is fundamentally equine. The Qilin judges righteousness; the Unicorn represents untamed purity.', category:'Mythology', image:IMG.qilin, authorId:admin.id },
  ]
  for (const post of posts) { await db.blogPost.create({ data: post }) }
  console.log(`Created ${posts.length} blog posts`)
  console.log('MythRealms seed complete!')
}
main().catch(e => { console.error('Seed error:', e); process.exit(1) }).finally(() => db.$disconnect())
