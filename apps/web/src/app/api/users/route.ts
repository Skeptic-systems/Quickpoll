import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

export async function DELETE(request: NextRequest) {
  try {
    // Delete all users (for testing purposes)
    await prisma.user.deleteMany()
    
    return NextResponse.json({ 
      success: true, 
      message: 'All users deleted'
    })
  } catch (error) {
    console.error('Error deleting users:', error)
    return NextResponse.json(
      { error: 'Failed to delete users', details: error instanceof Error ? error.message : 'Unknown error' },
      { status: 500 }
    )
  }
}