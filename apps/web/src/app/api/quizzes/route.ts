import { NextRequest, NextResponse } from 'next/server'
import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

export async function GET(request: NextRequest) {
  try {
    // Fetch active quizzes
    const quizzes = await prisma.quiz.findMany({
      where: {
        isActive: true
      },
      select: {
        id: true,
        slug: true,
        title: true,
        questionsPerRun: true,
        allowPublicResult: true,
        createdAt: true,
        _count: {
          select: {
            questions: true,
            attempts: true
          }
        }
      },
      orderBy: {
        createdAt: 'desc'
      }
    })

    return NextResponse.json({
      quizzes
    })

  } catch (error) {
    console.error('Fetch quizzes error:', error)
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}
