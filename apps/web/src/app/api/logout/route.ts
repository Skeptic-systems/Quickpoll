import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function POST(request: NextRequest) {
  try {
    const sessionToken = request.cookies.get('session-token')?.value

    if (sessionToken) {
      // Delete session from database
      await prisma.session.deleteMany({
        where: { sessionToken }
      })
    }

    // Clear session cookie
    const response = NextResponse.json(
      { message: 'Logout erfolgreich' },
      { status: 200 }
    )

    response.cookies.set('session-token', '', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: new Date(0)
    })

    return response

  } catch (error) {
    console.error('Logout error:', error)
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}