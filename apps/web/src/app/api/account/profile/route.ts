import { NextRequest, NextResponse } from 'next/server'
import { auth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

export async function GET(request: NextRequest) {
  try {
    console.log('🔍 API Account-Profile: Starting session check...')
    console.log('🍪 API Account-Profile: Request cookies:', request.cookies.getAll())
    console.log('📋 API Account-Profile: Request headers:', Object.fromEntries(request.headers.entries()))
    
    // Try different ways to get the session
    console.log('🔍 API Account-Profile: Trying auth.api.getSession...')
    const session = await auth.api.getSession({
      headers: request.headers
    })

    console.log('🔐 API Account-Profile: Session result:', session ? 'Found' : 'Not found')
    if (session?.user) {
      console.log('👤 API Account-Profile: User ID:', session.user.id)
      console.log('👤 API Account-Profile: User email:', session.user.email)
    } else {
      console.log('❌ API Account-Profile: Session details:', session)
      
      // Try to get session with cookies directly
      console.log('🔍 API Account-Profile: Trying alternative session method...')
      try {
        const cookieHeader = request.headers.get('cookie')
        console.log('🍪 API Account-Profile: Raw cookie header:', cookieHeader)
        
        // Try with raw cookies
        const altSession = await auth.api.getSession({
          headers: new Headers({
            'cookie': cookieHeader || ''
          })
        })
        console.log('🔐 API Account-Profile: Alternative session result:', altSession ? 'Found' : 'Not found')
        
        // If still no session, try to find session token manually
        if (!altSession?.user) {
          console.log('🔍 API Account-Profile: Trying manual session lookup...')
          
          // Look for better-auth session cookie
          const sessionCookie = request.cookies.get('better-auth.session_token')
          if (sessionCookie) {
            console.log('🍪 API Account-Profile: Found better-auth session cookie:', sessionCookie.value.substring(0, 20) + '...')
            
            // Try to find session in database
            const dbSession = await prisma.session.findUnique({
              where: { sessionToken: sessionCookie.value },
              include: { user: true }
            })
            
            if (dbSession && dbSession.expires > new Date()) {
              console.log('✅ API Account-Profile: Found valid session in database')
              return NextResponse.json({
                user: {
                  id: dbSession.user.id,
                  name: dbSession.user.name,
                  email: dbSession.user.email,
                  role: dbSession.user.role || 'user',
                  createdAt: dbSession.user.createdAt,
                  updatedAt: dbSession.user.updatedAt
                }
              })
            } else {
              console.log('❌ API Account-Profile: Session not found in database or expired')
            }
          } else {
            console.log('❌ API Account-Profile: No better-auth session cookie found')
          }
          
          // Fallback: Try old session-token cookie
          const oldSessionCookie = request.cookies.get('session-token')
          if (oldSessionCookie) {
            console.log('🍪 API Account-Profile: Found old session-token cookie:', oldSessionCookie.value)
            
            // Try to find session in database with old token
            const oldDbSession = await prisma.session.findUnique({
              where: { sessionToken: oldSessionCookie.value },
              include: { user: true }
            })
            
            if (oldDbSession && oldDbSession.expires > new Date()) {
              console.log('✅ API Account-Profile: Found valid old session in database')
              return NextResponse.json({
                user: {
                  id: oldDbSession.user.id,
                  name: oldDbSession.user.name,
                  email: oldDbSession.user.email,
                  role: oldDbSession.user.role || 'user',
                  createdAt: oldDbSession.user.createdAt,
                  updatedAt: oldDbSession.user.updatedAt
                }
              })
            } else {
              console.log('❌ API Account-Profile: Old session not found in database or expired')
            }
          }
        }
      } catch (altError) {
        console.error('💥 API Account-Profile: Alternative session error:', altError)
      }
    }

    if (!session?.user) {
      console.log('❌ API Account-Profile: No session found, returning 401')
      return NextResponse.json(
        { message: 'Nicht authentifiziert' },
        { status: 401 }
      )
    }

    console.log('✅ API Account-Profile: Returning user data')
    return NextResponse.json({
      user: {
        id: session.user.id,
        name: session.user.name,
        email: session.user.email,
        role: 'user', // Default role since it's not in the session
        createdAt: session.user.createdAt,
        updatedAt: session.user.updatedAt
      }
    })

  } catch (error) {
    console.error('💥 API Account-Profile: Error:', error)
    return NextResponse.json(
      { message: 'Ein Fehler ist aufgetreten' },
      { status: 500 }
    )
  }
}


