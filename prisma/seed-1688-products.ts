// Auto-generated: 1688 products → MythRealms (fixed schema)
import { PrismaClient } from '@prisma/client'
const db = new PrismaClient()

async function main() {
  console.log('Seeding 1688 products...')
  
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-01.jpg"]),
      minPrice: 31.49,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 31.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-02.jpg"]),
      minPrice: 32.99,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 32.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-03.jpg"]),
      minPrice: 34.49,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-04.jpg"]),
      minPrice: 35.99,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 35.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-05.jpg"]),
      minPrice: 37.49,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 37.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-06.jpg"]),
      minPrice: 38.99,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 38.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-07.jpg"]),
      minPrice: 40.49,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 40.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-08.jpg"]),
      minPrice: 41.99,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 41.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-09.jpg"]),
      minPrice: 43.49,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 43.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-10.jpg"]),
      minPrice: 44.99,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 44.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-11.jpg"]),
      minPrice: 46.49,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 46.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-braid-series/copper-braid-series-12.jpg"]),
      minPrice: 47.99,
      categoryId: catMap['copper-braid-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 47.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-01.jpg"]),
      minPrice: 31.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 31.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-02.jpg"]),
      minPrice: 32.99,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 32.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-03.jpg"]),
      minPrice: 34.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-04.jpg"]),
      minPrice: 35.99,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 35.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-05.jpg"]),
      minPrice: 37.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 37.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-06.jpg"]),
      minPrice: 38.99,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 38.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-07.jpg"]),
      minPrice: 40.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 40.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-08.jpg"]),
      minPrice: 41.99,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 41.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-09.jpg"]),
      minPrice: 43.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 43.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-10.jpg"]),
      minPrice: 44.99,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 44.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-11.jpg"]),
      minPrice: 46.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 46.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-12.jpg"]),
      minPrice: 47.99,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 47.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-luxe-series/golden-luxe-series-13.jpg"]),
      minPrice: 49.49,
      categoryId: catMap['golden-luxe-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 49.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-01.jpg"]),
      minPrice: 31.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 31.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-02.jpg"]),
      minPrice: 32.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 32.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-03.jpg"]),
      minPrice: 34.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-04.jpg"]),
      minPrice: 35.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 35.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-05.jpg"]),
      minPrice: 37.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 37.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-06.jpg"]),
      minPrice: 38.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 38.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-07.jpg"]),
      minPrice: 40.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 40.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-08.jpg"]),
      minPrice: 41.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 41.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-09.jpg"]),
      minPrice: 43.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 43.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-10.jpg"]),
      minPrice: 44.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 44.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-11.jpg"]),
      minPrice: 46.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 46.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-12.jpg"]),
      minPrice: 47.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 47.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-13.jpg"]),
      minPrice: 49.49,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 49.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/dark-mineral-series/dark-mineral-series-14.jpg"]),
      minPrice: 50.99,
      categoryId: catMap['dark-mineral-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 50.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-01.jpg"]),
      minPrice: 31.49,
      categoryId: catMap['pearl-crystal-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 31.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-02.jpg"]),
      minPrice: 32.99,
      categoryId: catMap['pearl-crystal-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 32.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/pearl-crystal-series/pearl-crystal-series-03.jpg"]),
      minPrice: 34.49,
      categoryId: catMap['pearl-crystal-series'],
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.49,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/blush-rose-single/blush-rose-single-main.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail1.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail2.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail3.jpg", "/images/products/1688-shop/blush-rose-single/blush-rose-single-detail4.jpg"]),
      minPrice: 34.99,
      categoryId: catSingles.id,
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/copper-elegance-single/copper-elegance-single-main.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail1.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail2.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail3.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail4.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail5.jpg", "/images/products/1688-shop/copper-elegance-single/copper-elegance-single-detail6.jpg"]),
      minPrice: 34.99,
      categoryId: catSingles.id,
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.99,
          stock: 99,
        }
      }
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
      images: JSON.stringify(["/images/products/1688-shop/golden-accent-single/golden-accent-single-main.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail1.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail2.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail3.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail4.jpg", "/images/products/1688-shop/golden-accent-single/golden-accent-single-detail5.jpg"]),
      minPrice: 34.99,
      categoryId: catSingles.id,
      isActive: true,
      isFeatured: true,
      material: 'Natural stone',
      variants: {
        create: {
          name: 'One Size',
          price: 34.99,
          stock: 99,
        }
      }
    }
  })
  count++

  console.log(`Seeded ${count} 1688 products`)
}

main().then(() => process.exit(0)).catch(e => { console.error(e); process.exit(1) })
