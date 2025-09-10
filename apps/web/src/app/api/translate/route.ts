import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for translations
const translationCache = new Map<string, string>()

// Rate limiting: track last request time
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests

export async function POST(request: NextRequest) {
  try {
    const { text, targetLang } = await request.json()

    if (!text || !targetLang) {
      return NextResponse.json(
        { error: 'Text und targetLang sind erforderlich' },
        { status: 400 }
      )
    }

    // Check cache first
    const cacheKey = `${text}-${targetLang}`
    if (translationCache.has(cacheKey)) {
      return NextResponse.json({ translatedText: translationCache.get(cacheKey) })
    }

    const apiKey = process.env.DEEPL_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepL API Key nicht konfiguriert' },
        { status: 500 }
      )
    }

    // Rate limiting: wait if necessary
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
    }
    lastRequestTime = Date.now()

    // DeepL API aufrufen
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'text': text,
        'target_lang': targetLang.toUpperCase(),
        'source_lang': 'DE' // Wir gehen davon aus, dass der Quelltext auf Deutsch ist
      })
    })

    if (!response.ok) {
      // If rate limited, return original text
      if (response.status === 429) {
        console.warn('Rate limited, returning original text')
        return NextResponse.json({ translatedText: text })
      }
      throw new Error(`DeepL API Error: ${response.status}`)
    }

    const data = await response.json()
    const translatedText = data.translations[0].text

    // Cache the result
    translationCache.set(cacheKey, translatedText)
    
    return NextResponse.json({
      translatedText: translatedText
    })

  } catch (error) {
    console.error('Translation error:', error)
    // Return original text on error
    return NextResponse.json({
      translatedText: text || 'Übersetzung fehlgeschlagen'
    })
  }
}
