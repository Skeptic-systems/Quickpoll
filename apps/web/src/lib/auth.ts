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
    verboseLogging: true,
  },
})

// Function to create admin user if none exists
export async function ensureAdminUser() {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count()
    console.log('Current user count:', userCount)
    
    if (userCount === 0) {
      // Check if admin credentials are provided in environment
      const adminEmail = process.env.ADMIN_EMAIL || 'admin@example.com'
      const adminPassword = process.env.ADMIN_PASSWORD || 'admin123'
      const adminName = process.env.ADMIN_NAME || 'Administrator'
      
      console.log('No users found. Creating admin user...')
      console.log('Admin credentials:', { email: adminEmail, name: adminName })
      
      // Create user using BetterAuth's internal methods
      const user = await auth.api.signUpEmail({
        body: {
          email: adminEmail,
          password: adminPassword,
          name: adminName,
        }
      })
      
      if (user.user) {
        console.log('Admin user created successfully:', user.user.email)
        
        // Update user role to admin
        await prisma.user.update({
          where: { id: user.user.id },
          data: { role: 'admin' }
        })
        
        console.log('Admin user role set successfully')
        return user.user
      } else {
        console.error('Failed to create admin user: No user returned')
        throw new Error('Failed to create admin user: No user returned')
      }
    } else {
      console.log(`Found ${userCount} existing users. Skipping admin user creation.`)
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error)
    throw error
  }
}
