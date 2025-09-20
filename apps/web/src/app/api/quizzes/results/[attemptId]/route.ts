import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { attemptId: string } }
) {
  try {
    // Read desired language from query (default to 'de')
    const url = new URL(request.url)
    const langParam = (url.searchParams.get('lang') || 'de').toLowerCase()
    const lang: 'de' | 'en' | 'fr' = ['de', 'en', 'fr'].includes(langParam) ? (langParam as any) : 'de'

    const { attemptId } = params

    console.log('🔍 Quiz-Results: Starting with attemptId:', attemptId)

    // Attempt mit allen Antworten laden
    const attempt = await prisma.attempt.findUnique({
      where: { id: attemptId },
      include: {
        answers: {
          orderBy: { createdAt: 'asc' }
        },
        Quiz: {
          include: {
            modules: {
              where: {
                type: { in: ['question', 'randomQuestion'] }
              },
              orderBy: { order: 'asc' }
            }
          }
        }
      }
    })

    if (!attempt) {
      console.log('❌ Quiz-Results: Attempt not found')
      return NextResponse.json(
        { error: 'Versuch nicht gefunden' },
        { status: 404 }
      )
    }

    console.log('✅ Quiz-Results: Attempt found')
    console.log('📊 Quiz-Results: Attempt data:', {
      id: attempt.id,
      quizId: attempt.quizId,
      totalQuestions: attempt.totalQuestions,
      correctAnswers: attempt.correctAnswers,
      score: attempt.score
    })
    console.log('📊 Quiz-Results: Quiz data:', {
      id: attempt.Quiz.id,
      title: attempt.Quiz.title,
      modulesCount: attempt.Quiz.modules.length
    })
    console.log('📊 Quiz-Results: Modules:', attempt.Quiz.modules.map(m => ({
      id: m.id,
      type: m.type,
      data: m.data
    })))
    console.log('📊 Quiz-Results: Answers:', attempt.answers.map(a => ({
      id: a.id,
      moduleId: a.moduleId,
      selectedChoices: a.selectedChoices,
      correctChoices: a.correctChoices,
      isCorrect: a.isCorrect
    })))

    console.log('✅ Quiz-Results: Attempt found, processing answers')

    // Helpers to normalize multilingual fields
    const getTextInLanguage = (value: any): string => {
      if (!value) return 'Unbekannte Frage'
      if (typeof value === 'string') return value
      if (typeof value === 'object' && value !== null) {
        return value[lang] || value.de || value.en || value.fr || 'Unbekannte Frage'
      }
      return 'Unbekannte Frage'
    }

    const getAnswersInLanguage = (value: any): string[] => {
      if (!value) return []
      if (Array.isArray(value)) return value
      if (typeof value === 'object' && value !== null) {
        const arr = value[lang] || value.de || value.en || value.fr
        return Array.isArray(arr) ? arr : []
      }
      return []
    }

    const safeParseArray = (raw: any): any[] => {
      try {
        if (Array.isArray(raw)) return raw
        let parsed = typeof raw === 'string' ? JSON.parse(raw) : raw
        if (typeof parsed === 'string') parsed = JSON.parse(parsed)
        return Array.isArray(parsed) ? parsed : []
      } catch {
        return []
      }
    }

    // Antworten mit Fragen verknüpfen
    const answersWithQuestions = await Promise.all(attempt.answers.map(async (answer, index) => {
      console.log(`🔍 Quiz-Results: Processing answer ${index + 1}/${attempt.answers.length}`)
      console.log(`🔍 Quiz-Results: Answer data:`, answer)
      
      const module = attempt.Quiz.modules.find(m => m.id === answer.moduleId)
      console.log(`🔍 Quiz-Results: Found module:`, module)
      
      let questionText: string = 'Unbekannte Frage'
      let questionAnswers: string[] = []
      let questionType = 'single'
      
      if (module && module.type === 'question') {
        console.log(`🔍 Quiz-Results: Processing normal question module`)
        console.log(`🔍 Quiz-Results: Module data:`, module.data)
        const moduleData = module.data as any

        // Für normale Fragen: Daten direkt aus dem Module (multilingual unterstützt)
        questionText = getTextInLanguage(moduleData.question)
        questionAnswers = getAnswersInLanguage(moduleData.answers)
        questionType = moduleData.questionType || 'single'
        
        console.log(`🔍 Quiz-Results: Normal question data:`, {
          questionText,
          questionAnswers,
          questionType,
          moduleData
        })
        } else if (module && module.type === 'randomQuestion') {
          console.log(`🔍 Quiz-Results: Processing random question module`)
          const randomData = module.data as any
          // Präferenz: aus gespeicherter Answer.usedQuestionId lesen
          const usedQuestionId = (answer as any).usedQuestionId || randomData.usedQuestionId
          const stackId = randomData.stackId
          
          console.log('🔍 Quiz-Results: Random question data:', { usedQuestionId, stackId, randomData })
          
          const pickAnswersWithFallback = (q: any): string[] => {
            const tryParse = (raw: any): string[] => {
              try {
                if (Array.isArray(raw)) return raw
                if (typeof raw === 'string') {
                  const parsed = JSON.parse(raw)
                  return Array.isArray(parsed) ? parsed : []
                }
              } catch {}
              return []
            }
            if (lang === 'en') {
              const en = tryParse(q.answersEn)
              return en.length ? en : tryParse(q.answers)
            }
            if (lang === 'fr') {
              const fr = tryParse(q.answersFr)
              return fr.length ? fr : tryParse(q.answers)
            }
            return tryParse(q.answers)
          }

          if (usedQuestionId) {
            // gezielte Frage laden
            const q = await prisma.questionStackItem.findUnique({ where: { id: usedQuestionId } })
            if (q) {
              const questionForDisplay: any = q
              if (lang === 'en') {
                questionText = questionForDisplay.questionEn || questionForDisplay.question || 'Random question'
                const enAnswers = safeParseArray(questionForDisplay.answersEn)
                questionAnswers = enAnswers.length ? enAnswers : safeParseArray(questionForDisplay.answers)
              } else if (lang === 'fr') {
                questionText = questionForDisplay.questionFr || questionForDisplay.question || 'Question aléatoire'
                const frAnswers = safeParseArray(questionForDisplay.answersFr)
                questionAnswers = frAnswers.length ? frAnswers : safeParseArray(questionForDisplay.answers)
              } else {
                questionText = questionForDisplay.question || 'Zufällige Frage'
                questionAnswers = safeParseArray(questionForDisplay.answers)
              }
              questionType = questionForDisplay.questionType || 'single'
            }
          } else if (stackId) {
            // Fallback: erste Frage aus dem Stapel
            const stackQuestions = await prisma.questionStackItem.findMany({
              where: { stackId },
              orderBy: { order: 'asc' }
            })
            if (stackQuestions.length > 0) {
              const questionForDisplay: any = stackQuestions[0]
              if (lang === 'en') {
                questionText = questionForDisplay.questionEn || questionForDisplay.question || 'Random question'
                const enAnswers = safeParseArray(questionForDisplay.answersEn)
                questionAnswers = enAnswers.length ? enAnswers : safeParseArray(questionForDisplay.answers)
              } else if (lang === 'fr') {
                questionText = questionForDisplay.questionFr || questionForDisplay.question || 'Question aléatoire'
                const frAnswers = safeParseArray(questionForDisplay.answersFr)
                questionAnswers = frAnswers.length ? frAnswers : safeParseArray(questionForDisplay.answers)
              } else {
                questionText = questionForDisplay.question || 'Zufällige Frage'
                questionAnswers = safeParseArray(questionForDisplay.answers)
              }
              questionType = questionForDisplay.questionType || 'single'
            }
          }
        } else {
        console.log(`🔍 Quiz-Results: No module found for answer.moduleId: ${answer.moduleId}`)
      }

      console.log('🔍 Quiz-Results: Final processing for answer:', {
        moduleId: answer.moduleId,
        moduleType: module?.type,
        questionText,
        questionAnswers,
        correctChoices: answer.correctChoices,
        selectedChoices: answer.selectedChoices,
        rawAnswer: answer
      })

      const parsedSelectedChoices = (() => {
        try {
          if (Array.isArray(answer.selectedChoices)) {
            console.log('🔍 Quiz-Results: selectedChoices is already array:', answer.selectedChoices)
            return answer.selectedChoices
          }
          console.log('🔍 Quiz-Results: Parsing selectedChoices string:', answer.selectedChoices)
          const parsed = JSON.parse(answer.selectedChoices || '[]')
          console.log('🔍 Quiz-Results: Parsed selectedChoices:', parsed)
          return parsed
        } catch (error) {
          console.error('🔍 Quiz-Results: Error parsing selectedChoices:', error, answer.selectedChoices)
          return []
        }
      })()

      const parsedCorrectChoices = (() => {
        try {
          if (Array.isArray(answer.correctChoices)) {
            console.log('🔍 Quiz-Results: correctChoices is already array:', answer.correctChoices)
            return answer.correctChoices
          }
          console.log('🔍 Quiz-Results: Parsing correctChoices string:', answer.correctChoices)
          let parsed = JSON.parse(answer.correctChoices || '[]')
          console.log('🔍 Quiz-Results: First parse result:', parsed)
          // Handle double-escaped JSON
          if (typeof parsed === 'string') {
            console.log('🔍 Quiz-Results: Double-escaped detected, parsing again:', parsed)
            parsed = JSON.parse(parsed)
            console.log('🔍 Quiz-Results: Second parse result:', parsed)
          }
          console.log('🔍 Quiz-Results: Final parsed correctChoices:', parsed)
          return parsed
        } catch (error) {
          console.error('🔍 Quiz-Results: Error parsing correctChoices:', error, answer.correctChoices)
          return []
        }
      })()

      const result = {
        moduleId: answer.moduleId,
        questionText,
        questionAnswers,
        questionType,
        selectedChoices: parsedSelectedChoices,
        correctChoices: parsedCorrectChoices,
        isCorrect: answer.isCorrect,
        points: typeof (answer as any).points === 'number' ? (answer as any).points : (answer.isCorrect ? 1 : 0)
      }

      console.log('🔍 Quiz-Results: Final result for answer:', result)
      return result
    }))

    const result = {
      attemptId: attempt.id,
      quizTitle: attempt.Quiz.title,
      finishedAt: attempt.finishedAt,
      score: {
        totalQuestions: attempt.totalQuestions,
        correctAnswers: attempt.correctAnswers,
        score: attempt.score,
        percentage: attempt.score.toFixed(1) + '%'
      },
      answers: answersWithQuestions
    }

    console.log('✅ Quiz-Results: Results prepared successfully')
    console.log('📊 Quiz-Results: Final result:', result)
    console.log('📊 Quiz-Results: Answers with questions:', answersWithQuestions)

    return NextResponse.json(result)

  } catch (error) {
    console.error('💥 Quiz-Results: Error loading results:', error)
    return NextResponse.json(
      { error: 'Fehler beim Laden der Ergebnisse' },
      { status: 500 }
    )
  }
}
