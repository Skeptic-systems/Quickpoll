import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { question, answers, correctAnswers, questionType = 'single' } = await request.json()

    if (!question || !answers || !correctAnswers) {
      return NextResponse.json(
        { error: 'Question, answers, and correctAnswers are required' },
        { status: 400 }
      )
    }

    // Validate questionType
    if (!['single', 'multiple'].includes(questionType)) {
      return NextResponse.json(
        { error: 'questionType must be either "single" or "multiple"' },
        { status: 400 }
      )
    }

    // For single choice, ensure only one correct answer
    if (questionType === 'single' && Array.isArray(correctAnswers) && correctAnswers.length !== 1) {
      return NextResponse.json(
        { error: 'Single choice questions must have exactly one correct answer' },
        { status: 400 }
      )
    }

    // Get the current max order for this stack
    const maxOrder = await prisma.questionStackItem.findFirst({
      where: { stackId: params.id },
      orderBy: { order: 'desc' },
      select: { order: true }
    })

    const questionStackItem = await prisma.questionStackItem.create({
      data: {
        stackId: params.id,
        question: question.trim(),
        answers: JSON.stringify(answers),
        correctAnswers: JSON.stringify(correctAnswers),
        questionType: questionType,
        order: (maxOrder?.order || 0) + 1
      }
    })

    return NextResponse.json({ questionStackItem })
  } catch (error) {
    console.error('Error creating question stack item:', error)
    return NextResponse.json(
      { error: 'Failed to create question stack item' },
      { status: 500 }
    )
  }
}
