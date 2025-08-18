// HumaniQ - API para Geração de PDF de Documentos
// Gera PDFs de documentos markdown com formatação preservada

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import puppeteer from 'puppeteer'
import fs from 'fs'
import path from 'path'
import { marked } from 'marked'
import { markedHighlight } from 'marked-highlight'
import hljs from 'highlight.js'

export const dynamic = 'force-dynamic'

// Interface para requisição de geração de PDF
interface DocumentPDFRequest {
  documentName: string
  title?: string
}

// POST - Gerar PDF de documento
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const { documentName, title }: DocumentPDFRequest = await request.json()

    if (!documentName) {
      return NextResponse.json(
        { error: 'Nome do documento é obrigatório' },
        { status: 400 }
      )
    }

    // Caminho do documento
    const documentPath = path.join(process.cwd(), '.trae', 'documents', `${documentName}.md`)
    
    // Verificar se o arquivo existe
    if (!fs.existsSync(documentPath)) {
      return NextResponse.json(
        { error: 'Documento não encontrado' },
        { status: 404 }
      )
    }

    // Ler o conteúdo do arquivo markdown
    const markdownContent = fs.readFileSync(documentPath, 'utf-8')

    // Configurar marked com highlight.js
    marked.use(markedHighlight({
      langPrefix: 'hljs language-',
      highlight(code, lang) {
        const language = hljs.getLanguage(lang) ? lang : 'plaintext'
        return hljs.highlight(code, { language }).value
      }
    }))

    // Converter markdown para HTML
    const htmlContent = await marked(markdownContent)

    // Gerar HTML completo com estilos
    const fullHtmlContent = generateDocumentHTML(htmlContent, title || documentName)

    // Gerar PDF usando Puppeteer
    const pdfBuffer = await generatePDFFromHTML(fullHtmlContent)

    // Retornar PDF como resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${documentName}-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Erro ao gerar PDF do documento:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

// Função para gerar HTML completo do documento
function generateDocumentHTML(content: string, title: string): string {
  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>${title}</title>
      <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/highlight.js/11.9.0/styles/github.min.css">
      <style>
        * {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }
        
        body {
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
          line-height: 1.6;
          color: #333;
          background: #fff;
          padding: 40px;
          max-width: 1200px;
          margin: 0 auto;
        }
        
        h1, h2, h3, h4, h5, h6 {
          margin-top: 2em;
          margin-bottom: 1em;
          font-weight: 600;
          line-height: 1.25;
        }
        
        h1 {
          font-size: 2.5em;
          color: #2c3e50;
          border-bottom: 3px solid #3498db;
          padding-bottom: 0.5em;
          margin-top: 0;
        }
        
        h2 {
          font-size: 2em;
          color: #34495e;
          border-bottom: 2px solid #ecf0f1;
          padding-bottom: 0.3em;
        }
        
        h3 {
          font-size: 1.5em;
          color: #2c3e50;
        }
        
        p {
          margin-bottom: 1em;
          text-align: justify;
        }
        
        ul, ol {
          margin-bottom: 1em;
          padding-left: 2em;
        }
        
        li {
          margin-bottom: 0.5em;
        }
        
        table {
          width: 100%;
          border-collapse: collapse;
          margin: 1.5em 0;
          font-size: 0.9em;
        }
        
        th, td {
          border: 1px solid #ddd;
          padding: 12px;
          text-align: left;
        }
        
        th {
          background-color: #f8f9fa;
          font-weight: 600;
          color: #2c3e50;
        }
        
        tr:nth-child(even) {
          background-color: #f8f9fa;
        }
        
        code {
          background-color: #f1f2f6;
          padding: 2px 6px;
          border-radius: 3px;
          font-family: 'Monaco', 'Menlo', 'Ubuntu Mono', monospace;
          font-size: 0.9em;
        }
        
        pre {
          background-color: #f8f9fa;
          border: 1px solid #e9ecef;
          border-radius: 6px;
          padding: 1em;
          margin: 1.5em 0;
          overflow-x: auto;
        }
        
        pre code {
          background: none;
          padding: 0;
          border-radius: 0;
        }
        
        blockquote {
          border-left: 4px solid #3498db;
          padding-left: 1em;
          margin: 1.5em 0;
          color: #666;
          font-style: italic;
        }
        
        .mermaid {
          text-align: center;
          margin: 2em 0;
          padding: 1em;
          background-color: #f8f9fa;
          border-radius: 6px;
          border: 1px solid #e9ecef;
        }
        
        .page-break {
          page-break-before: always;
        }
        
        @media print {
          body {
            padding: 20px;
          }
          
          h1, h2, h3 {
            page-break-after: avoid;
          }
          
          table, pre, blockquote {
            page-break-inside: avoid;
          }
        }
      </style>
    </head>
    <body>
      ${content}
      
      <script src="https://cdn.jsdelivr.net/npm/mermaid/dist/mermaid.min.js"></script>
      <script>
        mermaid.initialize({ startOnLoad: true, theme: 'default' });
      </script>
    </body>
    </html>
  `
}

// Função para gerar PDF usando Puppeteer
async function generatePDFFromHTML(htmlContent: string): Promise<Buffer> {
  let browser
  
  try {
    browser = await puppeteer.launch({
      headless: true,
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    })
    
    const page = await browser.newPage()
    
    // Definir conteúdo HTML
    await page.setContent(htmlContent, {
      waitUntil: 'networkidle0'
    })
    
    // Aguardar renderização do Mermaid
    await new Promise(resolve => setTimeout(resolve, 2000))
    
    // Gerar PDF
    const pdfBuffer = await page.pdf({
      format: 'A4',
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      },
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