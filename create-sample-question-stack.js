const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

const sampleQuestions = [
  {
    question: "What is the capital of Germany?",
    answers: ["Berlin", "Munich", "Hamburg", "Cologne"],
    correctAnswers: ["Berlin"],
    questionType: "single"
  },
  {
    question: "Which programming languages are object-oriented?",
    answers: ["Java", "Python", "C++", "Assembly", "JavaScript"],
    correctAnswers: ["Java", "Python", "C++", "JavaScript"],
    questionType: "multiple"
  },
  {
    question: "How many continents are there?",
    answers: ["5", "6", "7", "8"],
    correctAnswers: ["7"],
    questionType: "single"
  },
  {
    question: "Which are prime numbers?",
    answers: ["2", "4", "7", "9", "11", "15"],
    correctAnswers: ["2", "7", "11"],
    questionType: "multiple"
  },
  {
    question: "What is the chemical formula for water?",
    answers: ["H2O", "CO2", "NaCl", "O2"],
    correctAnswers: ["H2O"],
    questionType: "single"
  },
  {
    question: "Which planets are gas giants?",
    answers: ["Jupiter", "Venus", "Saturn", "Mars", "Uranus", "Neptune"],
    correctAnswers: ["Jupiter", "Saturn", "Uranus", "Neptune"],
    questionType: "multiple"
  },
  {
    question: "In which year was the World Wide Web invented?",
    answers: ["1989", "1991", "1993", "1995"],
    correctAnswers: ["1989"],
    questionType: "single"
  },
  {
    question: "Which are main components of the CPU?",
    answers: ["ALU", "RAM", "Control Unit", "Cache", "GPU"],
    correctAnswers: ["ALU", "Control Unit"],
    questionType: "multiple"
  },
  {
    question: "What is the largest island in the world?",
    answers: ["Madagascar", "Greenland", "Borneo", "New Guinea"],
    correctAnswers: ["Greenland"],
    questionType: "single"
  },
  {
    question: "Which data structures are linear?",
    answers: ["Array", "Tree", "Stack", "Graph", "Queue", "Hash Table"],
    correctAnswers: ["Array", "Stack", "Queue"],
    questionType: "multiple"
  },
  {
    question: "Who wrote 'The Metamorphosis'?",
    answers: ["Franz Kafka", "Thomas Mann", "Hermann Hesse", "Bertolt Brecht"],
    correctAnswers: ["Franz Kafka"],
    questionType: "single"
  },
  {
    question: "Which are HTTP methods?",
    answers: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    correctAnswers: ["GET", "POST", "PUT", "DELETE", "PATCH", "HEAD"],
    questionType: "multiple"
  },
  {
    question: "What is the speed of light in vacuum?",
    answers: ["299,792,458 m/s", "300,000,000 m/s", "299,000,000 m/s", "301,000,000 m/s"],
    correctAnswers: ["299,792,458 m/s"],
    questionType: "single"
  },
  {
    question: "Which are design patterns?",
    answers: ["Singleton", "Observer", "Factory", "Loop", "Strategy", "Recursion"],
    correctAnswers: ["Singleton", "Observer", "Factory", "Strategy"],
    questionType: "multiple"
  },
  {
    question: "Which country has the most inhabitants?",
    answers: ["China", "India", "USA", "Indonesia"],
    correctAnswers: ["China"],
    questionType: "single"
  },
  {
    question: "Which are NoSQL databases?",
    answers: ["MongoDB", "PostgreSQL", "Redis", "MySQL", "Cassandra", "Elasticsearch"],
    correctAnswers: ["MongoDB", "Redis", "Cassandra", "Elasticsearch"],
    questionType: "multiple"
  },
  {
    question: "Who painted the Mona Lisa?",
    answers: ["Leonardo da Vinci", "Michelangelo", "Raphael", "Donatello"],
    correctAnswers: ["Leonardo da Vinci"],
    questionType: "single"
  },
  {
    question: "Which are cloud providers?",
    answers: ["AWS", "Azure", "Google Cloud", "Oracle Cloud", "IBM Cloud", "Dropbox"],
    correctAnswers: ["AWS", "Azure", "Google Cloud", "Oracle Cloud", "IBM Cloud"],
    questionType: "multiple"
  },
  {
    question: "What is the smallest unit of information?",
    answers: ["Byte", "Bit", "Nibble", "Word"],
    correctAnswers: ["Bit"],
    questionType: "single"
  },
  {
    question: "Which are version control systems?",
    answers: ["Git", "SVN", "Mercurial", "CVS", "Perforce", "Dropbox"],
    correctAnswers: ["Git", "SVN", "Mercurial", "CVS", "Perforce"],
    questionType: "multiple"
  },
  {
    question: "In which year did the Berlin Wall fall?",
    answers: ["1987", "1989", "1991", "1993"],
    correctAnswers: ["1989"],
    questionType: "single"
  },
  {
    question: "Which are JavaScript frameworks?",
    answers: ["React", "Angular", "Vue.js", "jQuery", "Svelte", "PHP"],
    correctAnswers: ["React", "Angular", "Vue.js", "jQuery", "Svelte"],
    questionType: "multiple"
  },
  {
    question: "What is the capital of Japan?",
    answers: ["Osaka", "Tokyo", "Kyoto", "Yokohama"],
    correctAnswers: ["Tokyo"],
    questionType: "single"
  },
  {
    question: "Which are CSS frameworks?",
    answers: ["Bootstrap", "Tailwind CSS", "Foundation", "Bulma", "Materialize", "jQuery"],
    correctAnswers: ["Bootstrap", "Tailwind CSS", "Foundation", "Bulma", "Materialize"],
    questionType: "multiple"
  },
  {
    question: "Who composed the 9th Symphony?",
    answers: ["Mozart", "Beethoven", "Bach", "Chopin"],
    correctAnswers: ["Beethoven"],
    questionType: "single"
  },
  {
    question: "Which are Agile methodologies?",
    answers: ["Scrum", "Kanban", "Waterfall", "XP", "Lean", "Six Sigma"],
    correctAnswers: ["Scrum", "Kanban", "XP", "Lean"],
    questionType: "multiple"
  },
  {
    question: "What is the chemical formula for salt?",
    answers: ["NaCl", "H2O", "CO2", "CaCO3"],
    correctAnswers: ["NaCl"],
    questionType: "single"
  },
  {
    question: "Which are container technologies?",
    answers: ["Docker", "Kubernetes", "Podman", "LXC", "OpenVZ", "VirtualBox"],
    correctAnswers: ["Docker", "Kubernetes", "Podman", "LXC", "OpenVZ"],
    questionType: "multiple"
  },
  {
    question: "Which is the largest country in the world?",
    answers: ["China", "Canada", "USA", "Russia"],
    correctAnswers: ["Russia"],
    questionType: "single"
  },
  {
    question: "Which are testing frameworks for JavaScript?",
    answers: ["Jest", "Mocha", "Jasmine", "Cypress", "Playwright", "Selenium"],
    correctAnswers: ["Jest", "Mocha", "Jasmine", "Cypress", "Playwright"],
    questionType: "multiple"
  }
]

async function createSampleData() {
  try {
    console.log('🚀 Creating sample question stack and quizzes...')
    
    // Create the question stack
    const questionStack = await prisma.questionStack.create({
      data: {
        name: 'General Knowledge & Technology - 30 Questions',
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

    // Create a normal quiz with all questions from the stack
    const normalQuiz = await prisma.quiz.create({
      data: {
        title: 'Complete General Knowledge Quiz',
        description: 'A comprehensive quiz covering all topics from general knowledge to technology',
        isActive: true,
        modules: {
          create: questionStack.questions.map((question, index) => ({
            type: 'question',
            order: index + 1,
            data: {
              questionId: question.id,
              question: question.question,
              answers: JSON.parse(question.answers),
              correctAnswers: JSON.parse(question.correctAnswers),
              questionType: question.questionType
            }
          }))
        }
      },
      include: {
        modules: true
      }
    })

    console.log('✅ Successfully created normal quiz!')
    console.log(`📊 Normal Quiz ID: ${normalQuiz.id}`)
    console.log(`📝 Normal Quiz Title: ${normalQuiz.title}`)
    console.log(`❓ Number of Modules: ${normalQuiz.modules.length}`)

    // Create a random quiz that pulls random questions from the stack
    const randomQuiz = await prisma.quiz.create({
      data: {
        title: 'Random General Knowledge Quiz',
        description: 'A dynamic quiz that randomly selects questions from our question stack',
        isActive: true,
        modules: {
          create: [
            {
              type: 'random_questions',
              order: 1,
              data: {
                stackId: questionStack.id,
                questionCount: 10, // Randomly select 10 questions
                description: 'Random selection of 10 questions from the general knowledge stack'
              }
            }
          ]
        }
      },
      include: {
        modules: true
      }
    })

    console.log('✅ Successfully created random quiz!')
    console.log(`📊 Random Quiz ID: ${randomQuiz.id}`)
    console.log(`📝 Random Quiz Title: ${randomQuiz.title}`)
    console.log(`❓ Number of Modules: ${randomQuiz.modules.length}`)
    
    // Show some sample questions
    console.log('\n📋 Sample Questions from Stack:')
    questionStack.questions.slice(0, 5).forEach((q, index) => {
      console.log(`${index + 1}. ${q.question}`)
      console.log(`   Answers: ${JSON.parse(q.answers).join(', ')}`)
      console.log(`   Correct: ${JSON.parse(q.correctAnswers).join(', ')}`)
      console.log(`   Type: ${q.questionType}`)
      console.log('')
    })

    console.log('\n🎯 Summary:')
    console.log(`📚 Question Stack: "${questionStack.name}" (ID: ${questionStack.id})`)
    console.log(`📝 Normal Quiz: "${normalQuiz.title}" (ID: ${normalQuiz.id})`)
    console.log(`🎲 Random Quiz: "${randomQuiz.title}" (ID: ${randomQuiz.id})`)

  } catch (error) {
    console.error('❌ Error creating sample data:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSampleData()