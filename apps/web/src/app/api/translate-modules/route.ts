import { NextRequest, NextResponse } from 'next/server'
import { translateModulesArray } from '@/lib/translation'

export const dynamic = 'force-dynamic'
export const revalidate = 0

// Types moved to shared util

// Deprecated: internal translateText via HTTP removed in favor of direct DeepL util

// Translation logic moved to shared util

export async function POST(request: NextRequest) {
  try {
    const { modules } = await request.json()

    if (!modules || !Array.isArray(modules)) {
      return NextResponse.json(
        { error: 'Modules array is required' },
        { status: 400 }
      )
    }

    const translatedModules = await translateModulesArray(modules)

    return NextResponse.json({
      success: true,
      translatedModules
    })

  } catch (error) {
    console.error('Error translating modules:', error)
    return NextResponse.json(
      { error: 'Failed to translate modules' },
      { status: 500 }
    )
  }
}
