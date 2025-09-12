import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

// Local translations for login messages
const loginMessages = {
  de: {
    emailPasswordRequired: 'E-Mail und Passwort sind erforderlich',
    invalidCredentials: 'Ungültige Anmeldedaten',
    loginSuccess: 'Login erfolgreich',
    serverError: 'Ein Fehler ist aufgetreten'
  },
  en: {
    emailPasswordRequired: 'Email and password are required',
    invalidCredentials: 'Invalid login credentials',
    loginSuccess: 'Login successful',
    serverError: 'An error occurred'
  },
  fr: {
    emailPasswordRequired: 'Email et mot de passe sont requis',
    invalidCredentials: 'Identifiants de connexion invalides',
    loginSuccess: 'Connexion réussie',
    serverError: 'Une erreur est survenue'
  }
}

export async function POST(request: NextRequest) {
  try {
    const { email, password, language = 'de' } = await request.json()

    if (!email || !password) {
      return NextResponse.json(
        { message: loginMessages[language as keyof typeof loginMessages]?.emailPasswordRequired || loginMessages.de.emailPasswordRequired },
        { status: 400 }
      )
    }

    // Find user in database
    const user = await prisma.user.findUnique({
      where: { email }
    })

    if (!user) {
      return NextResponse.json(
        { message: loginMessages[language as keyof typeof loginMessages]?.invalidCredentials || loginMessages.de.invalidCredentials },
        { status: 401 }
      )
    }

    // Verify password
    const isValidPassword = await bcrypt.compare(password, user.password)

    if (!isValidPassword) {
      return NextResponse.json(
        { message: loginMessages[language as keyof typeof loginMessages]?.invalidCredentials || loginMessages.de.invalidCredentials },
        { status: 401 }
      )
    }

    // Create session (simple approach)
    const sessionToken = crypto.randomUUID()
    const expires = new Date(Date.now() + 7 * 24 * 60 * 60 * 1000) // 7 days

    await prisma.session.create({
      data: {
        sessionToken,
        userId: user.id,
        expires
      }
    })

    // Set session cookie
    const response = NextResponse.json(
      { 
        message: loginMessages[language as keyof typeof loginMessages]?.loginSuccess || loginMessages.de.loginSuccess,
        user: {
          id: user.id,
          email: user.email,
          name: user.name,
          role: user.role
        }
      },
      { status: 200 }
    )

    response.cookies.set('session-token', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { message: loginMessages[language as keyof typeof loginMessages]?.serverError || loginMessages.de.serverError },
      { status: 500 }
    )
  }
}



