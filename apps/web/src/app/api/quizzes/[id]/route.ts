import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // Find quiz by ID
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        modules: {
          orderBy: { order: 'asc' }
        },
        _count: {
          select: {
            modules: true,
            attempts: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    console.log(`Found quiz: ${quiz.title} (ID: ${id})`)
    console.log(`Quiz slug: ${quiz.slug}`)
    console.log(`Quiz has ${quiz._count.modules} modules`)

    return NextResponse.json(quiz)
  } catch (error) {
    console.error('Error fetching quiz:', error)
    return NextResponse.json(
      { error: 'Failed to fetch quiz' },
      { status: 500 }
    )
  }
}

export async function DELETE(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params

    if (!id) {
      return NextResponse.json(
        { error: 'Quiz ID is required' },
        { status: 400 }
      )
    }

    // Check if quiz exists
    const quiz = await prisma.quiz.findUnique({
      where: { id },
      include: {
        _count: {
          select: {
            modules: true,
            attempts: true
          }
        }
      }
    })

    if (!quiz) {
      return NextResponse.json(
        { error: 'Quiz not found' },
        { status: 404 }
      )
    }

    console.log(`Deleting quiz: ${quiz.title} (ID: ${id})`)
    console.log(`Quiz has ${quiz._count.modules} modules and ${quiz._count.attempts} attempts`)

    // Delete quiz and all related data (cascade delete)
    await prisma.quiz.delete({
      where: { id }
    })

    console.log(`Successfully deleted quiz: ${quiz.title}`)

    return NextResponse.json({ 
      success: true,
      message: `Quiz "${quiz.title}" wurde erfolgreich gelöscht`
    })
  } catch (error) {
    console.error('Error deleting quiz:', error)
    return NextResponse.json(
      { error: 'Failed to delete quiz' },
      { status: 500 }
    )
  }
}