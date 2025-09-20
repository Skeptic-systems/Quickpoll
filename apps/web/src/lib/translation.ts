export async function translateTextWithDeepL(text: string, targetLang: string): Promise<string> {
  try {
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

    if (!DEEPL_API_KEY) {
      return text
    }

    const response = await fetch(DEEPL_API_URL, {
      method: 'POST',
      headers: {
        'Authorization': `DeepL-Auth-Key ${DEEPL_API_KEY}`,
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        text: text,
        target_lang: targetLang,
        source_lang: 'DE',
      }),
    })

    if (!response.ok) {
      return text
    }

    const result = await response.json()
    if (result.translations && result.translations.length > 0) {
      return result.translations[0].text
    }
    return text
  } catch (error) {
    return text
  }
}

export interface ModuleData {
  question?: string
  answers?: string[]
  correctAnswers?: string[]
  questionType?: string
  content?: string
  text?: string
  description?: string
  stackId?: string
  stackName?: string
}

export interface TranslatedModuleData {
  question?: { de: string; en: string; fr: string }
  answers?: { de: string[]; en: string[]; fr: string[] }
  correctAnswers?: string[]
  questionType?: string
  content?: { de: string; en: string; fr: string }
  text?: { de: string; en: string; fr: string }
  description?: { de: string; en: string; fr: string }
  stackId?: string
  stackName?: string
}

export async function translateModuleData(moduleData: ModuleData): Promise<TranslatedModuleData> {
  const translatedData: TranslatedModuleData = {}

  if (moduleData.question) {
    const [enQuestion, frQuestion] = await Promise.all([
      translateTextWithDeepL(moduleData.question, 'EN'),
      translateTextWithDeepL(moduleData.question, 'FR')
    ])
    translatedData.question = { de: moduleData.question, en: enQuestion, fr: frQuestion }
  }

  if (moduleData.answers && moduleData.answers.length > 0) {
    const enAnswers: string[] = []
    const frAnswers: string[] = []
    for (const answer of moduleData.answers) {
      const [enAnswer, frAnswer] = await Promise.all([
        translateTextWithDeepL(answer, 'EN'),
        translateTextWithDeepL(answer, 'FR')
      ])
      enAnswers.push(enAnswer)
      frAnswers.push(frAnswer)
    }
    translatedData.answers = { de: moduleData.answers, en: enAnswers, fr: frAnswers }
  }

  // Pass through non-translatable correctness metadata for question modules
  if (moduleData.correctAnswers) {
    translatedData.correctAnswers = moduleData.correctAnswers
  }
  if (moduleData.questionType) {
    translatedData.questionType = moduleData.questionType
  }

  if (moduleData.content) {
    const [enContent, frContent] = await Promise.all([
      translateTextWithDeepL(moduleData.content, 'EN'),
      translateTextWithDeepL(moduleData.content, 'FR')
    ])
    translatedData.content = { de: moduleData.content, en: enContent, fr: frContent }
  }

  if (moduleData.text) {
    const [enText, frText] = await Promise.all([
      translateTextWithDeepL(moduleData.text, 'EN'),
      translateTextWithDeepL(moduleData.text, 'FR')
    ])
    translatedData.text = { de: moduleData.text, en: enText, fr: frText }
  }

  if (moduleData.description) {
    const [enDescription, frDescription] = await Promise.all([
      translateTextWithDeepL(moduleData.description, 'EN'),
      translateTextWithDeepL(moduleData.description, 'FR')
    ])
    translatedData.description = { de: moduleData.description, en: enDescription, fr: frDescription }
  }

  if (moduleData.stackId) translatedData.stackId = moduleData.stackId
  if (moduleData.stackName) translatedData.stackName = moduleData.stackName

  return translatedData
}

export async function translateModulesArray(modules: any[]) {
  const translatedModules = [] as any[]
  for (const module of modules) {
    const translatedData = await translateModuleData(module.data as ModuleData)
    translatedModules.push({ ...module, data: translatedData })
  }
  return translatedModules
}


