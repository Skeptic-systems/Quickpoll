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
      languages: JSON.stringify(['de', 'en', 'fr']),
      questionsPerRun: 15,
      allowPublicResult: true,
      branding: {
        logoUrl: '/logo/vdma-logo.png',
        primaryColor: '#003366',
        accentColor: '#FF6600',
      },
    },
  })

  // Create sample quiz modules with multilingual data
  const modules = [
    {
      type: 'title',
      order: 0,
      data: {
        text: {
          de: 'Willkommen zum VDMA Quiz',
          en: 'Welcome to the VDMA Quiz',
          fr: 'Bienvenue au Quiz VDMA'
        },
        description: {
          de: 'Teste dein Wissen über den Verband Deutscher Maschinen- und Anlagenbau',
          en: 'Test your knowledge about the German Engineering Federation',
          fr: 'Testez vos connaissances sur la Fédération allemande de l\'ingénierie'
        },
        level: 'h1'
      }
    },
    {
      type: 'text',
      order: 1,
      data: {
        content: {
          de: 'Dieses Quiz enthält Fragen über VDMA und den Maschinenbau. Viel Erfolg!',
          en: 'This quiz contains questions about VDMA and mechanical engineering. Good luck!',
          fr: 'Ce quiz contient des questions sur VDMA et l\'ingénierie mécanique. Bonne chance!'
        }
      }
    },
    {
      type: 'question',
      order: 2,
      data: {
        question: {
          de: 'Was ist VDMA?',
          en: 'What is VDMA?',
          fr: 'Qu\'est-ce que VDMA?'
        },
        answers: {
          de: [
            'Verband Deutscher Maschinen- und Anlagenbau',
            'Verein Deutscher Maschinenbauer',
            'Verband Deutscher Metallarbeiter',
            'Verein Deutscher Maschinenhersteller'
          ],
          en: [
            'German Engineering Federation',
            'German Machine Builders Association',
            'German Metal Workers Union',
            'German Machine Manufacturers Association'
          ],
          fr: [
            'Fédération allemande de l\'ingénierie',
            'Association allemande des constructeurs de machines',
            'Syndicat allemand des métallurgistes',
            'Association allemande des fabricants de machines'
          ]
        },
        isMultipleChoice: false
      }
    },
    {
      type: 'pageBreak',
      order: 3,
      data: {}
    },
    {
      type: 'question',
      order: 4,
      data: {
        question: {
          de: 'Welche Farbe hat das VDMA-Logo hauptsächlich?',
          en: 'What is the main color of the VDMA logo?',
          fr: 'Quelle est la couleur principale du logo VDMA?'
        },
        answers: {
          de: ['Blau', 'Rot', 'Grün', 'Gelb'],
          en: ['Blue', 'Red', 'Green', 'Yellow'],
          fr: ['Bleu', 'Rouge', 'Vert', 'Jaune']
        },
        isMultipleChoice: false
      }
    }
  ]

  // Delete existing modules for this quiz first
  await prisma.quizModule.deleteMany({
    where: { quizId: quiz.id }
  })

  // Create new modules
  for (const moduleData of modules) {
    await prisma.quizModule.create({
      data: {
        quizId: quiz.id,
        type: moduleData.type,
        order: moduleData.order,
        data: moduleData.data,
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
