import { NextRequest, NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/lib/auth'
import { PrismaClient } from '@prisma/client'
import puppeteer from 'puppeteer'

const prisma = new PrismaClient()

export async function GET(request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Não autorizado' }, { status: 401 })
    }

    const testId = params.id

    // Buscar resultado do teste
    const testResult = await prisma.testResult.findFirst({
      where: {
        id: testId,
        userId: session.user.id
      },
      include: {
        test: {
          include: {
            category: true
          }
        },
        user: true,
        aiAnalyses: {
          where: {
            analysisType: 'GRAPHOLOGY_ADVANCED'
          },
          orderBy: {
            createdAt: 'desc'
          },
          take: 1
        }
      }
    })

    if (!testResult) {
      return NextResponse.json({ error: 'Resultado não encontrado' }, { status: 404 })
    }

    // Verificar se é um teste grafológico
    if (testResult.test.testType !== 'GRAPHOLOGY') {
      return NextResponse.json({ error: 'Tipo de teste não suportado' }, { status: 400 })
    }

    // Buscar análise grafológica
    const graphologyAnalysis = testResult.aiAnalyses[0]
    if (!graphologyAnalysis) {
      return NextResponse.json({ error: 'Análise grafológica não encontrada' }, { status: 404 })
    }

    const analysisData = JSON.parse(graphologyAnalysis.analysis as string)

    // Gerar HTML do relatório
    const htmlContent = generateReportHTML(testResult, analysisData)

    // Gerar PDF usando Puppeteer
    const browser = await puppeteer.launch({
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

    await browser.close()

    // Retornar PDF
    return new NextResponse(pdfBuffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="relatorio-grafologico-${testResult.user.firstName}-${new Date(testResult.completedAt).toISOString().split('T')[0]}.pdf"`
      }
    })

  } catch (error) {
    console.error('Erro ao gerar PDF:', error)
    return NextResponse.json(
      { error: 'Erro interno do servidor' },
      { status: 500 }
    )
  }
}

function generateReportHTML(testResult: any, analysisData: any): string {
  const completedDate = new Date(testResult.completedAt).toLocaleDateString('pt-BR')
  const userName = `${testResult.user.firstName} ${testResult.user.lastName}`

  return `
    <!DOCTYPE html>
    <html lang="pt-BR">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <title>Relatório Grafológico - ${userName}</title>
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
        
        .header {
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          color: white;
          padding: 40px 30px;
          text-align: center;
          margin-bottom: 30px;
        }
        
        .header h1 {
          font-size: 2.5em;
          margin-bottom: 10px;
          font-weight: 300;
        }
        
        .header .subtitle {
          font-size: 1.2em;
          opacity: 0.9;
          font-style: italic;
          margin-bottom: 20px;
        }
        
        .header .info {
          display: flex;
          justify-content: space-around;
          margin-top: 20px;
          font-size: 0.9em;
        }
        
        .container {
          max-width: 800px;
          margin: 0 auto;
          padding: 0 30px;
        }
        
        .section {
          margin-bottom: 40px;
          page-break-inside: avoid;
        }
        
        .section-title {
          font-size: 1.8em;
          color: #667eea;
          margin-bottom: 20px;
          padding-bottom: 10px;
          border-bottom: 3px solid #667eea;
        }
        
        .subsection {
          margin-bottom: 25px;
        }
        
        .subsection-title {
          font-size: 1.3em;
          color: #555;
          margin-bottom: 15px;
          font-weight: 600;
        }
        
        .technical-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .technical-item {
          background: #f8f9fa;
          padding: 15px;
          border-radius: 8px;
          border-left: 4px solid #667eea;
        }
        
        .technical-item strong {
          color: #667eea;
          display: block;
          margin-bottom: 5px;
        }
        
        .trends-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .trend-item {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
          text-align: center;
        }
        
        .trend-score {
          font-size: 2em;
          font-weight: bold;
          margin-bottom: 10px;
        }
        
        .trend-score.excellent { color: #28a745; }
        .trend-score.good { color: #007bff; }
        .trend-score.moderate { color: #ffc107; }
        .trend-score.needs-attention { color: #dc3545; }
        
        .trend-label {
          font-weight: 600;
          margin-bottom: 10px;
          color: #555;
        }
        
        .trend-description {
          font-size: 0.9em;
          color: #666;
          line-height: 1.4;
        }
        
        .suggestions-list {
          list-style: none;
          counter-reset: suggestion-counter;
        }
        
        .suggestions-list li {
          counter-increment: suggestion-counter;
          margin-bottom: 15px;
          padding: 15px;
          background: #f8f9fa;
          border-radius: 8px;
          border-left: 4px solid #28a745;
          position: relative;
        }
        
        .suggestions-list li::before {
          content: counter(suggestion-counter);
          position: absolute;
          left: -15px;
          top: 15px;
          background: #28a745;
          color: white;
          width: 25px;
          height: 25px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-weight: bold;
          font-size: 0.8em;
        }
        
        .insights-grid {
          display: grid;
          grid-template-columns: repeat(2, 1fr);
          gap: 20px;
          margin-bottom: 20px;
        }
        
        .insight-box {
          background: #fff;
          border: 1px solid #e9ecef;
          border-radius: 8px;
          padding: 20px;
        }
        
        .insight-box h4 {
          color: #667eea;
          margin-bottom: 15px;
          font-size: 1.1em;
        }
        
        .insight-list {
          list-style: none;
        }
        
        .insight-list li {
          margin-bottom: 8px;
          padding-left: 20px;
          position: relative;
        }
        
        .insight-list li::before {
          content: '•';
          color: #667eea;
          font-weight: bold;
          position: absolute;
          left: 0;
        }
        
        .status-badge {
          display: inline-block;
          padding: 4px 8px;
          border-radius: 12px;
          font-size: 11px;
          font-weight: 600;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          background: #d4edda;
          color: #155724;
        }
        
        .footer {
          margin-top: 50px;
          padding: 30px;
          background: #f8f9fa;
          text-align: center;
          border-top: 1px solid #e9ecef;
        }
        
        .footer p {
          color: #666;
          font-size: 0.9em;
          margin-bottom: 5px;
        }
        
        @media print {
          .header {
            -webkit-print-color-adjust: exact;
            color-adjust: exact;
          }
        }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>Relatório Grafológico Profissional</h1>
        <p class="subtitle">"Sua escrita revela quem você é. Veja o que sua mente expressa além das palavras."</p>
        <div class="info">
          <div><strong>Colaborador:</strong> ${userName}</div>
          <div><strong>Data:</strong> ${completedDate}</div>
          <div><strong>Status:</strong> <span class="status-badge">Análise Completa</span></div>
        </div>
      </div>
      
      <div class="container">
        <div class="section">
          <h2 class="section-title">Resumo Comportamental</h2>
          <p style="text-align: justify; line-height: 1.8; font-size: 1.1em;">${analysisData.behavioralSummary}</p>
        </div>
        
        ${analysisData.detailedAnalysis ? `
        <div class="section">
          <h2 class="section-title">Análise Técnica Detalhada</h2>
          
          <div class="subsection">
            <h3 class="subsection-title">Observações Técnicas</h3>
            <div class="technical-grid">
              <div class="technical-item">
                <strong>Pressão:</strong>
                ${analysisData.detailedAnalysis.technicalObservations.pressure}
              </div>
              <div class="technical-item">
                <strong>Tamanho:</strong>
                ${analysisData.detailedAnalysis.technicalObservations.size}
              </div>
              <div class="technical-item">
                <strong>Inclinação:</strong>
                ${analysisData.detailedAnalysis.technicalObservations.inclination}
              </div>
              <div class="technical-item">
                <strong>Espaçamento:</strong>
                ${analysisData.detailedAnalysis.technicalObservations.spacing}
              </div>
              <div class="technical-item">
                <strong>Ritmo:</strong>
                ${analysisData.detailedAnalysis.technicalObservations.rhythm}
              </div>
              <div class="technical-item">
                <strong>Regularidade:</strong>
                ${analysisData.detailedAnalysis.technicalObservations.regularity}
              </div>
            </div>
          </div>
          
          <div class="subsection">
            <h3 class="subsection-title">Interpretação Psicológica</h3>
            <p style="text-align: justify; line-height: 1.7;">${analysisData.detailedAnalysis.psychologicalInterpretation}</p>
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2 class="section-title">Tendências Comportamentais no Trabalho</h2>
          <div class="trends-grid">
            ${Object.entries(analysisData.workplaceTrends).map(([key, trend]: [string, any]) => `
              <div class="trend-item">
                <div class="trend-score ${getScoreClass(trend.score)}">${trend.score}</div>
                <div class="trend-label">${getTrendLabel(key)}</div>
                <div class="trend-description">${trend.description}</div>
              </div>
            `).join('')}
          </div>
        </div>
        
        ${analysisData.professionalInsights ? `
        <div class="section">
          <h2 class="section-title">Insights Profissionais</h2>
          <div class="insights-grid">
            <div class="insight-box">
              <h4>Pontos Fortes</h4>
              <ul class="insight-list">
                ${analysisData.professionalInsights.strengths.map((strength: string) => `<li>${strength}</li>`).join('')}
              </ul>
            </div>
            <div class="insight-box">
              <h4>Áreas de Desenvolvimento</h4>
              <ul class="insight-list">
                ${analysisData.professionalInsights.developmentAreas.map((area: string) => `<li>${area}</li>`).join('')}
              </ul>
            </div>
          </div>
          
          <div class="insights-grid">
            <div class="insight-box">
              <h4>Estilo de Trabalho</h4>
              <p>${analysisData.professionalInsights.workStyle}</p>
            </div>
            <div class="insight-box">
              <h4>Estilo de Comunicação</h4>
              <p>${analysisData.professionalInsights.communicationStyle}</p>
            </div>
          </div>
        </div>
        ` : ''}
        
        <div class="section">
          <h2 class="section-title">Sugestões Práticas</h2>
          <ul class="suggestions-list">
            ${analysisData.practicalSuggestions.map((suggestion: string) => `<li>${suggestion}</li>`).join('')}
          </ul>
        </div>
        
        ${analysisData.scientificBasis ? `
        <div class="section">
          <h2 class="section-title">Fundamentação Científica</h2>
          <p style="text-align: justify; line-height: 1.7; background: #f8f9fa; padding: 20px; border-radius: 8px; border-left: 4px solid #667eea;">${analysisData.scientificBasis}</p>
        </div>
        ` : ''}
      </div>
      
      <div class="footer">
        <p><strong>HumaniQ AI - Análise Grafológica Profissional</strong></p>
        <p>Relatório gerado em ${new Date().toLocaleDateString('pt-BR')} às ${new Date().toLocaleTimeString('pt-BR')}</p>
        <p>Este relatório foi gerado por inteligência artificial e deve ser interpretado por profissionais qualificados.</p>
      </div>
    </body>
    </html>
  `
}



function getScoreClass(score: number): string {
  if (score >= 80) return 'excellent'
  if (score >= 60) return 'good'
  if (score >= 40) return 'moderate'
  return 'needs-attention'
}

function getTrendLabel(key: string): string {
  const labels: { [key: string]: string } = {
    communication: 'Comunicação',
    organization: 'Organização',
    emotionalStability: 'Estabilidade Emocional',
    leadership: 'Liderança',
    adaptability: 'Adaptabilidade'
  }
  return labels[key] || key
}