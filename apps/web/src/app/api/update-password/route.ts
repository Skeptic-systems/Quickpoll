import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Keine Session gefunden' },
        { status: 401 }
      )
    }

    // Find session and user
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: { user: true }
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { message: 'Session abgelaufen' },
        { status: 401 }
      )
    }

    const { newPassword, newEmail } = await request.json()

    if (!newPassword) {
      return NextResponse.json(
        { message: 'Neues Passwort ist erforderlich' },
        { status: 400 }
      )
    }

    // Check if new password is not the default password
    const defaultPasswordHash = await bcrypt.hash('admin123', 12)
    const isDefaultPassword = await bcrypt.compare(newPassword, defaultPasswordHash)
    
    if (isDefaultPassword) {
      return NextResponse.json(
        { message: 'Das neue Passwort darf nicht das Standard-Passwort sein' },
        { status: 400 }
      )
    }

    // Hash new password
    const hashedNewPassword = await bcrypt.hash(newPassword, 12)

    // Update user
    const updateData: any = {
      password: hashedNewPassword,
      isFirstLogin: false,
      updatedAt: new Date()
    }

    // Update email if provided and different
    if (newEmail && newEmail !== session.user.email) {
      // Check if email is already taken
      const existingUser = await prisma.user.findUnique({
        where: { email: newEmail }
      })
      
      if (existingUser) {
        return NextResponse.json(
          { message: 'Diese E-Mail-Adresse wird bereits verwendet' },
          { status: 400 }
        )
      }
      
      updateData.email = newEmail
    }

    const updatedUser = await prisma.user.update({
      where: { id: session.user.id },
      data: updateData,
      select: {
        id: true,
        email: true,
        name: true,
        role: true,
        isFirstLogin: true
      }
    })

    return NextResponse.json({
      message: 'Passwort erfolgreich geändert',
      user: updatedUser
    })

  } catch (error) {
    console.error('Password update error:', error)
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
