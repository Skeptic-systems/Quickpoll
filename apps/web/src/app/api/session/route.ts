import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { message: 'Keine Session gefunden' },
        { status: 401 }
      )
    }

    // Find session in database
    const session = await prisma.session.findUnique({
      where: { sessionToken },
      include: {
        user: {
          select: {
            id: true,
            email: true,
            name: true,
            role: true,
            isFirstLogin: true
          }
        }
      }
    })

    if (!session || session.expires < new Date()) {
      return NextResponse.json(
        { message: 'Session abgelaufen' },
        { status: 401 }
      )
    }

    return NextResponse.json({
      user: session.user
    })

  } catch (error) {
    console.error('Session check error:', error)
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
