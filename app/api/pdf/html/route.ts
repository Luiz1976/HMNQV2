import { NextRequest, NextResponse } from 'next/server'
import puppeteer from 'puppeteer'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

// Rota para gerar PDF a partir do HTML enviado pelo cliente
export async function POST(request: NextRequest) {
  try {
    const { html } = await request.json() as { html: string }

    if (!html) {
      return NextResponse.json({ error: 'HTML não fornecido' }, { status: 400 })
    }

    const pdfBuffer = await generatePDFFromHTML(html)

    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="export-humaniq-disc-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })
  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json({ error: 'Erro interno do servidor' }, { status: 500 })
  }
}

// Função utilitária para gerar PDF via Puppeteer preservando estilos
async function generatePDFFromHTML(htmlContent: string): Promise<Buffer> {
  let browser

  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })

    const page = await browser.newPage()
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    await page.emulateMediaType('screen')

    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      preferCSSPageSize: true
    })

    return Buffer.from(pdfBuffer)
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}