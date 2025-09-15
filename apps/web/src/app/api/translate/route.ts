import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text and target language are required' },
        { status: 400 }
      )
    }

    // DeepL API configuration
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

    if (!DEEPL_API_KEY) {
      return NextResponse.json(
        { error: 'DeepL API key not configured' },
        { status: 500 }
      )
    }

    // Translate text using DeepL API
    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        source_lang: 'DE', // Assume German as source language
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error('DeepL API error:', response.status, errorText)
      return NextResponse.json(
        { error: 'Translation failed' },
        { status: response.status }
      )
    }

    const result = await response.json()
    
    if (result.translations && result.translations.length > 0) {
      return NextResponse.json({
        success: true,
        translatedText: result.translations[0].text,
        detectedSourceLanguage: result.translations[0].detected_source_language
      })
    } else {
      return NextResponse.json(
        { error: 'No translation returned' },
        { status: 500 }
      )
    }

  } catch (error) {
    console.error('Translation error:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}



