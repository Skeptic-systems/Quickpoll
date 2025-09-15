import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { slug: string } }
) {
  try {
    const { slug } = params
    const { answers } = await request.json()

    console.log('🔍 Quiz-Submit: Starting quiz submission for slug:', slug)
    console.log('📝 Quiz-Submit: Received answers:', answers)

    // Quiz mit Modulen laden
    const quiz = await prisma.quiz.findUnique({
      where: { slug },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!quiz) {
      console.log('❌ Quiz-Submit: Quiz not found')
      return NextResponse.json(
        { error: 'Quiz nicht gefunden' },
        { status: 404 }
      )
    }

    console.log('✅ Quiz-Submit: Quiz found:', quiz.title)
    console.log('📊 Quiz-Submit: Quiz has', quiz.modules.length, 'modules')

    // Teilnahmen um 1 erhöhen
    const updatedQuiz = await prisma.quiz.update({
      where: { id: quiz.id },
      data: {
        participations: {
          increment: 1
        }
      }
    })

    console.log('✅ Quiz-Submit: Participations updated:', updatedQuiz.participations)

    // Quiz-Auswertung durchführen
    let totalQuestions = 0
    let correctAnswers = 0
    let totalScore = 0
    const answerRecords = []

    // Durch alle Module gehen und Fragen auswerten
    for (const module of quiz.modules) {
      if (module.type === 'question' || module.type === 'randomQuestion') {
        totalQuestions++
        
        const userAnswer = answers[module.id]
        console.log(`🔍 Quiz-Submit: Evaluating module ${module.id}:`, {
          userAnswer,
          moduleData: module.data
        })

        let isCorrect = false
        let points = 0
        let correctChoices = ''
        let selectedChoices = ''

        if (module.type === 'question') {
          // Normale Quiz-Frage
          const questionData = module.data
          if (!questionData) {
            console.error('❌ Quiz-Submit: Question data is null')
            continue
          }
          let correctAnswerTexts = (questionData as any).correctAnswers || []
          const questionAnswers = (questionData as any).answers || []
          const questionType = (questionData as any).questionType || 'single'

          console.log(`🔍 Quiz-Submit: Question data:`, {
            correctAnswerTexts,
            questionAnswers,
            questionType,
            userAnswer
          })

          // Stelle sicher, dass correctAnswerTexts ein Array ist
          if (typeof correctAnswerTexts === 'string') {
            try {
              correctAnswerTexts = JSON.parse(correctAnswerTexts)
              // Handle double-escaped JSON
              if (typeof correctAnswerTexts === 'string') {
                correctAnswerTexts = JSON.parse(correctAnswerTexts)
              }
            } catch (error) {
              console.error('Error parsing correctAnswerTexts:', error, correctAnswerTexts)
              correctAnswerTexts = []
            }
          }

          // Stelle sicher, dass es ein Array ist
          if (!Array.isArray(correctAnswerTexts)) {
            console.error('correctAnswerTexts is not an array:', correctAnswerTexts)
            correctAnswerTexts = []
          }

          // Konvertiere Antworttexte zu Indizes
          const correctAnswerIndices = correctAnswerTexts.map((text: string) => 
            questionAnswers.findIndex((answer: string) => answer === text)
          ).filter((index: number) => index !== -1)

          console.log(`🔍 Quiz-Submit: Converted to indices:`, {
            correctAnswerTexts,
            correctAnswerIndices,
            questionAnswers
          })

          if (questionType === 'single') {
            // Einfachauswahl
            selectedChoices = JSON.stringify([userAnswer])
            correctChoices = JSON.stringify(correctAnswerIndices)
            isCorrect = correctAnswerIndices.includes(userAnswer)
            points = isCorrect ? 1 : 0
          } else {
            // Mehrfachauswahl - Teilpunkte
            const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
            const correctSet = new Set(correctAnswerIndices)
            const userSet = new Set(userAnswers)
            
            selectedChoices = JSON.stringify(userAnswers)
            correctChoices = JSON.stringify(correctAnswerIndices)
            
            // Teilpunkte berechnen: (richtige Antworten - falsche Antworten) / Gesamtantworten
            const correctCount = Array.from(userSet).filter(ans => correctSet.has(ans)).length
            const wrongCount = Array.from(userSet).filter(ans => !correctSet.has(ans)).length
            const totalCorrect = correctAnswerIndices.length
            
            if (totalCorrect > 0) {
              points = Math.max(0, (correctCount - wrongCount) / totalCorrect)
            }
            
            isCorrect = points === 1
          }
        } else if (module.type === 'randomQuestion') {
          // Random Question - hole die spezifische Frage die verwendet wurde
          const randomData = module.data
          if (!randomData) {
            console.error('❌ Quiz-Submit: Random data is null')
            continue
          }
          const usedQuestionId = (randomData as any).usedQuestionId
          const stackId = (randomData as any).stackId
          
          console.log(`🔍 Quiz-Submit: Processing random question for stack ${stackId}, usedQuestionId: ${usedQuestionId}`)
          
          let questionForEvaluation = null
          
          if (usedQuestionId) {
            // Hole die spezifische Frage die verwendet wurde
            questionForEvaluation = await prisma.questionStackItem.findUnique({
              where: { id: usedQuestionId }
            })
            console.log(`🔍 Quiz-Submit: Found specific question:`, questionForEvaluation)
          }
          
          // Fallback: Hole die erste Frage aus dem Stack
          if (!questionForEvaluation) {
            const stackQuestions = await prisma.questionStackItem.findMany({
              where: { stackId },
              orderBy: { order: 'asc' }
            })
            if (stackQuestions.length > 0) {
              questionForEvaluation = stackQuestions[0]
              console.log(`🔍 Quiz-Submit: Using fallback question:`, questionForEvaluation)
            }
          }
          
          if (questionForEvaluation) {
            let correctAnswerTexts: any[] = []
            let questionAnswers: any[] = []
            const questionType = questionForEvaluation.questionType || 'single'

            // Parse correctAnswerTexts with robust handling
            try {
              const correctAnswersRaw = questionForEvaluation.correctAnswers || '[]'
              correctAnswerTexts = JSON.parse(correctAnswersRaw)
              // Handle double-escaped JSON
              if (typeof correctAnswerTexts === 'string') {
                correctAnswerTexts = JSON.parse(correctAnswerTexts)
              }
            } catch (error) {
              console.error('Error parsing correctAnswerTexts:', error, questionForEvaluation.correctAnswers)
              correctAnswerTexts = []
            }

            // Parse questionAnswers with robust handling
            try {
              const questionAnswersRaw = questionForEvaluation.answers || '[]'
              questionAnswers = JSON.parse(questionAnswersRaw)
              // Handle double-escaped JSON
              if (typeof questionAnswers === 'string') {
                questionAnswers = JSON.parse(questionAnswers)
              }
            } catch (error) {
              console.error('Error parsing questionAnswers:', error, questionAnswers)
              questionAnswers = []
            }

            // Stelle sicher, dass es Arrays sind
            if (!Array.isArray(correctAnswerTexts)) {
              console.error('correctAnswerTexts is not an array:', correctAnswerTexts)
              correctAnswerTexts = []
            }
            if (!Array.isArray(questionAnswers)) {
              console.error('questionAnswers is not an array:', questionAnswers)
              questionAnswers = []
            }

            console.log(`🔍 Quiz-Submit: Random question data:`, {
              correctAnswerTexts,
              questionAnswers,
              questionType,
              userAnswer
            })

            // Konvertiere Antworttexte zu Indizes
            const correctAnswerIndices = correctAnswerTexts.map((text: string) => 
              questionAnswers.findIndex((answer: string) => answer === text)
            ).filter((index: number) => index !== -1)

            console.log(`🔍 Quiz-Submit: Random question converted to indices:`, {
              correctAnswerTexts,
              correctAnswerIndices,
              questionAnswers
            })

            if (questionType === 'single') {
              // Einfachauswahl
              selectedChoices = JSON.stringify([userAnswer])
              correctChoices = JSON.stringify(correctAnswerIndices)
              isCorrect = correctAnswerIndices.includes(userAnswer)
              points = isCorrect ? 1 : 0
            } else {
              // Mehrfachauswahl - Teilpunkte
              const userAnswers = Array.isArray(userAnswer) ? userAnswer : [userAnswer]
              const correctSet = new Set(correctAnswerIndices)
              const userSet = new Set(userAnswers)
              
              selectedChoices = JSON.stringify(userAnswers)
              correctChoices = JSON.stringify(correctAnswerIndices)
              
              // Teilpunkte berechnen
              const correctCount = Array.from(userSet).filter(ans => correctSet.has(ans)).length
              const wrongCount = Array.from(userSet).filter(ans => !correctSet.has(ans)).length
              const totalCorrect = correctAnswerIndices.length
              
              if (totalCorrect > 0) {
                points = Math.max(0, (correctCount - wrongCount) / totalCorrect)
              }
              
              isCorrect = points === 1
            }
            
            console.log(`📊 Quiz-Submit: Random question evaluation:`, {
              questionType,
              userAnswer,
              correctAnswerIndices,
              isCorrect,
              points
            })
          } else {
            console.log(`⚠️ Quiz-Submit: No questions found in stack ${stackId}`)
            selectedChoices = JSON.stringify([userAnswer])
            correctChoices = JSON.stringify([])
            isCorrect = false
            points = 0
          }
        }

        if (isCorrect) {
          correctAnswers++
        }
        totalScore += points

        console.log(`📊 Quiz-Submit: Module ${module.id} result:`, {
          isCorrect,
          points,
          correctChoices,
          selectedChoices
        })

        // Answer Record für Datenbank erstellen
        answerRecords.push({
          attemptId: '', // wird später gesetzt
          moduleId: module.id,
          choiceIds: selectedChoices, // Für Backward Compatibility
          isCorrect,
          correctChoices,
          selectedChoices,
          createdAt: new Date()
        })
      }
    }

    // Berechne finale Punktzahl als Prozent
    const finalScore = totalQuestions > 0 ? (totalScore / totalQuestions) * 100 : 0

    console.log('📊 Quiz-Submit: Final evaluation:', {
      totalQuestions,
      correctAnswers,
      totalScore,
      finalScore: finalScore.toFixed(2) + '%'
    })

    // Attempt mit korrekten Werten erstellen
    const attempt = await prisma.attempt.create({
      data: {
        quizId: quiz.id,
        lang: 'de',
        questionOrder: JSON.stringify(Object.keys(answers)),
        finishedAt: new Date(),
        clientHint: 'web',
        totalQuestions,
        correctAnswers,
        score: finalScore
      }
    })

    console.log('✅ Quiz-Submit: Attempt created:', attempt.id)

    // Answer Records mit attemptId erstellen
    const answersWithAttemptId = answerRecords.map(record => ({
      ...record,
      attemptId: attempt.id
    }))

    await prisma.answer.createMany({
      data: answersWithAttemptId
    })

    console.log('✅ Quiz-Submit: Answer records created:', answersWithAttemptId.length)

    return NextResponse.json({
      success: true,
      participations: updatedQuiz.participations,
      attemptId: attempt.id,
      results: {
        totalQuestions,
        correctAnswers,
        score: finalScore,
        percentage: finalScore.toFixed(1) + '%'
      },
      message: 'Quiz erfolgreich abgegeben'
    })

  } catch (error) {
    console.error('💥 Quiz-Submit: Error submitting quiz:', error)
    return NextResponse.json(
      { error: 'Fehler beim Abgeben des Quiz' },
      { status: 500 }
    )
  }
}
