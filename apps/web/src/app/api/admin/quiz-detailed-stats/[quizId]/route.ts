import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { quizId: string } }
) {
  try {
    const { quizId } = params

    console.log('📊 Detailed Quiz-Stats: Fetching detailed stats for quiz:', quizId)

    // Get quiz with modules
    const quiz = await prisma.quiz.findUnique({
      where: { id: quizId },
      include: {
        modules: {
          where: {
            type: { in: ['question', 'randomQuestion'] }
          },
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            attempts: true,
            modules: true
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

    // Get all completed attempts with their answers
    const attempts = await prisma.attempt.findMany({
      where: { 
        quizId,
        finishedAt: { not: null }
      },
      include: {
        answers: true
      }
    })

    console.log('📊 Detailed Quiz-Stats: Found attempts:', attempts.length)

    // Calculate basic stats
    const totalAttempts = attempts.length
    const averageScore = totalAttempts > 0 
      ? attempts.reduce((sum, attempt) => sum + attempt.score, 0) / totalAttempts 
      : 0

    // Calculate completion rate
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

    // Process question statistics
    const questionStats = await Promise.all(quiz.modules.map(async (module) => {
      console.log(`📊 Processing module: ${module.id}, type: ${module.type}`)
      
      let questionText = 'Unbekannte Frage'
      let questionAnswers: string[] = []
      let questionType: 'single' | 'multiple' = 'single'
      let correctAnswers: string[] = []

      if (module.type === 'question') {
        const moduleData = module.data as any
        questionText = moduleData.question || 'Unbekannte Frage'
        questionAnswers = moduleData.answers || []
        questionType = moduleData.questionType || 'single'
        correctAnswers = moduleData.correctAnswers || []
      } else if (module.type === 'randomQuestion') {
        const randomData = module.data as any
        const stackId = randomData.stackId
        
        if (stackId) {
          // Get all questions from the stack for display purposes
          const stackQuestions = await prisma.questionStackItem.findMany({
            where: { stackId },
            orderBy: { order: 'asc' }
          })
          
          if (stackQuestions.length > 0) {
            const questionForDisplay = stackQuestions[0]
            questionText = questionForDisplay.question || 'Zufällige Frage'
            
            try {
              let parsedAnswers = JSON.parse(questionForDisplay.answers || '[]')
              if (typeof parsedAnswers === 'string') {
                parsedAnswers = JSON.parse(parsedAnswers)
              }
              questionAnswers = Array.isArray(parsedAnswers) ? parsedAnswers : []
            } catch (error) {
              console.error('Error parsing questionAnswers:', error)
              questionAnswers = []
            }
            
            questionType = questionForDisplay.questionType as 'single' | 'multiple' || 'single'
            
            try {
              let parsedCorrectAnswers = JSON.parse(questionForDisplay.correctAnswers || '[]')
              if (typeof parsedCorrectAnswers === 'string') {
                parsedCorrectAnswers = JSON.parse(parsedCorrectAnswers)
              }
              correctAnswers = Array.isArray(parsedCorrectAnswers) ? parsedCorrectAnswers : []
            } catch (error) {
              console.error('Error parsing correctAnswers:', error)
              correctAnswers = []
            }
          }
        }
      }

      // Get all answers for this module
      const moduleAnswers = attempts.flatMap(attempt => 
        attempt.answers.filter(answer => answer.moduleId === module.id)
      )

      console.log(`📊 Module ${module.id}: Found ${moduleAnswers.length} answers`)

      // Count answer choices
      const answerCounts: Record<string, number> = {}
      let totalAnswers = 0
      let correctAnswerCount = 0

      moduleAnswers.forEach(answer => {
        try {
          let selectedChoices: string[] = []
          
          // Parse selected choices
          if (answer.selectedChoices) {
            if (Array.isArray(answer.selectedChoices)) {
              selectedChoices = answer.selectedChoices
            } else {
              selectedChoices = JSON.parse(answer.selectedChoices)
            }
          }

          // Count each selected choice
          selectedChoices.forEach(choice => {
            const answerText = questionAnswers[parseInt(choice)] || `Antwort ${parseInt(choice) + 1}`
            answerCounts[answerText] = (answerCounts[answerText] || 0) + 1
            totalAnswers++
          })

          // Count correct answers
          if (answer.isCorrect) {
            correctAnswerCount++
          }
        } catch (error) {
          console.error('Error processing answer:', error, answer)
        }
      })

      // Calculate average score for this question
      const averageScore = moduleAnswers.length > 0 
        ? (correctAnswerCount / moduleAnswers.length) * 100 
        : 0

      return {
        moduleId: module.id,
        questionText,
        questionAnswers,
        questionType,
        totalAnswers,
        answerCounts,
        correctAnswers: correctAnswers.map(index => questionAnswers[parseInt(index)]).filter(Boolean),
        averageScore
      }
    }))

    console.log('📊 Detailed Quiz-Stats: Processed question stats:', questionStats.length)

    const detailedStats = {
      totalAttempts,
      averageScore,
      completionRate,
      recentAttempts,
      questionStats
    }

    console.log('📊 Detailed Quiz-Stats: Final stats:', detailedStats)

    return NextResponse.json(detailedStats)

  } catch (error) {
    console.error('💥 Detailed Quiz-Stats: Error calculating stats:', error)
    return NextResponse.json(
      { error: 'Fehler beim Berechnen der detaillierten Statistiken' },
      { status: 500 }
    )
  }
}
