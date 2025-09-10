import { betterAuth } from "better-auth"
import { prismaAdapter } from "better-auth/adapters/prisma"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: "mysql"
  }),
  emailAndPassword: {
    enabled: true,
    requireEmailVerification: false,
  },
  secret: process.env.AUTH_SECRET!,
  baseURL: process.env.NEXT_PUBLIC_BASE_URL!,
  trustedOrigins: [process.env.NEXT_PUBLIC_BASE_URL!],
  logger: {
    level: "debug",
  },
})
