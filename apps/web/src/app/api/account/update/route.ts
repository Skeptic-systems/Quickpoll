import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'

// Local translations for account update messages
const accountMessages = {
  de: {
    fieldsRequired: 'Name und E-Mail sind erforderlich',
    passwordMismatch: 'Passwörter stimmen nicht überein',
    invalidCurrentPassword: 'Aktuelles Passwort ist falsch',
    emailExists: 'E-Mail-Adresse bereits vorhanden',
    updateSuccess: 'Account erfolgreich aktualisiert',
    serverError: 'Ein Fehler ist aufgetreten',
    unauthorized: 'Nicht authentifiziert'
  },
  en: {
    fieldsRequired: 'Name and email are required',
    passwordMismatch: 'Passwords do not match',
    invalidCurrentPassword: 'Current password is incorrect',
    emailExists: 'Email address already exists',
    updateSuccess: 'Account successfully updated',
    serverError: 'An error occurred',
    unauthorized: 'Not authenticated'
  },
  fr: {
    fieldsRequired: 'Le nom et l\'email sont requis',
    passwordMismatch: 'Les mots de passe ne correspondent pas',
    invalidCurrentPassword: 'Le mot de passe actuel est incorrect',
    emailExists: 'L\'adresse email existe déjà',
    updateSuccess: 'Compte mis à jour avec succès',
    serverError: 'Une erreur est survenue',
    unauthorized: 'Non authentifié'
  }
}

export async function POST(request: NextRequest) {
  try {
    console.log('🔍 API Account-Update: Starting session check...')
    const session = await auth.api.getSession({
      headers: request.headers
    })

    console.log('🔐 API Account-Update: Session result:', session ? 'Found' : 'Not found')
    
    // Fallback: Try old session-token cookie if BetterAuth session not found
    if (!session?.user) {
      console.log('🔍 API Account-Update: Trying fallback session lookup...')
      const oldSessionCookie = request.cookies.get('session-token')
      if (oldSessionCookie) {
        console.log('🍪 API Account-Update: Found old session-token cookie')
        const oldDbSession = await prisma.session.findUnique({
          where: { sessionToken: oldSessionCookie.value },
          include: { user: true }
        })
        
        if (oldDbSession && oldDbSession.expires > new Date()) {
          console.log('✅ API Account-Update: Found valid old session')
          // Use the old session user data
          const sessionUser = oldDbSession.user
          
          const { 
            name, 
            email, 
            currentPassword, 
            newPassword, 
            confirmPassword, 
            language = 'de' 
          } = await request.json()

          if (!name || !email) {
            return NextResponse.json(
              { message: accountMessages[language as keyof typeof accountMessages]?.fieldsRequired || accountMessages.de.fieldsRequired },
              { status: 400 }
            )
          }

          // Check if email is being changed and if it already exists
          if (email !== sessionUser.email) {
            const existingUser = await prisma.user.findUnique({
              where: { email }
            })

            if (existingUser) {
              return NextResponse.json(
                { message: accountMessages[language as keyof typeof accountMessages]?.emailExists || accountMessages.de.emailExists },
                { status: 400 }
              )
            }
          }

          // If password is being changed, validate current password
          if (newPassword) {
            if (newPassword !== confirmPassword) {
              return NextResponse.json(
                { message: accountMessages[language as keyof typeof accountMessages]?.passwordMismatch || accountMessages.de.passwordMismatch },
                { status: 400 }
              )
            }

            if (!currentPassword) {
              return NextResponse.json(
                { message: accountMessages[language as keyof typeof accountMessages]?.fieldsRequired || accountMessages.de.fieldsRequired },
                { status: 400 }
              )
            }

            // Verify current password
            const isValidPassword = await bcrypt.compare(currentPassword, sessionUser.password)
            if (!isValidPassword) {
              return NextResponse.json(
                { message: accountMessages[language as keyof typeof accountMessages]?.invalidCurrentPassword || accountMessages.de.invalidCurrentPassword },
                { status: 400 }
              )
            }
          }

          // Prepare update data
          const updateData: any = {
            name,
            email
          }

          // Add hashed password if provided
          if (newPassword) {
            const hashedPassword = await bcrypt.hash(newPassword, 12)
            updateData.password = hashedPassword
          }

          // Update user
          const updatedUser = await prisma.user.update({
            where: { id: sessionUser.id },
            data: updateData,
            select: {
              id: true,
              name: true,
              email: true,
              role: true
            }
          })

          return NextResponse.json(
            { 
              message: accountMessages[language as keyof typeof accountMessages]?.updateSuccess || accountMessages.de.updateSuccess,
              user: updatedUser
            },
            { status: 200 }
          )
        }
      }
    }

    if (!session?.user) {
      console.log('❌ API Account-Update: No session found, returning 401')
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    const { 
      name, 
      email, 
      currentPassword, 
      newPassword, 
      confirmPassword, 
      language = 'de' 
    } = await request.json()

    if (!name || !email) {
      return NextResponse.json(
        { message: accountMessages[language as keyof typeof accountMessages]?.fieldsRequired || accountMessages.de.fieldsRequired },
        { status: 400 }
      )
    }

    // Check if email is being changed and if it already exists
    if (email !== session.user.email) {
      const existingUser = await prisma.user.findUnique({
        where: { email }
      })

      if (existingUser) {
        return NextResponse.json(
          { message: accountMessages[language as keyof typeof accountMessages]?.emailExists || accountMessages.de.emailExists },
          { status: 400 }
        )
      }
    }

    // If password is being changed, validate current password
    if (newPassword) {
      if (newPassword !== confirmPassword) {
        return NextResponse.json(
          { message: accountMessages[language as keyof typeof accountMessages]?.passwordMismatch || accountMessages.de.passwordMismatch },
          { status: 400 }
        )
      }

      if (!currentPassword) {
        return NextResponse.json(
          { message: accountMessages[language as keyof typeof accountMessages]?.fieldsRequired || accountMessages.de.fieldsRequired },
          { status: 400 }
        )
      }

      // Get user from database to verify current password
      const user = await prisma.user.findUnique({
        where: { id: session.user.id }
      })

      if (!user) {
        return NextResponse.json(
          { message: accountMessages[language as keyof typeof accountMessages]?.serverError || accountMessages.de.serverError },
          { status: 404 }
        )
      }

      // Verify current password
      const isValidPassword = await bcrypt.compare(currentPassword, user.password)
      if (!isValidPassword) {
        return NextResponse.json(
          { message: accountMessages[language as keyof typeof accountMessages]?.invalidCurrentPassword || accountMessages.de.invalidCurrentPassword },
          { status: 400 }
        )
      }
    }

    // Prepare update data
    const updateData: any = {
      name,
      email
    }

    // Add hashed password if provided
    if (newPassword) {
      const hashedPassword = await bcrypt.hash(newPassword, 12)
      updateData.password = hashedPassword
    }

    // Update user
    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        name: true,
        email: true,
        role: true
      }
    })

    return NextResponse.json(
      { 
        message: accountMessages[language as keyof typeof accountMessages]?.updateSuccess || accountMessages.de.updateSuccess,
        user: updatedUser
      },
      { status: 200 }
    )

  } catch (error) {
    console.error('Account update error:', error)
    return NextResponse.json(
      { message: accountMessages[language as keyof typeof accountMessages]?.serverError || accountMessages.de.serverError },
      { status: 500 }
    )
  }
}


