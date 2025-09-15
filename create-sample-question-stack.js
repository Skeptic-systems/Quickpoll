const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleQuestions = [
  {
    question: "Was ist die Hauptstadt von Deutschland?",
    answers: ["Berlin", "München", "Hamburg", "Köln"],
    correctAnswers: ["Berlin"],
    questionType: "single"
  },
  {
    question: "Welche Programmiersprachen sind objektorientiert?",
    answers: ["Java", "Python", "C++", "Assembly", "JavaScript"],
    correctAnswers: ["Java", "Python", "C++", "JavaScript"],
    questionType: "multiple"
  },
  {
    question: "Wie viele Kontinente gibt es?",
    answers: ["5", "6", "7", "8"],
    correctAnswers: ["7"],
    questionType: "single"
  },
  {
    question: "Welche sind Primzahlen?",
    answers: ["2", "4", "7", "9", "11", "15"],
    correctAnswers: ["2", "7", "11"],
    questionType: "multiple"
  },
  {
    question: "Was ist die chemische Formel für Wasser?",
    answers: ["H2O", "CO2", "NaCl", "O2"],
    correctAnswers: ["H2O"],
    questionType: "single"
  },
  {
    question: "Welche Planeten sind Gasriesen?",
    answers: ["Jupiter", "Venus", "Saturn", "Mars", "Uranus", "Neptun"],
    correctAnswers: ["Jupiter", "Saturn", "Uranus", "Neptun"],
    questionType: "multiple"
  },
  {
    question: "In welchem Jahr wurde das World Wide Web erfunden?",
    answers: ["1989", "1991", "1993", "1995"],
    correctAnswers: ["1989"],
    questionType: "single"
  },
  {
    question: "Welche sind Hauptbestandteile der CPU?",
    answers: ["ALU", "RAM", "Control Unit", "Cache", "GPU"],
    correctAnswers: ["ALU", "Control Unit"],
    questionType: "multiple"
  },
  {
    question: "Was ist die größte Insel der Welt?",
    answers: ["Madagaskar", "Grönland", "Borneo", "Neuguinea"],
    correctAnswers: ["Grönland"],
    questionType: "single"
  },
  {
    question: "Welche Datenstrukturen sind linear?",
    answers: ["Array", "Tree", "Stack", "Graph", "Queue", "Hash Table"],
    correctAnswers: ["Array", "Stack", "Queue"],
    questionType: "multiple"
  },
  {
    question: "Wer schrieb 'Die Verwandlung'?",
    answers: ["Franz Kafka", "Thomas Mann", "Hermann Hesse", "Bertolt Brecht"],
    correctAnswers: ["Franz Kafka"],
    questionType: "single"
  },
  {
    question: "Welche sind HTTP-Methoden?",
    answers: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    correctAnswers: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    questionType: "multiple"
  },
  {
    question: "Was ist die Geschwindigkeit des Lichts im Vakuum?",
    answers: ["299.792.458 m/s", "300.000.000 m/s", "299.000.000 m/s", "301.000.000 m/s"],
    correctAnswers: ["299.792.458 m/s"],
    questionType: "single"
  },
  {
    question: "Welche sind Design Patterns?",
    answers: ["Singleton", "Observer", "Factory", "Loop", "Strategy", "Recursion"],
    correctAnswers: ["Singleton", "Observer", "Factory", "Strategy"],
    questionType: "multiple"
  },
  {
    question: "Welches Land hat die meisten Einwohner?",
    answers: ["China", "Indien", "USA", "Indonesien"],
    correctAnswers: ["China"],
    questionType: "single"
  },
  {
    question: "Welche sind NoSQL-Datenbanken?",
    answers: ["MongoDB", "PostgreSQL", "Redis", "MySQL", "Cassandra", "Elasticsearch"],
    correctAnswers: ["MongoDB", "Redis", "Cassandra", "Elasticsearch"],
    questionType: "multiple"
  },
  {
    question: "Wer malte die Mona Lisa?",
    answers: ["Leonardo da Vinci", "Michelangelo", "Raffael", "Donatello"],
    correctAnswers: ["Leonardo da Vinci"],
    questionType: "single"
  },
  {
    question: "Welche sind Cloud-Anbieter?",
    answers: ["AWS", "Azure", "Google Cloud", "Oracle Cloud", "IBM Cloud", "Dropbox"],
    correctAnswers: ["AWS", "Azure", "Google Cloud", "Oracle Cloud", "IBM Cloud"],
    questionType: "multiple"
  },
  {
    question: "Was ist die kleinste Einheit der Information?",
    answers: ["Byte", "Bit", "Nibble", "Word"],
    correctAnswers: ["Bit"],
    questionType: "single"
  },
  {
    question: "Welche sind Version Control Systeme?",
    answers: ["Git", "SVN", "Mercurial", "CVS", "Perforce", "Dropbox"],
    correctAnswers: ["Git", "SVN", "Mercurial", "CVS", "Perforce"],
    questionType: "multiple"
  },
  {
    question: "In welchem Jahr fiel die Berliner Mauer?",
    answers: ["1987", "1989", "1991", "1993"],
    correctAnswers: ["1989"],
    questionType: "single"
  },
  {
    question: "Welche sind JavaScript-Frameworks?",
    answers: ["React", "Angular", "Vue.js", "jQuery", "Svelte", "PHP"],
    correctAnswers: ["React", "Angular", "Vue.js", "jQuery", "Svelte"],
    questionType: "multiple"
  },
  {
    question: "Was ist die Hauptstadt von Japan?",
    answers: ["Osaka", "Tokyo", "Kyoto", "Yokohama"],
    correctAnswers: ["Tokyo"],
    questionType: "single"
  },
  {
    question: "Welche sind CSS-Frameworks?",
    answers: ["Bootstrap", "Tailwind CSS", "Foundation", "Bulma", "Materialize", "jQuery"],
    correctAnswers: ["Bootstrap", "Tailwind CSS", "Foundation", "Bulma", "Materialize"],
    questionType: "multiple"
  },
  {
    question: "Wer komponierte die 9. Sinfonie?",
    answers: ["Mozart", "Beethoven", "Bach", "Chopin"],
    correctAnswers: ["Beethoven"],
    questionType: "single"
  },
  {
    question: "Welche sind Agile-Methoden?",
    answers: ["Scrum", "Kanban", "Waterfall", "XP", "Lean", "Six Sigma"],
    correctAnswers: ["Scrum", "Kanban", "XP", "Lean"],
    questionType: "multiple"
  },
  {
    question: "Was ist die chemische Formel für Salz?",
    answers: ["NaCl", "H2O", "CO2", "CaCO3"],
    correctAnswers: ["NaCl"],
    questionType: "single"
  },
  {
    question: "Welche sind Container-Technologien?",
    answers: ["Docker", "Kubernetes", "Podman", "LXC", "OpenVZ", "VirtualBox"],
    correctAnswers: ["Docker", "Kubernetes", "Podman", "LXC", "OpenVZ"],
    questionType: "multiple"
  },
  {
    question: "Welches ist das größte Land der Welt?",
    answers: ["China", "Kanada", "USA", "Russland"],
    correctAnswers: ["Russland"],
    questionType: "single"
  },
  {
    question: "Welche sind Test-Frameworks für JavaScript?",
    answers: ["Jest", "Mocha", "Jasmine", "Cypress", "Playwright", "Selenium"],
    correctAnswers: ["Jest", "Mocha", "Jasmine", "Cypress", "Playwright"],
    questionType: "multiple"
  }
]

async function createSampleQuestionStack() {
  try {
    console.log('🚀 Creating sample question stack...')
    
    // Create the question stack
    const questionStack = await prisma.questionStack.create({
      data: {
        name: 'Allgemeinwissen & Technologie - 30 Fragen',
        questions: {
          create: sampleQuestions.map((q, index) => ({
            question: q.question,
            answers: JSON.stringify(q.answers),
            correctAnswers: JSON.stringify(q.correctAnswers),
            questionType: q.questionType,
            order: index + 1
          }))
        }
      },
      include: {
        questions: true
      }
    })

    console.log('✅ Successfully created question stack!')
    console.log(`📊 Stack ID: ${questionStack.id}`)
    console.log(`📝 Stack Name: ${questionStack.name}`)
    console.log(`❓ Number of Questions: ${questionStack.questions.length}`)
    
    // Show some sample questions
    console.log('\n📋 Sample Questions:')
    questionStack.questions.slice(0, 5).forEach((q, index) => {
      console.log(`${index + 1}. ${q.question}`)
      console.log(`   Answers: ${JSON.parse(q.answers).join(', ')}`)
      console.log(`   Correct: ${JSON.parse(q.correctAnswers).join(', ')}`)
      console.log(`   Type: ${q.questionType}`)
      console.log('')
    })

  } catch (error) {
    console.error('❌ Error creating question stack:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleQuestionStack()
