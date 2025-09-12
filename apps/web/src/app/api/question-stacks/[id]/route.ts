import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Stack ID is required' },
        { status: 400 }
      )
    }

    // Fetch question stack with questions
    const questionStack = await prisma.questionStack.findUnique({
      where: { id },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    if (!questionStack) {
      return NextResponse.json(
        { error: 'Question stack not found' },
        { status: 404 }
      )
    }

    return NextResponse.json({
      id: questionStack.id,
      name: questionStack.name,
      questions: questionStack.questions.map(item => ({
        id: item.id,
        stackId: item.stackId,
        question: item.question,
        answers: JSON.parse(item.answers),
        correctAnswers: JSON.parse(item.correctAnswers),
        questionType: item.questionType,
        order: item.order,
        createdAt: item.createdAt,
        updatedAt: item.updatedAt
      })),
      createdAt: questionStack.createdAt,
      updatedAt: questionStack.updatedAt
    })

  } catch (error) {
    console.error('Error fetching question stack:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question stack' },
      { status: 500 }
    )
  }
}

export async function PUT(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params
    const { name } = await request.json()

    if (!id) {
      return NextResponse.json(
        { error: 'Stack ID is required' },
        { status: 400 }
      )
    }

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Update question stack name
    const updatedStack = await prisma.questionStack.update({
      where: { id },
      data: {
        name: name.trim(),
        updatedAt: new Date()
      }
    })

    return NextResponse.json({
      success: true,
      questionStack: {
        id: updatedStack.id,
        name: updatedStack.name,
        createdAt: updatedStack.createdAt,
        updatedAt: updatedStack.updatedAt
      }
    })

  } catch (error) {
    console.error('Error updating question stack:', error)
    return NextResponse.json(
      { error: 'Failed to update question stack' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Stack ID is required' },
        { status: 400 }
      )
    }

    // Delete question stack (items will be deleted automatically due to cascade)
    await prisma.questionStack.delete({
      where: { id }
    })

    return NextResponse.json({
      success: true,
      message: 'Question stack deleted successfully'
    })

  } catch (error) {
    console.error('Error deleting question stack:', error)
    return NextResponse.json(
      { error: 'Failed to delete question stack' },
      { status: 500 }
    )
  }
}