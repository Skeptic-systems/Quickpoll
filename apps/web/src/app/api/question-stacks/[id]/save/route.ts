import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

// Helper function to translate text using DeepL
async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

    if (!DEEPL_API_KEY) {
      console.warn('DeepL API key not configured, returning original text')
      return text
    }

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        source_lang: 'DE', // Assume German as source language
      }),
    })

    if (!response.ok) {
      console.error('DeepL API error:', response.status)
      return text // Return original text if translation fails
    }

    const result = await response.json()
    
    if (result.translations && result.translations.length > 0) {
      return result.translations[0].text
    } else {
      return text
    }
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text if translation fails
  }
}

export async function POST(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    console.log('POST /api/question-stacks/[id]/save called')
    const { id } = params
    console.log('Stack ID:', id)
    
    const body = await request.json()
    console.log('Request body:', body)
    
    const { name, questions } = body

    if (!id) {
      console.log('Error: Stack ID is required')
      return NextResponse.json(
        { error: 'Stack ID is required' },
        { status: 400 }
      )
    }

    if (!name) {
      console.log('Error: Name is required')
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    if (!questions || !Array.isArray(questions)) {
      console.log('Error: Questions array is required')
      return NextResponse.json(
        { error: 'Questions array is required' },
        { status: 400 }
      )
    }

    console.log('Starting database transaction...')
    const result = await prisma.$transaction(async (tx) => {
      console.log('Updating question stack name...')
      // Update question stack name
      const updatedStack = await tx.questionStack.update({
        where: { id },
        data: {
          name: name.trim(),
          updatedAt: new Date()
        }
      })
      console.log('Updated stack:', updatedStack)

      console.log('Deleting existing questions...')
      // Delete all existing questions for this stack
      const deletedCount = await tx.questionStackItem.deleteMany({
        where: { stackId: id }
      })
      console.log('Deleted questions count:', deletedCount.count)

      console.log('Creating new questions with translations...')
      // Create new questions with translations
      const newQuestions = await Promise.all(
        questions.map(async (question: any, index: number) => {
          console.log(`Creating question ${index + 1}:`, question.question)
          
          // Translate question text
          const questionEn = await translateText(question.question.trim(), 'EN')
          const questionFr = await translateText(question.question.trim(), 'FR')
          
          // Translate answers
          const answersEn = await Promise.all(
            question.answers.map((answer: string) => translateText(answer.trim(), 'EN'))
          )
          const answersFr = await Promise.all(
            question.answers.map((answer: string) => translateText(answer.trim(), 'FR'))
          )
          
          console.log(`Translated question ${index + 1}:`)
          console.log(`  DE: ${question.question}`)
          console.log(`  EN: ${questionEn}`)
          console.log(`  FR: ${questionFr}`)
          
          return tx.questionStackItem.create({
            data: {
              stackId: id,
              question: question.question.trim(),
              answers: JSON.stringify(question.answers),
              correctAnswers: JSON.stringify(question.correctAnswers),
              questionType: question.questionType,
              order: index + 1,
              // Store translations
              questionEn: questionEn,
              questionFr: questionFr,
              answersEn: JSON.stringify(answersEn),
              answersFr: JSON.stringify(answersFr)
            }
          })
        })
      )
      console.log('Created questions count:', newQuestions.length)

      return {
        questionStack: updatedStack,
        questions: newQuestions
      }
    })
    console.log('Transaction completed successfully')

    return NextResponse.json({
      success: true,
      questionStack: {
        id: result.questionStack.id,
        name: result.questionStack.name,
        createdAt: result.questionStack.createdAt,
        updatedAt: result.questionStack.updatedAt
      },
      questions: result.questions.map(q => ({
        id: q.id,
        stackId: q.stackId,
        question: q.question,
        answers: JSON.parse(q.answers),
        correctAnswers: JSON.parse(q.correctAnswers),
        questionType: q.questionType,
        order: q.order,
        createdAt: q.createdAt,
        updatedAt: q.updatedAt
      }))
    })

  } catch (error) {
    console.error('Error saving question stack:', error)
    console.error('Error details:', {
      message: error instanceof Error ? error.message : 'Unknown error',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : 'Unknown'
    })
    return NextResponse.json(
      { error: 'Failed to save question stack', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}