import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

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

      console.log('Creating new questions...')
      // Create new questions
      const newQuestions = await Promise.all(
        questions.map((question: any, index: number) => {
          console.log(`Creating question ${index + 1}:`, question.question)
          return tx.questionStackItem.create({
            data: {
              stackId: id,
              question: question.question.trim(),
              answers: JSON.stringify(question.answers),
              correctAnswers: JSON.stringify(question.correctAnswers),
              questionType: question.questionType,
              order: index + 1
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
      message: error.message,
      stack: error.stack,
      name: error.name
    })
    return NextResponse.json(
      { error: 'Failed to save question stack', details: error.message },
      { status: 500 }
    )
  }
}