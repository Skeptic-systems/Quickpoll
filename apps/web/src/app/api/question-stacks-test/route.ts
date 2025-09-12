import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  try {
    console.log('GET /api/question-stacks-test called')
    
    // Return mock data instead of using Prisma
    const mockQuestionStacks = [
      {
        id: 'test-1',
        name: 'Test Stack 1',
        questions: [
          {
            id: 'q-1',
            stackId: 'test-1',
            question: 'Test Question 1',
            answers: ['Answer A', 'Answer B'],
            correctAnswers: ['Answer A'],
            questionType: 'single',
            order: 1,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
          }
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }
    ]

    return NextResponse.json({
      questionStacks: mockQuestionStacks
    })

  } catch (error) {
    console.error('Error fetching question stacks:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question stacks' },
      { status: 500 }
    )
  }
}
