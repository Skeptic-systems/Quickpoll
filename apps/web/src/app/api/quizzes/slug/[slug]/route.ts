import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { slug: string } }) {
  try {
    const { slug } = params

    if (!slug) {
      return NextResponse.json(
        { error: 'Quiz slug is required' },
        { status: 400 }
      )
    }

    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      select: {
        id: true,
        title: true,
        slug: true,
        isActive: true,
        languages: true,
        createdAt: true,
        updatedAt: true,
      },
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz by slug:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}


