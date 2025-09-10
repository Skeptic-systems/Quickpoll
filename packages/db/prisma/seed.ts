import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // Create a sample admin user
  const admin = await prisma.user.upsert({
    where: { email: 'admin@vdma.de' },
    update: {},
    create: {
      email: 'admin@vdma.de',
      password: '$2a$10$K7L1OJ45/4Y2nIvhRVpCe.FSmhDdWoXehVzJapJj3lZv7iUHY5x2S', // password: admin123
      role: 'admin',
    },
  })

  // Create a sample quiz
  const quiz = await prisma.quiz.upsert({
    where: { slug: 'sample-quiz' },
    update: {},
    create: {
      slug: 'sample-quiz',
      title: 'VDMA Sample Quiz',
      isActive: true,
      languages: ['de', 'en'],
      questionsPerRun: 15,
      allowPublicResult: true,
      branding: {
        logoUrl: '/logo/vdma-logo.png',
        primaryColor: '#003366',
        accentColor: '#FF6600',
      },
    },
  })

  // Create sample questions
  const questions = [
    {
      type: 'single',
      orderHint: 1,
      text_de: 'Was ist VDMA?',
      text_en: 'What is VDMA?',
      choices: [
        { label_de: 'Verband Deutscher Maschinen- und Anlagenbau', label_en: 'German Engineering Federation', isCorrect: true },
        { label_de: 'Verein Deutscher Maschinenbauer', label_en: 'German Machine Builders Association', isCorrect: false },
        { label_de: 'Verband Deutscher Metallarbeiter', label_en: 'German Metal Workers Union', isCorrect: false },
        { label_de: 'Verein Deutscher Maschinenhersteller', label_en: 'German Machine Manufacturers Association', isCorrect: false },
      ],
    },
    {
      type: 'single',
      orderHint: 2,
      text_de: 'Welche Farbe hat das VDMA-Logo hauptsächlich?',
      text_en: 'What is the main color of the VDMA logo?',
      choices: [
        { label_de: 'Blau', label_en: 'Blue', isCorrect: true },
        { label_de: 'Rot', label_en: 'Red', isCorrect: false },
        { label_de: 'Grün', label_en: 'Green', isCorrect: false },
        { label_de: 'Gelb', label_en: 'Yellow', isCorrect: false },
      ],
    },
    {
      type: 'multi',
      orderHint: 3,
      text_de: 'Welche Bereiche gehören zum Maschinenbau?',
      text_en: 'Which areas belong to mechanical engineering?',
      choices: [
        { label_de: 'Produktionstechnik', label_en: 'Production Technology', isCorrect: true },
        { label_de: 'Automobilbau', label_en: 'Automotive Engineering', isCorrect: true },
        { label_de: 'Lebensmittelindustrie', label_en: 'Food Industry', isCorrect: true },
        { label_de: 'Softwareentwicklung', label_en: 'Software Development', isCorrect: false },
      ],
    },
  ]

  for (const questionData of questions) {
    const { choices, ...questionFields } = questionData
    const question = await prisma.question.upsert({
      where: { 
        quizId_type_orderHint: {
          quizId: quiz.id,
          type: questionData.type,
          orderHint: questionData.orderHint,
        }
      },
      update: {},
      create: {
        ...questionFields,
        quizId: quiz.id,
        choices: {
          create: choices.map(choice => ({
            label_de: choice.label_de,
            label_en: choice.label_en,
            isCorrect: choice.isCorrect,
          })),
        },
      },
    })
  }

  console.log('Database seeded successfully!')
  console.log('Admin user:', admin.email)
  console.log('Sample quiz:', quiz.title)
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })
