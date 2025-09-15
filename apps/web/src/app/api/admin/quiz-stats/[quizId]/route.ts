import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params

    console.log('📊 Quiz-Stats: Fetching stats for quiz:', quizId)

    // Get basic quiz info
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        _count: {
          select: {
            attempts: true,
            questions: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz nicht gefunden' },
        { status: 404 }
      )
    }

    // Get all attempts for this quiz
    const attempts = await prisma.attempt.findMany({
      where: { 
        quizId,
        finishedAt: { not: null } // Only completed attempts
      },
      select: {
        id: true,
        score: true,
        totalQuestions: true,
        correctAnswers: true,
        finishedAt: true,
        startedAt: true
      }
    })

    console.log('📊 Quiz-Stats: Found attempts:', attempts.length)

    // Calculate statistics
    const totalAttempts = attempts.length
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts 
      : 0

    // Calculate completion rate (attempts that were finished vs started)
    const allAttempts = await prisma.attempt.count({
      where: { quizId }
    })
    const completionRate = allAttempts > 0 
      ? (totalAttempts / allAttempts) * 100 
      : 0

    // Recent attempts (last 7 days)
    const sevenDaysAgo = new Date()
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7)
    const recentAttempts = attempts.filter(
      attempt => attempt.finishedAt && new Date(attempt.finishedAt) >= sevenDaysAgo
    ).length

    const stats = {
      totalAttempts,
      averageScore,
      completionRate,
      recentAttempts,
      totalQuestions: quiz._count.questions,
      allAttempts // Total attempts including unfinished ones
    }

    console.log('📊 Quiz-Stats: Calculated stats:', stats)

    return NextResponse.json(stats)

  } catch (error) {
    console.error('💥 Quiz-Stats: Error calculating stats:', error)
    return NextResponse.json(
      { error: 'Fehler beim Berechnen der Statistiken' },
      { status: 500 }
    )
  }
}
