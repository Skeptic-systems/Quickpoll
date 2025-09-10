import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET() {
  try {
    const questionStacks = await prisma.questionStack.findMany({
      include: {
        questions: {
          orderBy: { order: 'asc' }
        }
      },
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json({ questionStacks })
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
    const { name } = await request.json()

    if (!name || !name.trim()) {
      return NextResponse.json(
        { error: 'Name is required' },
        { status: 400 }
      )
    }

    const questionStack = await prisma.questionStack.create({
      data: {
        name: name.trim()
      },
      include: {
        questions: true
      }
    })

    return NextResponse.json({ questionStack })
  } catch (error) {
    console.error('Error creating question stack:', error)
    return NextResponse.json(
      { error: 'Failed to create question stack' },
      { status: 500 }
    )
  }
}
