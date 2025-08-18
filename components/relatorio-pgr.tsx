"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { AlertTriangle, FileText, Calendar, Building, MapPin, Users, TrendingUp, Shield, CheckCircle, AlertCircle, XCircle } from "lucide-react"

interface RelatorioPGRProps {
  nomeEmpresa?: string
  cnpj?: string
  endereco?: string
  dataAvaliacao?: string
  versaoSistema?: string
  totalParticipantes?: number
  setoresAvaliados?: string[]
  abrangencia?: string
}

const riscosPsicossociais = [
  {
    risco: "Sobrecarga de trabalho",
    probabilidade: "Alta",
    severidade: "Alta",
    nivel: "Crítico",
    acao: "Engenharia/Admin.",
    cor: "bg-red-500"
  },
  {
    risco: "Falta de apoio da liderança",
    probabilidade: "Média",
    severidade: "Alta",
    nivel: "Alto",
    acao: "Treinamento/Clima",
    cor: "bg-orange-500"
  },
  {
    risco: "Ambiente competitivo tóxico",
    probabilidade: "Alta",
    severidade: "Média",
    nivel: "Alto",
    acao: "Cultura organizacional",
    cor: "bg-orange-500"
  },
  {
    risco: "Assédio moral institucional",
    probabilidade: "Baixa",
    severidade: "Alta",
    nivel: "Moderado",
    acao: "Investigação/Ética",
    cor: "bg-yellow-500"
  },
  {
    risco: "Falta de reconhecimento",
    probabilidade: "Alta",
    severidade: "Média",
    nivel: "Alto",
    acao: "Revisão de políticas",
    cor: "bg-orange-500"
  },
  {
    risco: "Insegurança na comunicação",
    probabilidade: "Média",
    severidade: "Média",
    nivel: "Moderado",
    acao: "Melhorar feedback",
    cor: "bg-yellow-500"
  }
]

const acoes = {
  engenharia: [
    "Redefinir jornada e metas no setor operacional",
    "Reorganizar fluxo de atividades críticas"
  ],
  coletivas: [
    "Implementar política clara de feedback e reconhecimento",
    "Criar canal seguro de denúncias e apoio psicológico"
  ],
  individuais: [
    "Treinamento de inteligência emocional e gestão de estresse",
    "Sessões de escuta ativa e coaching para lideranças"
  ]
}

export function RelatorioPGR({
  nomeEmpresa = "TechCorp Solutions",
  cnpj = "12.345.678/0001-90",
  endereco = "Av. Paulista, 1000 - São Paulo/SP - CEP: 01310-100",
  dataAvaliacao = new Date().toLocaleDateString('pt-BR'),
  versaoSistema = "2.1",
  totalParticipantes = 156,
  setoresAvaliados = ["Administrativo", "Operacional", "Logística"],
  abrangencia = "85% dos colaboradores por setor"
}: RelatorioPGRProps) {
  return (
    <Card className="w-full max-w-6xl mx-auto mt-6">
      <CardHeader className="bg-blue-50 border-b">
        <div className="flex items-center gap-3">
          <FileText className="h-6 w-6 text-blue-600" />
          <div>
            <CardTitle className="text-xl font-bold text-blue-900">
              📘 Relatório de Avaliação de Riscos Psicossociais
            </CardTitle>
            <p className="text-sm text-blue-700 mt-1">
              (Anexo do PGR – Conforme NR01, item 1.5.3.2.2 e 1.5.4)
            </p>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="p-6 space-y-6">
        {/* Informações da Empresa */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 p-4 bg-gray-50 rounded-lg">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Building className="h-4 w-4 text-gray-600" />
              <span className="font-semibold">Empresa:</span> {nomeEmpresa}
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-gray-600" />
              <span className="font-semibold">CNPJ:</span> {cnpj}
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="h-4 w-4 text-gray-600" />
              <span className="font-semibold">Endereço:</span> {endereco}
            </div>
          </div>
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-gray-600" />
              <span className="font-semibold">Data da Avaliação:</span> {dataAvaliacao}
            </div>
            <div className="flex items-center gap-2">
              <Shield className="h-4 w-4 text-gray-600" />
              <span className="font-semibold">Sistema Utilizado:</span> HumaniQ AI – Versão {versaoSistema}
            </div>
          </div>
        </div>

        {/* 1. Objetivo do Relatório */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">1. Objetivo do Relatório</h3>
          <p className="text-gray-700 leading-relaxed">
            Este relatório tem por objetivo apresentar a avaliação dos riscos psicossociais ocupacionais 
            identificados no ambiente de trabalho da empresa, conforme exigência da NR01 – Gerenciamento 
            de Riscos Ocupacionais, especialmente em seu item 1.5.3.2.2, que trata da obrigatoriedade 
            de considerar riscos psicossociais no inventário de riscos.
          </p>
        </section>

        <Separator />

        {/* 2. Metodologia Utilizada */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">2. Metodologia Utilizada</h3>
          <p className="text-gray-700 mb-3">A avaliação foi realizada com base em:</p>
          <ul className="space-y-2 text-gray-700">
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Aplicação do HumaniQ RPO – Riscos Psicossociais Ocupacionais, um instrumento digital 
              estruturado com base em normas internacionais (ISO 45003, NIOSH, OMS) e alinhado à NR01.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Análise estatística automatizada com IA.</span>
            </li>
            <li className="flex items-start gap-2">
              <CheckCircle className="h-4 w-4 text-green-600 mt-0.5 flex-shrink-0" />
              <span>Interpretação multidimensional de fatores psicossociais: carga de trabalho, assédio, 
              suporte organizacional, controle, recompensas, segurança emocional, entre outros.</span>
            </li>
          </ul>
          
          <div className="mt-4 p-3 bg-blue-50 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">Ferramentas e Critérios:</h4>
            <ul className="text-sm text-blue-800 space-y-1">
              <li>• Escala de concordância (1 a 5)</li>
              <li>• Matriz de risco: Probabilidade x Severidade</li>
              <li>• Classificação: Risco Baixo, Moderado, Alto, Crítico</li>
            </ul>
          </div>
        </section>

        <Separator />

        {/* 3. Perfil da Avaliação */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">3. Perfil da Avaliação</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="p-3 bg-blue-50 rounded-lg text-center">
              <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
              <div className="text-sm text-blue-700">Setores Avaliados</div>
              <div className="font-semibold text-blue-900">{setoresAvaliados.join(", ")}</div>
            </div>
            <div className="p-3 bg-green-50 rounded-lg text-center">
              <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
              <div className="text-sm text-green-700">Nº de Participantes</div>
              <div className="font-semibold text-green-900">{totalParticipantes}</div>
            </div>
            <div className="p-3 bg-purple-50 rounded-lg text-center">
              <Shield className="h-6 w-6 text-purple-600 mx-auto mb-2" />
              <div className="text-sm text-purple-700">Abrangência</div>
              <div className="font-semibold text-purple-900">{abrangencia}</div>
            </div>
            <div className="p-3 bg-orange-50 rounded-lg text-center">
              <Calendar className="h-6 w-6 text-orange-600 mx-auto mb-2" />
              <div className="text-sm text-orange-700">Data de Aplicação</div>
              <div className="font-semibold text-orange-900">{dataAvaliacao}</div>
            </div>
          </div>
        </section>

        <Separator />

        {/* 4. Resumo Executivo */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">4. Resumo Executivo da Saúde Psicossocial</h3>
          <div className="p-4 bg-yellow-50 border-l-4 border-yellow-400 rounded-r-lg">
            <div className="flex items-center gap-2 mb-2">
              <AlertTriangle className="h-5 w-5 text-yellow-600" />
              <span className="font-semibold text-yellow-800">Indicador Geral: ⚠️ Risco Moderado</span>
            </div>
            <p className="text-yellow-800">
              A empresa apresenta sinais de sobrecarga mental e baixa percepção de suporte organizacional 
              em determinados setores, indicando necessidade de ações corretivas estruturais e comportamentais.
            </p>
          </div>
        </section>

        <Separator />

        {/* 5. Matriz de Riscos */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">5. Matriz de Riscos Psicossociais Consolidada</h3>
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-300">
              <thead>
                <tr className="bg-gray-100">
                  <th className="border border-gray-300 p-3 text-left font-semibold">Risco Psicossocial</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Probabilidade</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Severidade</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Nível de Risco</th>
                  <th className="border border-gray-300 p-3 text-center font-semibold">Ação Recomendada</th>
                </tr>
              </thead>
              <tbody>
                {riscosPsicossociais.map((risco, index) => (
                  <tr key={index} className="hover:bg-gray-50">
                    <td className="border border-gray-300 p-3">{risco.risco}</td>
                    <td className="border border-gray-300 p-3 text-center">{risco.probabilidade}</td>
                    <td className="border border-gray-300 p-3 text-center">{risco.severidade}</td>
                    <td className="border border-gray-300 p-3 text-center">
                      <Badge className={`${risco.cor} text-white`}>{risco.nivel}</Badge>
                    </td>
                    <td className="border border-gray-300 p-3 text-center text-sm">{risco.acao}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <Separator />

        {/* 7. Ações Recomendadas */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">7. Ações Recomendadas pela IA</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-red-50 rounded-lg">
              <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                <XCircle className="h-4 w-4" />
                Engenharia (Eliminar/Reduzir Risco na Fonte):
              </h4>
              <ul className="space-y-2 text-sm text-red-800">
                {acoes.engenharia.map((acao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-red-600">•</span>
                    <span>{acao}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-orange-50 rounded-lg">
              <h4 className="font-semibold text-orange-900 mb-3 flex items-center gap-2">
                <AlertCircle className="h-4 w-4" />
                Ações Coletivas (APC):
              </h4>
              <ul className="space-y-2 text-sm text-orange-800">
                {acoes.coletivas.map((acao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-orange-600">•</span>
                    <span>{acao}</span>
                  </li>
                ))}
              </ul>
            </div>
            
            <div className="p-4 bg-blue-50 rounded-lg">
              <h4 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
                <CheckCircle className="h-4 w-4" />
                Ações Individuais (EPI e AEI):
              </h4>
              <ul className="space-y-2 text-sm text-blue-800">
                {acoes.individuais.map((acao, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <span className="text-blue-600">•</span>
                    <span>{acao}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>

        <Separator />

        {/* 8. Monitoramento */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">8. Monitoramento e Revisão</h3>
          <p className="text-gray-700">
            Este relatório deve ser revisto no mínimo anualmente ou em caso de alterações significativas 
            no ambiente organizacional. Recomenda-se a reavaliação com nova aplicação das avaliações em até 6 meses.
          </p>
        </section>

        <Separator />

        {/* 9. Conclusão */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">9. Conclusão</h3>
          <p className="text-gray-700">
            A organização apresenta um nível psicossocial com risco moderado a alto, especialmente em 
            relação à sobrecarga, liderança e reconhecimento, o que exige ações estratégicas e urgentes 
            para a promoção de um ambiente psicologicamente saudável, conforme determina a NR01.
          </p>
        </section>

        <Separator />

        {/* 10. Identificação Técnica */}
        <section>
          <h3 className="text-lg font-bold text-gray-900 mb-3">10. Identificação Técnica</h3>
          <div className="p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border">
            <div className="flex items-start gap-3">
              <Shield className="h-6 w-6 text-blue-600 mt-1" />
              <div>
                <p className="font-semibold text-gray-900 mb-2">
                  📌 Levantamento, análise e confecção realizados integralmente pela plataforma de Inteligência Artificial
                </p>
                <p className="text-gray-700 mb-1">
                  <strong>HumaniQ AI</strong> – Solução digital especializada em avaliação e gestão de riscos 
                  psicossociais conforme NR01, item 1.5.3.2.2
                </p>
                <div className="flex gap-4 text-sm text-gray-600 mt-2">
                  <span><strong>Versão da Plataforma:</strong> {versaoSistema}</span>
                  <span><strong>Data de Geração Automática:</strong> {dataAvaliacao}</span>
                </div>
              </div>
            </div>
          </div>
        </section>
      </CardContent>
    </Card>
  )
}