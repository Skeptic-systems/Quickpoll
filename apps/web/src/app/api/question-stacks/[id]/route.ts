import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const questionStack = await prisma.questionStack.findUnique({
      where: { id: params.id },
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

    return NextResponse.json({ questionStack })
  } catch (error) {
    console.error('Error fetching question stack:', error)
    return NextResponse.json(
      { error: 'Failed to fetch question stack' },
      { status: 500 }
    )
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const questionStack = await prisma.questionStack.update({
      where: { id: params.id },
      data: {
        name: name.trim()
      },
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      }
    })

    return NextResponse.json({ questionStack })
  } catch (error) {
    console.error('Error updating question stack:', error)
    return NextResponse.json(
      { error: 'Failed to update question stack' },
      { status: 500 }
    )
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    await prisma.questionStack.delete({
      where: { id: params.id }
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error deleting question stack:', error)
    return NextResponse.json(
      { error: 'Failed to delete question stack' },
      { status: 500 }
    )
  }
}
