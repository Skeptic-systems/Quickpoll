const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// Helper function to translate text using DeepL
async function translateText(text, targetLang) {
  try {
    const DEEPL_API_KEY = process.env.DEEPL_API_KEY
    const DEEPL_API_URL = 'https://api-free.deepl.com/v2/translate'

    if (!DEEPL_API_KEY) {
      console.warn('DeepL API key not configured, returning original text')
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
        source_lang: 'DE', // Assume German as source language
      }),
    })

    if (!response.ok) {
      console.error('DeepL API error:', response.status)
      return text // Return original text if translation fails
    }

    const result = await response.json()
    
    if (result.translations && result.translations.length > 0) {
      return result.translations[0].text
    } else {
      return text
    }
  } catch (error) {
    console.error('Translation error:', error)
    return text // Return original text if translation fails
  }
}

async function updateExistingQuestions() {
  try {
    console.log('🔄 Starting translation of existing questions...')
    
    // Get all questions that don't have translations yet
    const questions = await prisma.questionStackItem.findMany({
      where: {
        OR: [
          { questionEn: null },
          { questionFr: null },
          { answersEn: null },
          { answersFr: null }
        ]
      }
    })

    console.log(`📊 Found ${questions.length} questions to translate`)

    for (let i = 0; i < questions.length; i++) {
      const question = questions[i]
      console.log(`\n🔄 Translating question ${i + 1}/${questions.length}: ${question.question.substring(0, 50)}...`)

      try {
        // Translate question text
        const questionEn = await translateText(question.question, 'EN')
        const questionFr = await translateText(question.question, 'FR')
        
        // Parse and translate answers
        const answers = JSON.parse(question.answers)
        const answersEn = await Promise.all(
          answers.map(answer => translateText(answer, 'EN'))
        )
        const answersFr = await Promise.all(
          answers.map(answer => translateText(answer, 'FR'))
        )
        
        // Update the question with translations
        await prisma.questionStackItem.update({
          where: { id: question.id },
          data: {
            questionEn: questionEn,
            questionFr: questionFr,
            answersEn: JSON.stringify(answersEn),
            answersFr: JSON.stringify(answersFr)
          }
        })

        console.log(`✅ Translated question ${i + 1}:`)
        console.log(`   DE: ${question.question}`)
        console.log(`   EN: ${questionEn}`)
        console.log(`   FR: ${questionFr}`)
        
        // Add a small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 100))
        
      } catch (error) {
        console.error(`❌ Error translating question ${i + 1}:`, error)
        // Continue with next question
      }
    }

    console.log('\n🎉 Translation process completed!')

  } catch (error) {
    console.error('❌ Error in translation process:', error)
  } finally {
    await prisma.$disconnect()
  }
}

updateExistingQuestions()

