// Auto-generated seed: 1688 products → MythRealms
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  console.log('Seeding 1688 products...\n')
  
  const catCopper = await db.category.upsert({where:{slug:'copper-braid-series'},update:{},create:{name:'Copper Braid Collection',slug:'copper-braid-series',description:'Warm braided copper bracelets with earthy sunset tones',sortOrder:10}})
  const catGolden = await db.category.upsert({where:{slug:'golden-luxe-series'},update:{},create:{name:'Golden Luxe Collection',slug:'golden-luxe-series',description:'Light luxury gold-accent bracelets for everyday elegance',sortOrder:11}})
  const catDark = await db.category.upsert({where:{slug:'dark-mineral-series'},update:{},create:{name:'Dark Mineral Collection',slug:'dark-mineral-series',description:'Deep charcoal and mineral stone bracelets with raw texture',sortOrder:12}})
  const catPearl = await db.category.upsert({where:{slug:'pearl-crystal-series'},update:{},create:{name:'Pearl & Crystal Collection',slug:'pearl-crystal-series',description:'Luminous pearl and crystal bracelets with delicate shimmer',sortOrder:13}})
  const catSingles = await db.category.upsert({where:{slug:'curated-singles'},update:{},create:{name:'Curated Singles',slug:'curated-singles',description:'One-of-a-kind hand-selected bracelets',sortOrder:14}})
  
  const catMap: Record<string,string> = {
    'copper-braid-series': catCopper.id,
    'golden-luxe-series': catGolden.id,
    'dark-mineral-series': catDark.id,
    'pearl-crystal-series': catPearl.id,
  }
  
  let count = 0


  await db.product.upsert({
    where: { slug: 'copper-braid-series-01' },
    update: {},
    create: {
      name: 'Copper Braid #1',
      slug: 'copper-braid-series-01',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 31.49,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-01.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-01.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-02' },
    update: {},
    create: {
      name: 'Copper Braid #2',
      slug: 'copper-braid-series-02',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 32.99,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-02.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-02.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-03' },
    update: {},
    create: {
      name: 'Copper Braid #3',
      slug: 'copper-braid-series-03',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 34.49,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-03.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-03.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-04' },
    update: {},
    create: {
      name: 'Copper Braid #4',
      slug: 'copper-braid-series-04',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 35.99,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-04.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-04.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-05' },
    update: {},
    create: {
      name: 'Copper Braid #5',
      slug: 'copper-braid-series-05',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 37.49,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-05.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-05.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-06' },
    update: {},
    create: {
      name: 'Copper Braid #6',
      slug: 'copper-braid-series-06',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 38.99,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-06.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-06.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-07' },
    update: {},
    create: {
      name: 'Copper Braid #7',
      slug: 'copper-braid-series-07',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 40.49,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-07.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-07.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-08' },
    update: {},
    create: {
      name: 'Copper Braid #8',
      slug: 'copper-braid-series-08',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 41.99,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-08.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-08.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-09' },
    update: {},
    create: {
      name: 'Copper Braid #9',
      slug: 'copper-braid-series-09',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 43.49,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-09.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-09.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-10' },
    update: {},
    create: {
      name: 'Copper Braid #10',
      slug: 'copper-braid-series-10',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 44.99,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-10.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-10.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-11' },
    update: {},
    create: {
      name: 'Copper Braid #11',
      slug: 'copper-braid-series-11',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 46.49,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-11.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-11.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-braid-series-12' },
    update: {},
    create: {
      name: 'Copper Braid #12',
      slug: 'copper-braid-series-12',
      description: 'From the Copper Braid Collection. Warm braided copper bracelets with earthy sunset tones',
      price: 47.99,
      image: '/images/products/1688-shop/copper-braid-series/copper-braid-series-12.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-12.jpg"]),
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-01' },
    update: {},
    create: {
      name: 'Golden Luxe #1',
      slug: 'golden-luxe-series-01',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 31.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-01.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-01.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-02' },
    update: {},
    create: {
      name: 'Golden Luxe #2',
      slug: 'golden-luxe-series-02',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 32.99,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-02.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-02.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-03' },
    update: {},
    create: {
      name: 'Golden Luxe #3',
      slug: 'golden-luxe-series-03',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 34.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-03.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-03.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-04' },
    update: {},
    create: {
      name: 'Golden Luxe #4',
      slug: 'golden-luxe-series-04',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 35.99,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-04.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-04.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-05' },
    update: {},
    create: {
      name: 'Golden Luxe #5',
      slug: 'golden-luxe-series-05',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 37.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-05.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-05.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-06' },
    update: {},
    create: {
      name: 'Golden Luxe #6',
      slug: 'golden-luxe-series-06',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 38.99,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-06.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-06.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-07' },
    update: {},
    create: {
      name: 'Golden Luxe #7',
      slug: 'golden-luxe-series-07',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 40.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-07.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-07.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-08' },
    update: {},
    create: {
      name: 'Golden Luxe #8',
      slug: 'golden-luxe-series-08',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 41.99,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-08.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-08.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-09' },
    update: {},
    create: {
      name: 'Golden Luxe #9',
      slug: 'golden-luxe-series-09',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 43.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-09.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-09.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-10' },
    update: {},
    create: {
      name: 'Golden Luxe #10',
      slug: 'golden-luxe-series-10',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 44.99,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-10.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-10.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-11' },
    update: {},
    create: {
      name: 'Golden Luxe #11',
      slug: 'golden-luxe-series-11',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 46.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-11.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-11.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-12' },
    update: {},
    create: {
      name: 'Golden Luxe #12',
      slug: 'golden-luxe-series-12',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 47.99,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-12.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-12.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-luxe-series-13' },
    update: {},
    create: {
      name: 'Golden Luxe #13',
      slug: 'golden-luxe-series-13',
      description: 'From the Golden Luxe Collection. Light luxury gold-accent bracelets for everyday elegance',
      price: 49.49,
      image: '/images/products/1688-shop/golden-luxe-series/golden-luxe-series-13.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-13.jpg"]),
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-01' },
    update: {},
    create: {
      name: 'Dark Mineral #1',
      slug: 'dark-mineral-series-01',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 31.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-01.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-01.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-02' },
    update: {},
    create: {
      name: 'Dark Mineral #2',
      slug: 'dark-mineral-series-02',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 32.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-02.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-02.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-03' },
    update: {},
    create: {
      name: 'Dark Mineral #3',
      slug: 'dark-mineral-series-03',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 34.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-03.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-03.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-04' },
    update: {},
    create: {
      name: 'Dark Mineral #4',
      slug: 'dark-mineral-series-04',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 35.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-04.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-04.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-05' },
    update: {},
    create: {
      name: 'Dark Mineral #5',
      slug: 'dark-mineral-series-05',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 37.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-05.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-05.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-06' },
    update: {},
    create: {
      name: 'Dark Mineral #6',
      slug: 'dark-mineral-series-06',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 38.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-06.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-06.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-07' },
    update: {},
    create: {
      name: 'Dark Mineral #7',
      slug: 'dark-mineral-series-07',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 40.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-07.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-07.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-08' },
    update: {},
    create: {
      name: 'Dark Mineral #8',
      slug: 'dark-mineral-series-08',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 41.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-08.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-08.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-09' },
    update: {},
    create: {
      name: 'Dark Mineral #9',
      slug: 'dark-mineral-series-09',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 43.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-09.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-09.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-10' },
    update: {},
    create: {
      name: 'Dark Mineral #10',
      slug: 'dark-mineral-series-10',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 44.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-10.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-10.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-11' },
    update: {},
    create: {
      name: 'Dark Mineral #11',
      slug: 'dark-mineral-series-11',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 46.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-11.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-11.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-12' },
    update: {},
    create: {
      name: 'Dark Mineral #12',
      slug: 'dark-mineral-series-12',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 47.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-12.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-12.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-13' },
    update: {},
    create: {
      name: 'Dark Mineral #13',
      slug: 'dark-mineral-series-13',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 49.49,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-13.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-13.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'dark-mineral-series-14' },
    update: {},
    create: {
      name: 'Dark Mineral #14',
      slug: 'dark-mineral-series-14',
      description: 'From the Dark Mineral Collection. Deep charcoal and mineral stone bracelets with raw texture',
      price: 50.99,
      image: '/images/products/1688-shop/dark-mineral-series/dark-mineral-series-14.jpg',
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-14.jpg"]),
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'pearl-crystal-series-01' },
    update: {},
    create: {
      name: 'Pearl & Crystal #1',
      slug: 'pearl-crystal-series-01',
      description: 'From the Pearl & Crystal Series. Luminous pearl and crystal bracelets with delicate shimmer',
      price: 31.49,
      image: '/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-01.jpg',
      images: JSON.stringify(["/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-01.jpg"]),
      categoryId: catMap['pearl-crystal-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'pearl-crystal-series-02' },
    update: {},
    create: {
      name: 'Pearl & Crystal #2',
      slug: 'pearl-crystal-series-02',
      description: 'From the Pearl & Crystal Series. Luminous pearl and crystal bracelets with delicate shimmer',
      price: 32.99,
      image: '/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-02.jpg',
      images: JSON.stringify(["/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-02.jpg"]),
      categoryId: catMap['pearl-crystal-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'pearl-crystal-series-03' },
    update: {},
    create: {
      name: 'Pearl & Crystal #3',
      slug: 'pearl-crystal-series-03',
      description: 'From the Pearl & Crystal Series. Luminous pearl and crystal bracelets with delicate shimmer',
      price: 34.49,
      image: '/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-03.jpg',
      images: JSON.stringify(["/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-03.jpg"]),
      categoryId: catMap['pearl-crystal-series'],
      isActive: true,
      inStock: true,
      isNew: true,
      tag: 'New',
      features: ['Natural stone', 'Elastic fit', 'Hand-selected', 'One size'],
      rating: 4.5,
      reviewCount: 15,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'blush-rose-single' },
    update: {},
    create: {
      name: 'Blush Rose Bracelet',
      slug: 'blush-rose-single',
      description: 'Soft rose-toned bracelet with delicate craftsmanship',
      price: 34.99,
      image: '/images/products/1688-shop/blush-rose-single/blush-rose-single-main.jpg',
      images: JSON.stringify(["/images/products/1688-shop/blush-rose-single/blush-rose-single-main.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail1.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail2.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail3.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail4.jpg"]),
      categoryId: catSingles.id,
      isActive: true,
      inStock: true,
      isNew: true,
      isBestSeller: true,
      tag: 'Bestseller',
      features: ['Natural stone', 'Premium finish', 'Hand-selected', 'One size'],
      rating: 4.8,
      reviewCount: 35,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'copper-elegance-single' },
    update: {},
    create: {
      name: 'Copper Elegance',
      slug: 'copper-elegance-single',
      description: 'Refined copper bracelet with intricate detailing',
      price: 34.99,
      image: '/images/products/1688-shop/copper-elegance-single/copper-elegance-single-main.jpg',
      images: JSON.stringify(["/images/products/1688-shop/copper-elegance-single/copper-elegance-single-main.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail1.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail2.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail3.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail4.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail5.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail6.jpg"]),
      categoryId: catSingles.id,
      isActive: true,
      inStock: true,
      isNew: true,
      isBestSeller: true,
      tag: 'Bestseller',
      features: ['Natural stone', 'Premium finish', 'Hand-selected', 'One size'],
      rating: 4.8,
      reviewCount: 35,
    }
  })
  count++

  await db.product.upsert({
    where: { slug: 'golden-accent-single' },
    update: {},
    create: {
      name: 'Golden Accent',
      slug: 'golden-accent-single',
      description: 'Warm gold-accent bracelet for sophisticated layering',
      price: 34.99,
      image: '/images/products/1688-shop/golden-accent-single/golden-accent-single-main.jpg',
      images: JSON.stringify(["/images/products/1688-shop/golden-accent-single/golden-accent-single-main.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail1.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail2.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail3.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail4.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail5.jpg"]),
      categoryId: catSingles.id,
      isActive: true,
      inStock: true,
      isNew: true,
      isBestSeller: true,
      tag: 'Bestseller',
      features: ['Natural stone', 'Premium finish', 'Hand-selected', 'One size'],
      rating: 4.8,
      reviewCount: 35,
    }
  })
  count++

  console.log(`Seeded ${count} 1688 products`)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
