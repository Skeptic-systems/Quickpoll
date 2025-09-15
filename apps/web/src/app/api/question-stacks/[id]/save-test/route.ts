import { NextRequest, NextResponse } from 'next/server'

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

    console.log('Simulating database save...')
    console.log(`Would save stack "${name}" with ${questions.length} questions`)

    // Simulate successful save
    return NextResponse.json({
      success: true,
      questionStack: {
        id: id,
        name: name,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      },
      questions: questions.map((q: any, index: number) => ({
        id: q.id || `saved-${index}`,
        stackId: id,
        question: q.question,
        answers: q.answers,
        correctAnswers: q.correctAnswers,
        questionType: q.questionType,
        order: q.order || index + 1,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
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

