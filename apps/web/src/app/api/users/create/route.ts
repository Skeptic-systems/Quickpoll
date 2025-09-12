import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Local translations for user creation messages
const userMessages = {
  de: {
    fieldsRequired: 'Name, E-Mail und Passwort sind erforderlich',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    emailExists: 'E-Mail-Adresse bereits vorhanden',
    createSuccess: 'Benutzer erfolgreich erstellt',
    serverError: 'Ein Fehler ist aufgetreten',
    unauthorized: 'Nicht autorisiert'
  },
  en: {
    fieldsRequired: 'Name, email and password are required',
    passwordMismatch: 'Passwords do not match',
    emailExists: 'Email address already exists',
    createSuccess: 'User successfully created',
    serverError: 'An error occurred',
    unauthorized: 'Unauthorized'
  },
  fr: {
    fieldsRequired: 'Le nom, l\'email et le mot de passe sont requis',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    emailExists: 'L\'adresse email existe déjà',
    createSuccess: 'Utilisateur créé avec succès',
    serverError: 'Une erreur est survenue',
    unauthorized: 'Non autorisé'
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API User-Create: Starting session check...')
    const session = await auth.api.getSession({
      headers: request.headers
    })

    console.log('🔐 API User-Create: Session result:', session ? 'Found' : 'Not found')
    
    // Fallback: Try old session-token cookie if BetterAuth session not found
    if (!session?.user) {
      console.log('🔍 API User-Create: Trying fallback session lookup...')
      const oldSessionCookie = request.cookies.get('session-token')
      if (oldSessionCookie) {
        console.log('🍪 API User-Create: Found old session-token cookie')
        const oldDbSession = await prisma.session.findUnique({
          where: { sessionToken: oldSessionCookie.value },
          include: { user: true }
        })
        
        if (oldDbSession && oldDbSession.expires > new Date()) {
          console.log('✅ API User-Create: Found valid old session')
          // Continue with user creation using old session
        } else {
          console.log('❌ API User-Create: Old session not found or expired')
        }
      }
    }

    if (!session?.user) {
      console.log('❌ API User-Create: No session found, returning 401')
      return NextResponse.json(
        { message: 'Nicht autorisiert' },
        { status: 401 }
      )
    }

    const { 
      name, 
      email, 
      password, 
      confirmPassword, 
      role = 'user',
      language = 'de' 
    } = await request.json()

    console.log('📝 API User-Create: Creating user with data:', { name, email, role })

    if (!name || !email || !password) {
      console.log('❌ API User-Create: Missing required fields')
      return NextResponse.json(
        { message: userMessages[language as keyof typeof userMessages]?.fieldsRequired || userMessages.de.fieldsRequired },
        { status: 400 }
      )
    }

    if (password !== confirmPassword) {
      console.log('❌ API User-Create: Password mismatch')
      return NextResponse.json(
        { message: userMessages[language as keyof typeof userMessages]?.passwordMismatch || userMessages.de.passwordMismatch },
        { status: 400 }
      )
    }

    // Check if email already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      console.log('❌ API User-Create: Email already exists:', email)
      return NextResponse.json(
        { message: userMessages[language as keyof typeof userMessages]?.emailExists || userMessages.de.emailExists },
        { status: 400 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 12)

    // Create user
    const newUser = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
        emailVerified: false,
        isFirstLogin: true
      },
      select: {
        id: true,
        name: true,
        email: true,
        role: true,
        createdAt: true
      }
    })

    console.log('✅ API User-Create: User created successfully:', newUser.id)
    return NextResponse.json(
      { 
        message: userMessages[language as keyof typeof userMessages]?.createSuccess || userMessages.de.createSuccess,
        user: newUser
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('💥 API User-Create: Error:', error)
    return NextResponse.json(
      { message: userMessages[language as keyof typeof userMessages]?.serverError || userMessages.de.serverError },
      { status: 500 }
    )
  }
}


