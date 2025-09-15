const testQuestions = [
  {
    question: "Was ist die Hauptstadt von Deutschland?",
    answers: ["Berlin", "München", "Hamburg", "Köln"],
    correctAnswers: ["Berlin"],
    questionType: "single"
  },
  {
    question: "Welche Programmiersprache wurde von Microsoft entwickelt?",
    answers: ["Java", "C#", "Python", "JavaScript"],
    correctAnswers: ["C#"],
    questionType: "single"
  },
  {
    question: "Welche sind objektorientierte Programmiersprachen?",
    answers: ["Java", "C++", "Assembly", "Python", "HTML"],
    correctAnswers: ["Java", "C++", "Python"],
    questionType: "multiple"
  },
  {
    question: "Wie viele Tage hat ein Schaltjahr?",
    answers: ["365", "366", "364", "367"],
    correctAnswers: ["366"],
    questionType: "single"
  },
  {
    question: "Welche sind Datenbanktypen?",
    answers: ["MySQL", "PostgreSQL", "MongoDB", "Excel", "Redis"],
    correctAnswers: ["MySQL", "PostgreSQL", "MongoDB", "Redis"],
    questionType: "multiple"
  },
  {
    question: "Was ist die chemische Formel für Wasser?",
    answers: ["H2O", "CO2", "NaCl", "O2"],
    correctAnswers: ["H2O"],
    questionType: "single"
  },
  {
    question: "Welche sind HTTP-Status-Codes?",
    answers: ["200", "404", "500", "ABC", "301"],
    correctAnswers: ["200", "404", "500", "301"],
    questionType: "multiple"
  },
  {
    question: "Wer schrieb 'Faust'?",
    answers: ["Goethe", "Schiller", "Kafka", "Brecht"],
    correctAnswers: ["Goethe"],
    questionType: "single"
  },
  {
    question: "Welche sind Cloud-Computing-Anbieter?",
    answers: ["AWS", "Azure", "Google Cloud", "Dropbox", "Oracle Cloud"],
    correctAnswers: ["AWS", "Azure", "Google Cloud", "Oracle Cloud"],
    questionType: "multiple"
  },
  {
    question: "Was ist die Geschwindigkeit des Lichts?",
    answers: ["299.792.458 m/s", "300.000.000 m/s", "299.000.000 m/s", "301.000.000 m/s"],
    correctAnswers: ["299.792.458 m/s"],
    questionType: "single"
  }
]

async function createTestQuestionStack() {
  try {
    console.log('🚀 Creating test question stack with DeepL translation...')
    
    // First create the question stack via API
    const createResponse = await fetch('http://localhost:3000/api/question-stacks', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: 'Test-Quiz: Allgemeinwissen & Technologie'
      })
    })

    if (!createResponse.ok) {
      console.log('❌ Failed to create question stack:', createResponse.status)
      const error = await createResponse.text()
      console.log('Error details:', error)
      return
    }

    const createResult = await createResponse.json()
    const stackId = createResult.questionStack.id
    
    console.log('✅ Successfully created question stack!')
    console.log(`📊 Stack ID: ${stackId}`)
    console.log(`📝 Stack Name: ${createResult.questionStack.name}`)
    
    // Show sample questions
    console.log('\n📋 Sample Questions:')
    testQuestions.slice(0, 3).forEach((q, index) => {
      console.log(`${index + 1}. ${q.question}`)
      console.log(`   Answers: ${q.answers.join(', ')}`)
      console.log(`   Correct: ${q.correctAnswers.join(', ')}`)
      console.log(`   Type: ${q.questionType}`)
      console.log('')
    })

    console.log('\n🔄 Now saving questions with DeepL translation...')
    
    // Now call the save API to trigger DeepL translation
    const saveResponse = await fetch(`http://localhost:3000/api/question-stacks/${stackId}/save`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name: createResult.questionStack.name,
        questions: testQuestions
      })
    })

    if (saveResponse.ok) {
      console.log('✅ Save API called successfully - DeepL translation should be triggered!')
      const result = await saveResponse.json()
      console.log('📊 Save result:', result.success ? 'Success' : 'Failed')
      
      if (result.success) {
        console.log('\n🎉 Test question stack created successfully!')
        console.log('📝 You can now test the translation by:')
        console.log('   1. Going to the admin panel')
        console.log('   2. Creating a quiz with this question stack')
        console.log('   3. Switching languages during the quiz')
      }
    } else {
      console.log('❌ Save API failed:', saveResponse.status)
      const error = await saveResponse.text()
      console.log('Error details:', error)
    }

  } catch (error) {
    console.error('❌ Error creating test question stack:', error)
  }
}

createTestQuestionStack()
