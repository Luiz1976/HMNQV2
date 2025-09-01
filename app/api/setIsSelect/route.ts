import { NextRequest, NextResponse } from 'next/server'

// API temporária para resolver erro de timeout
// Esta API não parece ser necessária no sistema atual
export async function GET(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: 'API setIsSelect não é necessária no sistema atual' 
  })
}

export async function POST(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: 'API setIsSelect não é necessária no sistema atual' 
  })
}

export async function PUT(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: 'API setIsSelect não é necessária no sistema atual' 
  })
}

export async function DELETE(request: NextRequest) {
  return NextResponse.json({ 
    success: true, 
    message: 'API setIsSelect não é necessária no sistema atual' 
  })
}