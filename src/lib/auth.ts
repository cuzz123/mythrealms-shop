import NextAuth from "next-auth"
import Google from "next-auth/providers/google"
import Credentials from "next-auth/providers/credentials"
import type { Provider } from "next-auth/providers"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { db } from "./db"
import bcrypt from "bcryptjs"

const providers: Provider[] = [
  Credentials({
    name: "credentials",
    credentials: {
      email: { label: "Email", type: "email" },
      password: { label: "Password", type: "password" },
    },
    async authorize(credentials) {
      if (!credentials?.email || !credentials?.password) return null

      const user = await db.user.findUnique({
        where: { email: credentials.email as string },
      })

      if (!user || !user.password) return null

      const isValid = await bcrypt.compare(
        credentials.password as string,
        user.password
      )

      if (!isValid) return null

      return {
        id: user.id,
        email: user.email,
        name: user.name,
        role: user.role,
      }
    },
  }),
]

// Only add Google provider when credentials are configured
if (process.env.AUTH_GOOGLE_ID && process.env.AUTH_GOOGLE_SECRET) {
  providers.push(
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    })
  )
}

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(db),
  session: { strategy: "jwt" },
  pages: {
    signIn: "/auth/signin",
    error: "/auth/error",
  },
  providers,
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = "role" in user && typeof user.role === "string" ? user.role : undefined
        token.id = user.id
        token.sub = user.id
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        Object.assign(session.user, {
          role: typeof token.role === "string" ? token.role : undefined,
          id: typeof token.id === "string" ? token.id : undefined,
        })
      }
      return session
    },
  },
})
