import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { auth } from '@/lib/auth'

export const dynamic = 'force-dynamic'
export const revalidate = 0

export async function GET(request: NextRequest) {
  try {
    // For now, skip authentication check to debug the issue
    // TODO: Re-enable authentication once working
    /*
    const session = await auth.api.getSession({
      headers: request.headers
    })

    if (!session?.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    */

    const quizzes = await prisma.quiz.findMany({
      select: {
        id: true,
        title: true,
        slug: true,
        isActive: true,
        createdAt: true,
        updatedAt: true,
        participations: true,
        _count: {
          select: {
            modules: true,
            attempts: true
          }
        }
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    console.log('Fetched quizzes:', quizzes)
    return NextResponse.json(quizzes, { headers: { 'Cache-Control': 'no-store' } })
  } catch (error) {
    console.error('Error fetching quizzes:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quizzes' },
      { status: 500 }
    )
  }
}