const { PrismaClient } = require('@prisma/client')

const prisma = new PrismaClient()

// ----- Helper data -----
const fiveQuestionQuiz = [
  {
    question: 'Which planet is known as the Red Planet?',
    answers: ['Mars', 'Venus', 'Jupiter', 'Mercury'],
    correctAnswers: ['Mars'],
    questionType: 'single'
  },
  {
    question: 'Which languages are primarily used for web frontends?',
    answers: ['HTML', 'CSS', 'JavaScript', 'Python'],
    correctAnswers: ['HTML', 'CSS', 'JavaScript'],
    questionType: 'multiple'
  },
  {
    question: 'What does CPU stand for?',
    answers: ['Central Processing Unit', 'Computer Personal Unit', 'Central Peripheral Unit', 'Core Processing Utility'],
    correctAnswers: ['Central Processing Unit'],
    questionType: 'single'
  },
  {
    question: 'Select the HTTP methods that are idempotent.',
    answers: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH'],
    correctAnswers: ['GET', 'PUT', 'DELETE'],
    questionType: 'multiple'
  },
  {
    question: 'Which company maintains the React library?',
    answers: ['Google', 'Meta', 'Microsoft', 'Amazon'],
    correctAnswers: ['Meta'],
    questionType: 'single'
  }
]

const tenStackQuestions = [
  {
    question: 'What is the capital of France?',
    answers: ['Paris', 'Lyon', 'Marseille', 'Nice'],
    correctAnswers: ['Paris'],
    questionType: 'single'
  },
  {
    question: 'Pick prime numbers.',
    answers: ['2', '3', '4', '9', '11'],
    correctAnswers: ['2', '3', '11'],
    questionType: 'multiple'
  },
  {
    question: 'Which file formats are images?',
    answers: ['PNG', 'JPEG', 'GIF', 'CSV'],
    correctAnswers: ['PNG', 'JPEG', 'GIF'],
    questionType: 'multiple'
  },
  {
    question: 'Which ocean is the largest?',
    answers: ['Atlantic', 'Indian', 'Pacific', 'Arctic'],
    correctAnswers: ['Pacific'],
    questionType: 'single'
  },
  {
    question: 'Select JavaScript frameworks.',
    answers: ['React', 'Angular', 'Spring', 'Vue'],
    correctAnswers: ['React', 'Angular', 'Vue'],
    questionType: 'multiple'
  },
  {
    question: 'How many bytes are in a kilobyte (decimal)?',
    answers: ['1000', '1024', '512', '2048'],
    correctAnswers: ['1000'],
    questionType: 'single'
  },
  {
    question: 'Choose cloud providers.',
    answers: ['AWS', 'Azure', 'Google Cloud', 'Nginx'],
    correctAnswers: ['AWS', 'Azure', 'Google Cloud'],
    questionType: 'multiple'
  },
  {
    question: 'Which animal is known as the King of the Jungle?',
    answers: ['Elephant', 'Lion', 'Tiger', 'Leopard'],
    correctAnswers: ['Lion'],
    questionType: 'single'
  },
  {
    question: 'Pick even numbers.',
    answers: ['1', '2', '3', '4', '5', '6'],
    correctAnswers: ['2', '4', '6'],
    questionType: 'multiple'
  },
  {
    question: 'Which protocol is used for secure web traffic?',
    answers: ['HTTP', 'FTP', 'HTTPS', 'SMTP'],
    correctAnswers: ['HTTPS'],
    questionType: 'single'
  }
]

function slugify(text) {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
    .substring(0, 50)
}

async function createSeedData() {
  try {
    console.log('🚀 Seeding: 5-question quiz, 10-question stack, random quiz (5 modules)')

    // Cleanup possible previous runs
    await prisma.quiz.deleteMany({
      where: { slug: { in: ['sample-en-5', 'random-from-stack-en'] } }
    })
    await prisma.questionStack.deleteMany({ where: { name: 'General Knowledge Stack (EN) - 10' } })

    // 1) Create QUIZ with 5 concrete questions (like in the editor UI)
    const quizTitle = 'Sample English Quiz (5 Questions)'
    const quiz = await prisma.quiz.create({
      data: {
        slug: 'sample-en-5',
        title: quizTitle,
        isActive: true,
        languages: JSON.stringify(['en']),
        modules: {
          create: [
            // Question 1
            {
              type: 'question',
              order: 1,
              data: {
                question: fiveQuestionQuiz[0].question,
                answers: fiveQuestionQuiz[0].answers,
                correctAnswers: fiveQuestionQuiz[0].correctAnswers,
                questionType: fiveQuestionQuiz[0].questionType
              }
            },
            // Page break to mirror the editor look
            { type: 'pageBreak', order: 2, data: {} },
            // Question 2-5
            {
              type: 'question',
              order: 3,
              data: {
                question: fiveQuestionQuiz[1].question,
                answers: fiveQuestionQuiz[1].answers,
                correctAnswers: fiveQuestionQuiz[1].correctAnswers,
                questionType: fiveQuestionQuiz[1].questionType
              }
            },
            {
              type: 'question',
              order: 4,
              data: {
                question: fiveQuestionQuiz[2].question,
                answers: fiveQuestionQuiz[2].answers,
                correctAnswers: fiveQuestionQuiz[2].correctAnswers,
                questionType: fiveQuestionQuiz[2].questionType
              }
            },
            {
              type: 'question',
              order: 5,
              data: {
                question: fiveQuestionQuiz[3].question,
                answers: fiveQuestionQuiz[3].answers,
                correctAnswers: fiveQuestionQuiz[3].correctAnswers,
                questionType: fiveQuestionQuiz[3].questionType
              }
            },
            {
              type: 'question',
              order: 6,
              data: {
                question: fiveQuestionQuiz[4].question,
                answers: fiveQuestionQuiz[4].answers,
                correctAnswers: fiveQuestionQuiz[4].correctAnswers,
                questionType: fiveQuestionQuiz[4].questionType
              }
            }
          ]
        }
      },
      include: { modules: true }
    })

    console.log(`✅ Quiz created: ${quiz.title} (${quiz.slug}) with ${quiz.modules.length} modules`)

    // 2) Create QUESTION STACK with 10 questions (EN)
    const stack = await prisma.questionStack.create({
      data: {
        name: 'General Knowledge Stack (EN) - 10',
        questions: {
          create: tenStackQuestions.map((q, i) => ({
            question: q.question,
            answers: JSON.stringify(q.answers),
            correctAnswers: JSON.stringify(q.correctAnswers),
            questionType: q.questionType,
            order: i + 1,
            // Fill optional translation fields with English to be explicit
            questionEn: q.question,
            answersEn: JSON.stringify(q.answers)
          }))
        }
      },
      include: { questions: true }
    })

    console.log(`✅ Question stack created: ${stack.name} with ${stack.questions.length} items`)

    // 3) Create QUIZ with 5 randomQuestion modules pointing to the stack
    const randomTitle = 'Random Quiz from Stack (5)'
    const randomQuiz = await prisma.quiz.create({
      data: {
        slug: 'random-from-stack-en',
        title: randomTitle,
        isActive: true,
        languages: JSON.stringify(['en']),
        modules: {
          create: Array.from({ length: 5 }).map((_, idx) => ({
            type: 'randomQuestion',
            order: idx + 1,
            data: { stackId: stack.id, stackName: stack.name }
          }))
        }
      },
      include: { modules: true }
    })

    console.log(`✅ Random quiz created: ${randomQuiz.title} with ${randomQuiz.modules.length} modules`)

    console.log('\n🎯 Done. Use these slugs:')
    console.log(' - sample-en-5')
    console.log(' - random-from-stack-en')
  } catch (error) {
    console.error('❌ Seeding error:', error)
  } finally {
    await prisma.$disconnect()
  }
}

createSeedData()


