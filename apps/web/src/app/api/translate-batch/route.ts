import { NextRequest, NextResponse } from 'next/server'

// Simple in-memory cache for translations
const translationCache = new Map<string, string>()

// Rate limiting: track last request time
let lastRequestTime = 0
const MIN_REQUEST_INTERVAL = 2000 // 2 seconds between requests

export async function POST(request: NextRequest) {
  try {
    const { texts, targetLang } = await request.json()

    if (!texts || !Array.isArray(texts) || !targetLang) {
      return NextResponse.json(
        { error: 'Texts array und targetLang sind erforderlich' },
        { status: 400 }
      )
    }

    const apiKey = process.env.DEEPL_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: 'DeepL API Key nicht konfiguriert' },
        { status: 500 }
      )
    }

    // Check cache for all texts first
    const cachedResults: string[] = []
    const textsToTranslate: string[] = []
    const indicesToTranslate: number[] = []

    texts.forEach((text: string, index: number) => {
      const cacheKey = `${text}-${targetLang}`
      if (translationCache.has(cacheKey)) {
        cachedResults[index] = translationCache.get(cacheKey)!
      } else {
        textsToTranslate.push(text)
        indicesToTranslate.push(index)
      }
    })

    // If all texts are cached, return them
    if (textsToTranslate.length === 0) {
      return NextResponse.json({ translatedTexts: cachedResults })
    }

    // Rate limiting: wait if necessary
    const now = Date.now()
    const timeSinceLastRequest = now - lastRequestTime
    if (timeSinceLastRequest < MIN_REQUEST_INTERVAL) {
      await new Promise(resolve => setTimeout(resolve, MIN_REQUEST_INTERVAL - timeSinceLastRequest))
    }
    lastRequestTime = Date.now()

    // DeepL API aufrufen für alle Texte auf einmal
    const response = await fetch('https://api-free.deepl.com/v2/translate', {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${apiKey}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        'text': textsToTranslate,
        'target_lang': targetLang.toUpperCase(),
        'source_lang': 'DE' // Wir gehen davon aus, dass der Quelltext auf Deutsch ist
      })
    })

    if (!response.ok) {
      // If rate limited, return original texts
      if (response.status === 429) {
        console.warn('Rate limited, returning original texts')
        return NextResponse.json({ 
          translatedTexts: texts.map((text: string, index: number) => 
            cachedResults[index] || text
          )
        })
      }
      throw new Error(`DeepL API Error: ${response.status}`)
    }

    const data = await response.json()
    const translatedTexts = data.translations.map((translation: any) => translation.text)

    // Cache the results and fill the final array
    translatedTexts.forEach((translatedText: string, index: number) => {
      const originalText = textsToTranslate[index]
      const cacheKey = `${originalText}-${targetLang}`
      translationCache.set(cacheKey, translatedText)
      cachedResults[indicesToTranslate[index]] = translatedText
    })
    
    return NextResponse.json({
      translatedTexts: cachedResults
    })

  } catch (error) {
    console.error('Batch translation error:', error)
    // Return original texts on error
    const { texts } = await request.json()
    return NextResponse.json({
      translatedTexts: texts || []
    })
  }
}
