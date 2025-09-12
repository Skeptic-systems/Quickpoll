import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

export async function POST(request: NextRequest) {
  try {
    // Check if any users exist
    const userCount = await prisma.user.count()
    console.log('Current user count:', userCount)
    
    if (userCount === 0) {
      // Check if admin credentials are provided in environment
      const adminEmail = process.env.ADMIN_EMAIL
      const adminPassword = process.env.ADMIN_PASSWORD
      const adminName = process.env.ADMIN_NAME || 'Administrator'
      
      // Only create user if both email and password are provided
      if (adminEmail && adminPassword && adminEmail.trim() && adminPassword.trim()) {
        console.log('No users found. Creating admin user from environment variables...')
        console.log('Admin credentials:', { email: adminEmail, name: adminName })
        
        // Hash the password properly
        const saltRounds = 10
        const hashedPassword = await bcrypt.hash(adminPassword, saltRounds)
        
        // Create user directly in database
        const newUser = await prisma.user.create({
          data: {
            email: adminEmail.trim(),
            password: hashedPassword,
            name: adminName.trim(),
            role: 'admin',
            emailVerified: true,
            isFirstLogin: false
          }
        })
        
        console.log('Admin user created successfully:', newUser.email)
        return NextResponse.json({ 
          success: true, 
          user: { email: newUser.email, name: newUser.name, role: newUser.role }
        })
      } else {
        console.log('No admin credentials found in environment variables.')
        console.log('ADMIN_EMAIL:', adminEmail ? 'SET' : 'NOT SET')
        console.log('ADMIN_PASSWORD:', adminPassword ? 'SET' : 'NOT SET')
        return NextResponse.json({ 
          success: true, 
          message: 'No admin credentials provided in environment variables. Please set ADMIN_EMAIL and ADMIN_PASSWORD to create an admin user.'
        })
      }
    } else {
      console.log(`Found ${userCount} existing users. Skipping admin user creation.`)
      return NextResponse.json({ 
        success: true, 
        message: `Found ${userCount} existing users. Skipping admin user creation.`
      })
    }
  } catch (error) {
    console.error('Error ensuring admin user:', error)
    return NextResponse.json(
      { error: 'Failed to ensure admin user', details: error.message },
      { status: 500 }
    )
  }
}