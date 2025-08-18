// HumaniQ - API para Geração de PDF de Resultados Grafológicos
// Gera relatórios em PDF com design profissional e conteúdo completo

import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth/next'
import { authOptions } from '@/lib/auth'
import { db as prisma } from '@/lib/db'
import puppeteer from 'puppeteer'

export const dynamic = 'force-dynamic'

// Interface para dados do PDF
interface PDFGenerationRequest {
  testResultId: string
  includeImage?: boolean
  includeAnalysis?: boolean
  format?: 'professional' | 'summary'
}

// POST - Gerar PDF
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions)
    
    if (!session?.user?.id) {
      return NextResponse.json(
        { error: 'Não autorizado' },
        { status: 401 }
      )
    }

    const body: PDFGenerationRequest = await request.json()
    const { testResultId, includeImage = true, includeAnalysis = true, format = 'professional' } = body

    // Buscar dados do teste
    const testResult = await prisma.testResult.findFirst({
      where: {
        id: testResultId,
        userId: session.user.id
      },
      include: {
        user: true,
        test: true
      }
    })

    if (!testResult) {
      return NextResponse.json(
        { error: 'Resultado do teste não encontrado' },
        { status: 404 }
      )
    }

    // Buscar análise de imagem se solicitada
    let imageAnalysis = null
    if (includeImage) {
      imageAnalysis = await prisma.aIAnalysis.findFirst({
        where: {
          testResultId,
          userId: session.user.id
        }
      })
    }

    // Buscar análise de IA se solicitada
    let aiAnalysis = null
    if (includeAnalysis) {
      aiAnalysis = await prisma.aIAnalysis.findFirst({
        where: {
          testResultId,
          userId: session.user.id
        }
      })
    }

    // Gerar HTML do relatório
    const htmlContent = generateReportHTML({
      testResult,
      imageAnalysis,
      aiAnalysis,
      format
    })

    // Gerar PDF usando Puppeteer
    const pdfBuffer = await generatePDFFromHTML(htmlContent)

    // Retornar PDF como resposta
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-grafologico-${(testResult.user.firstName + ' ' + testResult.user.lastName).replace(/\s+/g, '-').toLowerCase()}-${new Date().toISOString().split('T')[0]}.pdf"`,
        'Content-Length': pdfBuffer.length.toString()
      }
    })

  } catch (error) {
    console.error('Erro na geração do PDF:', error)
    return NextResponse.json(
      { error: 'Falha na geração do PDF' },
      { status: 500 }
    )
  }
}

// Função para gerar HTML do relatório
function generateReportHTML(data: {
  testResult: any
  imageAnalysis: any
  aiAnalysis: any
  format: string
}): string {
  const { testResult, imageAnalysis, aiAnalysis, format } = data
  
  return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Relatório Grafológico - ${testResult.user.name}</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }
        
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #fff;
        }
        
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 40px;
        }
        
        .header {
            text-align: center;
            margin-bottom: 40px;
            padding-bottom: 20px;
            border-bottom: 3px solid #6366f1;
        }
        
        .logo {
            font-size: 28px;
            font-weight: bold;
            color: #6366f1;
            margin-bottom: 10px;
        }
        
        .subtitle {
            font-size: 18px;
            color: #666;
            margin-bottom: 20px;
        }
        
        .highlight-quote {
            font-size: 20px;
            font-style: italic;
            color: #6366f1;
            text-align: center;
            margin: 30px 0;
            padding: 20px;
            background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%);
            border-radius: 10px;
            border-left: 4px solid #6366f1;
        }
        
        .participant-info {
            background: #f8fafc;
            padding: 20px;
            border-radius: 10px;
            margin-bottom: 30px;
        }
        
        .participant-info h3 {
            color: #374151;
            margin-bottom: 15px;
            font-size: 18px;
        }
        
        .info-grid {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
        }
        
        .info-item {
            display: flex;
            justify-content: space-between;
            padding: 8px 0;
            border-bottom: 1px solid #e5e7eb;
        }
        
        .info-label {
            font-weight: 600;
            color: #374151;
        }
        
        .info-value {
            color: #6b7280;
        }
        
        .section {
            margin-bottom: 40px;
            page-break-inside: avoid;
        }
        
        .section-title {
            font-size: 22px;
            font-weight: bold;
            color: #1f2937;
            margin-bottom: 20px;
            padding-bottom: 10px;
            border-bottom: 2px solid #e5e7eb;
        }
        
        .scores-grid {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 20px;
            margin-bottom: 30px;
        }
        
        .score-card {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 20px;
            text-align: center;
            box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
        }
        
        .score-label {
            font-size: 14px;
            color: #6b7280;
            margin-bottom: 8px;
        }
        
        .score-value {
            font-size: 32px;
            font-weight: bold;
            color: #6366f1;
        }
        
        .score-bar {
            width: 100%;
            height: 8px;
            background: #e5e7eb;
            border-radius: 4px;
            margin-top: 10px;
            overflow: hidden;
        }
        
        .score-fill {
            height: 100%;
            background: linear-gradient(90deg, #6366f1, #8b5cf6);
            border-radius: 4px;
        }
        
        .image-section {
            text-align: center;
            margin: 30px 0;
            page-break-inside: avoid;
        }
        
        .manuscript-image {
            max-width: 100%;
            height: auto;
            border: 2px solid #e5e7eb;
            border-radius: 8px;
            box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
        }
        
        .highlights-legend {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
            gap: 10px;
            margin-top: 20px;
            padding: 15px;
            background: #f8fafc;
            border-radius: 8px;
        }
        
        .legend-item {
            display: flex;
            align-items: center;
            gap: 8px;
            font-size: 12px;
        }
        
        .legend-color {
            width: 16px;
            height: 16px;
            border-radius: 3px;
            border: 1px solid #ccc;
        }
        
        .analysis-text {
            background: #f8fafc;
            padding: 25px;
            border-radius: 10px;
            border-left: 4px solid #6366f1;
            margin: 20px 0;
            line-height: 1.8;
        }
        
        .behavioral-trends {
            display: grid;
            grid-template-columns: 1fr;
            gap: 15px;
            margin: 20px 0;
        }
        
        .trend-item {
            background: #fff;
            border: 1px solid #e5e7eb;
            border-radius: 8px;
            padding: 15px;
        }
        
        .trend-title {
            font-weight: 600;
            color: #374151;
            margin-bottom: 8px;
            text-transform: capitalize;
        }
        
        .trend-description {
            color: #6b7280;
            font-size: 14px;
        }
        
        .recommendations {
            background: #ecfdf5;
            border: 1px solid #10b981;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .recommendations h4 {
            color: #065f46;
            margin-bottom: 15px;
        }
        
        .recommendations ul {
            list-style: none;
            padding: 0;
        }
        
        .recommendations li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #047857;
        }
        
        .recommendations li:before {
            content: "✓";
            position: absolute;
            left: 0;
            color: #10b981;
            font-weight: bold;
        }
        
        .strengths {
            background: #fef3c7;
            border: 1px solid #f59e0b;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        
        .strengths h4 {
            color: #92400e;
            margin-bottom: 15px;
        }
        
        .strengths ul {
            list-style: none;
            padding: 0;
        }
        
        .strengths li {
            padding: 8px 0;
            padding-left: 20px;
            position: relative;
            color: #b45309;
        }
        
        .strengths li:before {
            content: "⭐";
            position: absolute;
            left: 0;
        }
        
        .footer {
            margin-top: 50px;
            padding-top: 20px;
            border-top: 2px solid #e5e7eb;
            text-align: center;
            color: #6b7280;
            font-size: 12px;
        }
        
        .status-badge {
            display: inline-block;
            padding: 4px 8px;
            border-radius: 4px;
            font-size: 12px;
            font-weight: bold;
            background: #d4edda;
            color: #155724;
        }
        
        @media print {
            .container {
                padding: 20px;
            }
            
            .page-break {
                page-break-before: always;
            }
        }
    </style>
</head>
<body>
    <div class="container">
        <!-- Header -->
        <div class="header">
            <div class="logo">HumaniQ</div>
            <div class="subtitle">Relatório de Análise Grafológica</div>
            <div style="font-size: 14px; color: #6b7280;">
                Gerado em ${new Date().toLocaleDateString('pt-BR', { 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
            </div>
        </div>
        
        <!-- Frase de destaque -->
        <div class="highlight-quote">
            "Sua escrita revela quem você é. Veja o que sua mente expressa além das palavras."
        </div>
        
        <!-- Informações do participante -->
        <div class="participant-info">
            <h3>Informações do Participante</h3>
            <div class="info-grid">
                <div class="info-item">
                    <span class="info-label">Nome:</span>
                    <span class="info-value">${testResult.user.name}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Email:</span>
                    <span class="info-value">${testResult.user.email}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Tipo de Teste:</span>
                    <span class="info-value">${testResult.test.title}</span>
                </div>
                <div class="info-item">
                    <span class="info-label">Data de Conclusão:</span>
                    <span class="info-value">${new Date(testResult.completedAt).toLocaleDateString('pt-BR')}</span>
                </div>
            </div>
        </div>
        
        <!-- Pontuações -->
        <div class="section">
            <h2 class="section-title">Resultados e Pontuações</h2>
            <div class="scores-grid">
                ${Object.entries(testResult.scores || {}).map(([key, value]) => `
                    <div class="score-card">
                        <div class="score-label">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div class="score-value">${value}%</div>
                        <div class="score-bar">
                            <div class="score-fill" style="width: ${value}%"></div>
                        </div>
                    </div>
                `).join('')}
            </div>
        </div>
        
        ${imageAnalysis ? `
        <!-- Imagem do manuscrito -->
        <div class="section page-break">
            <h2 class="section-title">
                Análise da Imagem
                <span class="status-badge">Análise Completa</span>
            </h2>
            <div class="image-section">
                <img src="${imageAnalysis.imageUrl}" alt="Manuscrito analisado" class="manuscript-image">
                <div class="highlights-legend">
                    <div class="legend-item">
                        <div class="legend-color" style="background: rgba(139, 69, 19, 0.3); border-color: rgba(139, 69, 19, 0.8);"></div>
                        <span>Pressão</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: rgba(34, 139, 34, 0.3); border-color: rgba(34, 139, 34, 0.8);"></div>
                        <span>Tamanho</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: rgba(30, 144, 255, 0.3); border-color: rgba(30, 144, 255, 0.8);"></div>
                        <span>Inclinação</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: rgba(255, 165, 0, 0.3); border-color: rgba(255, 165, 0, 0.8);"></div>
                        <span>Espaçamento</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: rgba(128, 0, 128, 0.3); border-color: rgba(128, 0, 128, 0.8);"></div>
                        <span>Organização</span>
                    </div>
                    <div class="legend-item">
                        <div class="legend-color" style="background: rgba(220, 20, 60, 0.3); border-color: rgba(220, 20, 60, 0.8);"></div>
                        <span>Regularidade</span>
                    </div>
                </div>
            </div>
            
            <div class="analysis-text">
                ${imageAnalysis.analysis}
            </div>
        </div>
        ` : ''}
        
        ${imageAnalysis?.behavioralAnalysis ? `
        <!-- Análise comportamental -->
        <div class="section page-break">
            <h2 class="section-title">Análise Comportamental Avançada</h2>
            
            <div class="analysis-text">
                <h4 style="margin-bottom: 15px; color: #374151;">Resumo Profissional</h4>
                ${imageAnalysis.behavioralAnalysis.professionalSummary}
            </div>
            
            <h3 style="margin: 30px 0 20px 0; color: #374151;">Tendências Comportamentais</h3>
            <div class="behavioral-trends">
                ${Object.entries(imageAnalysis.behavioralAnalysis.behavioralTrends || {}).map(([key, value]) => `
                    <div class="trend-item">
                        <div class="trend-title">${key.replace(/([A-Z])/g, ' $1').trim()}</div>
                        <div class="trend-description">${value}</div>
                    </div>
                `).join('')}
            </div>
            
            ${imageAnalysis.behavioralAnalysis.strengths?.length ? `
            <div class="strengths">
                <h4>Principais Pontos Fortes</h4>
                <ul>
                    ${imageAnalysis.behavioralAnalysis.strengths.map((strength: any) => `<li>${strength}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
            
            ${imageAnalysis.behavioralAnalysis.organizationalSuggestions?.length ? `
            <div class="recommendations">
                <h4>Sugestões para Aproveitamento Organizacional</h4>
                <ul>
                    ${imageAnalysis.behavioralAnalysis.organizationalSuggestions.map((suggestion: any) => `<li>${suggestion}</li>`).join('')}
                </ul>
            </div>
            ` : ''}
        </div>
        ` : ''}
        
        <!-- Interpretação geral -->
        <div class="section">
            <h2 class="section-title">Interpretação Geral</h2>
            <div class="analysis-text">
                ${testResult.interpretation || 'Interpretação não disponível.'}
            </div>
        </div>
        
        <!-- Recomendações -->
        ${testResult.recommendations?.length ? `
        <div class="section">
            <h2 class="section-title">Recomendações</h2>
            <div class="recommendations">
                <h4>Sugestões de Desenvolvimento</h4>
                <ul>
                    ${testResult.recommendations.map((rec: any) => `<li>${rec}</li>`).join('')}
                </ul>
            </div>
        </div>
        ` : ''}
        
        <!-- Footer -->
        <div class="footer">
            <p><strong>HumaniQ</strong> - Plataforma de Avaliação Psicológica e Grafológica</p>
            <p>Este relatório foi gerado automaticamente e deve ser interpretado por profissional qualificado.</p>
            <p>© ${new Date().getFullYear()} HumaniQ. Todos os direitos reservados.</p>
        </div>
    </div>
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
    await page.setContent(htmlContent, { waitUntil: 'networkidle0' })
    
    const pdfBuffer = await page.pdf({
      format: 'A4',
      printBackground: true,
      margin: {
        top: '20mm',
        right: '15mm',
        bottom: '20mm',
        left: '15mm'
      }
    })
    
    return Buffer.from(pdfBuffer)
    
  } finally {
    if (browser) {
      await browser.close()
    }
  }
}