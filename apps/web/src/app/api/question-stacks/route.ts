import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    // For now, skip authentication check to debug the issue
    // TODO: Re-enable authentication once working
    /*
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    */

    // Fetch question stacks from database
    const questionStacks = await prisma.questionStack.findMany({
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    console.log('Fetched question stacks:', questionStacks.length)

    return NextResponse.json({
      questionStacks: questionStacks.map(stack => ({
        id: stack.id,
        name: stack.name,
        questions: stack.questions.map(item => ({
          id: item.id,
          stackId: item.stackId,
          question: item.question,
          answers: JSON.parse(item.answers),
          correctAnswer: JSON.parse(item.correctAnswers),
          order: item.order,
          createdAt: item.createdAt,
          updatedAt: item.updatedAt
        })),
        createdAt: stack.createdAt,
        updatedAt: stack.updatedAt
      }))
    })

  } catch (error) {
    console.error('Error fetching question stacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question stacks' },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  try {
    // For now, skip authentication check to debug the issue
    // TODO: Re-enable authentication once working
    /*
    const sessionToken = request.cookies.get('session-token')?.value

    if (!sessionToken) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }
    */

    const { name } = await request.json()

    if (!name) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    // Create new question stack
    const questionStack = await prisma.questionStack.create({
      data: {
        name: name.trim()
      }
    })

    console.log('Created question stack:', questionStack)

    return NextResponse.json({
      success: true,
      questionStack: {
        id: questionStack.id,
        name: questionStack.name,
        questions: [],
        createdAt: questionStack.createdAt,
        updatedAt: questionStack.updatedAt
      }
    })

  } catch (error) {
    console.error('Error creating question stack:', error)
    return NextResponse.json(
      { error: 'Failed to create question stack' },
      { status: 500 }
    )
  }
}