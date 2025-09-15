import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const stackId = searchParams.get('stackId')
    const count = parseInt(searchParams.get('count') || '1')
    const language = searchParams.get('language') || 'de' // Default to German

    if (!stackId) {
      return NextResponse.json(
        { error: 'Stack ID is required' },
        { status: 400 }
      )
    }

    console.log(`🔍 Random-Question API: Loading ${count} questions for stack ${stackId} in language ${language}`)

    // Get all questions from the stack
    const questions = await prisma.questionStackItem.findMany({
      where: { stackId },
      orderBy: { order: 'asc' }
    })

    if (questions.length === 0) {
      return NextResponse.json(
        { error: 'No questions found in this stack' },
        { status: 404 }
      )
    }

    console.log(`📊 Random-Question API: Found ${questions.length} questions in stack`)

    // Helper function to get text in the requested language
    const getTextInLanguage = (question: any, field: string): string => {
      switch (language.toLowerCase()) {
        case 'en':
          return question[`${field}En`] || question[field]
        case 'fr':
          return question[`${field}Fr`] || question[field]
        default:
          return question[field]
      }
    }

    // Helper function to get answers in the requested language
    const getAnswersInLanguage = (question: any): string[] => {
      let answers: string[]
      switch (language.toLowerCase()) {
        case 'en':
          answers = question.answersEn ? JSON.parse(question.answersEn) : JSON.parse(question.answers)
          break
        case 'fr':
          answers = question.answersFr ? JSON.parse(question.answersFr) : JSON.parse(question.answers)
          break
        default:
          answers = JSON.parse(question.answers)
      }
      return answers
    }

    // If only one question is requested, return a single random question
    if (count === 1) {
      const randomIndex = Math.floor(Math.random() * questions.length)
      const randomQuestion = questions[randomIndex]

      const answers = getAnswersInLanguage(randomQuestion)
      const correctAnswers = JSON.parse(randomQuestion.correctAnswers)

      return NextResponse.json({
        success: true,
        question: {
          id: randomQuestion.id,
          question: getTextInLanguage(randomQuestion, 'question'),
          answers: answers,
          correctAnswers: correctAnswers,
          questionType: randomQuestion.questionType,
          stackId: randomQuestion.stackId
        }
      })
    }

    // If multiple questions are requested, return unique random questions
    const selectedQuestions = []
    const usedIndices = new Set<number>()

    // Shuffle the questions array to get random order
    const shuffledQuestions = [...questions].sort(() => Math.random() - 0.5)

    // Select unique questions up to the requested count
    for (let i = 0; i < Math.min(count, questions.length); i++) {
      const question = shuffledQuestions[i]
      
      const answers = getAnswersInLanguage(question)
      const correctAnswers = JSON.parse(question.correctAnswers)

      selectedQuestions.push({
        id: question.id,
        question: getTextInLanguage(question, 'question'),
        answers: answers,
        correctAnswers: correctAnswers,
        questionType: question.questionType,
        stackId: question.stackId
      })
    }

    console.log(`✅ Random-Question API: Returning ${selectedQuestions.length} unique questions`)

    return NextResponse.json({
      success: true,
      questions: selectedQuestions
    })

  } catch (error) {
    console.error('❌ Random-Question API: Error fetching questions:', error)
    return NextResponse.json(
      { error: 'Failed to fetch questions' },
      { status: 500 }
    )
  }
}
