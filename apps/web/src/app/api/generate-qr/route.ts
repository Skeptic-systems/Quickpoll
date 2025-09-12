import { NextRequest, NextResponse } from 'next/server'
import QRCode from 'qrcode'

export async function POST(request: NextRequest) {
  try {
    const { url } = await request.json()

    if (!url) {
      return NextResponse.json(
        { error: 'URL is required' },
        { status: 400 }
      )
    }

    // Generate QR code as data URL with white background (for display in modal)
    const qrCodeDataURL = await QRCode.toDataURL(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#FFFFFF'
      }
    })

    // Generate QR code as PNG buffer with transparent background (for download)
    const qrCodePNG = await QRCode.toBuffer(url, {
      width: 300,
      margin: 2,
      color: {
        dark: '#000000',
        light: '#00000000' // Fully transparent background
      },
      type: 'png'
    })

    // Convert PNG buffer to base64 for download
    const qrCodePNGBase64 = qrCodePNG.toString('base64')
    const qrCodeDownloadURL = `data:image/png;base64,${qrCodePNGBase64}`

    return NextResponse.json({ 
      qrCodeDataURL,
      qrCodeDownloadURL,
      url // Return the URL for verification
    })
  } catch (error) {
    console.error('Error generating QR code:', error)
    return NextResponse.json(
      { error: 'Failed to generate QR code' },
      { status: 500 }
    )
  }
}
