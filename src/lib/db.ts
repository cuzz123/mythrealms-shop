import { PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

function createPrismaClient() {
  return new PrismaClient({
    log: process.env.NODE_ENV === 'development' ? ['warn', 'error'] : ['error'],
  })
}

// Lazy init with connection retry for Neon cold starts
function getPrisma(): PrismaClient {
  if (globalForPrisma.prisma) return globalForPrisma.prisma

  const client = createPrismaClient()

  // Monkey-patch $connect to retry on Neon cold start (up to 15s)
  const originalConnect = client.$connect.bind(client)
  client.$connect = async () => {
    for (let attempt = 0; attempt < 5; attempt++) {
      try {
        return await originalConnect()
      } catch (e: any) {
        if (attempt < 4 && (e.message?.includes("Can't reach database") || e.message?.includes("Connection terminated"))) {
          const delay = 1000 * Math.pow(2, attempt) // 1s, 2s, 4s, 8s
          console.warn(`DB connection attempt ${attempt + 1} failed, retrying in ${delay}ms...`)
          await new Promise(r => setTimeout(r, delay))
          continue
        }
        throw e
      }
    }
    return originalConnect()
  }

  if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = client
  return client
}

export const db = new Proxy({} as PrismaClient, {
  get(_, prop) {
    const client = getPrisma()
    return (client as any)[prop]
  },
})
