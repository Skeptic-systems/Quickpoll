import { NextRequest, NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'
export const revalidate = 0

interface ModuleData {
  question?: string
  answers?: string[]
  content?: string
  text?: string
  description?: string
  stackId?: string
  stackName?: string
}

interface TranslatedModuleData {
  question?: {
    de: string
    en: string
    fr: string
  }
  answers?: {
    de: string[]
    en: string[]
    fr: string[]
  }
  content?: {
    de: string
    en: string
    fr: string
  }
  text?: {
    de: string
    en: string
    fr: string
  }
  description?: {
    de: string
    en: string
    fr: string
  }
  stackId?: string
  stackName?: string
}

async function translateText(text: string, targetLang: string): Promise<string> {
  try {
    const baseUrl = process.env.NEXTAUTH_URL || 'http://localhost:3000'
    const response = await fetch(`${baseUrl}/api/translate`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        text: text,
        targetLang: targetLang,
      }),
    })

    if (!response.ok) {
      throw new Error(`Translation failed for ${targetLang}`)
    }

    const result = await response.json()
    return result.translatedText
  } catch (error) {
    console.error(`Error translating to ${targetLang}:`, error)
    return text // Return original text if translation fails
  }
}

async function translateModuleData(moduleData: ModuleData): Promise<TranslatedModuleData> {
  const translatedData: TranslatedModuleData = {}

  // Translate question
  if (moduleData.question) {
    const [enQuestion, frQuestion] = await Promise.all([
      translateText(moduleData.question, 'EN'),
      translateText(moduleData.question, 'FR')
    ])
    
    translatedData.question = {
      de: moduleData.question,
      en: enQuestion,
      fr: frQuestion
    }
  }

  // Translate answers
  if (moduleData.answers && moduleData.answers.length > 0) {
    const enAnswers: string[] = []
    const frAnswers: string[] = []
    
    for (const answer of moduleData.answers) {
      const [enAnswer, frAnswer] = await Promise.all([
        translateText(answer, 'EN'),
        translateText(answer, 'FR')
      ])
      enAnswers.push(enAnswer)
      frAnswers.push(frAnswer)
    }
    
    translatedData.answers = {
      de: moduleData.answers,
      en: enAnswers,
      fr: frAnswers
    }
  }

  // Translate content
  if (moduleData.content) {
    const [enContent, frContent] = await Promise.all([
      translateText(moduleData.content, 'EN'),
      translateText(moduleData.content, 'FR')
    ])
    
    translatedData.content = {
      de: moduleData.content,
      en: enContent,
      fr: frContent
    }
  }

  // Translate text (for title modules)
  if (moduleData.text) {
    const [enText, frText] = await Promise.all([
      translateText(moduleData.text, 'EN'),
      translateText(moduleData.text, 'FR')
    ])
    
    translatedData.text = {
      de: moduleData.text,
      en: enText,
      fr: frText
    }
  }

  // Translate description
  if (moduleData.description) {
    const [enDescription, frDescription] = await Promise.all([
      translateText(moduleData.description, 'EN'),
      translateText(moduleData.description, 'FR')
    ])
    
    translatedData.description = {
      de: moduleData.description,
      en: enDescription,
      fr: frDescription
    }
  }

  // Copy non-translatable fields
  if (moduleData.stackId) {
    translatedData.stackId = moduleData.stackId
  }
  if (moduleData.stackName) {
    translatedData.stackName = moduleData.stackName
  }

  return translatedData
}

export async function POST(request: NextRequest) {
  try {
    const { modules } = await request.json()

    if (!modules || !Array.isArray(modules)) {
      return NextResponse.json(
        { error: 'Modules array is required' },
        { status: 400 }
      )
    }

    const translatedModules = []

    for (const module of modules) {
      const translatedData = await translateModuleData(module.data)
      
      translatedModules.push({
        ...module,
        data: translatedData
      })
    }

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
