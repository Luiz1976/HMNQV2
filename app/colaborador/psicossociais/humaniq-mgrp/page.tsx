'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, Shield, TrendingUp, Users, FileText, MessageSquare } from 'lucide-react';
import { toast } from 'sonner';
import { LikertScale } from '@/components/ui/likert-scale';

interface Question {
  id: number;
  text: string;
  dimension: string;
}

interface DimensionResult {
  name: string;
  score: number;
  level: string;
  color: string;
  icon: any;
  description: string;
}

interface TestResult {
  globalScore: number;
  globalLevel: string;
  dimensions: DimensionResult[];
  recommendations: string[];
  alerts: string[];
}

const questions: Question[] = [
  // Dimensão 1: Prevenção e Mapeamento de Riscos (8 questões)
  { id: 1, text: "A empresa realiza avaliações regulares dos riscos psicossociais no ambiente de trabalho.", dimension: "Prevenção e Mapeamento" },
  { id: 2, text: "Há um mapeamento claro dos fatores de risco psicossociais em cada setor.", dimension: "Prevenção e Mapeamento" },
  { id: 3, text: "A organização identifica situações que podem gerar estresse ou sobrecarga mental.", dimension: "Prevenção e Mapeamento" },
  { id: 4, text: "São utilizadas ferramentas científicas para avaliar os riscos psicossociais.", dimension: "Prevenção e Mapeamento" },
  { id: 5, text: "A empresa possui um inventário atualizado dos riscos psicossociais.", dimension: "Prevenção e Mapeamento" },
  { id: 6, text: "Os riscos são classificados por grau de severidade e probabilidade.", dimension: "Prevenção e Mapeamento" },
  { id: 7, text: "Há análise dos fatores organizacionais que impactam a saúde mental.", dimension: "Prevenção e Mapeamento" },
  { id: 8, text: "A avaliação de riscos considera as características individuais dos colaboradores.", dimension: "Prevenção e Mapeamento" },

  // Dimensão 2: Monitoramento e Controle (8 questões)
  { id: 9, text: "Existe um sistema de monitoramento contínuo dos indicadores de saúde mental.", dimension: "Monitoramento e Controle" },
  { id: 10, text: "A empresa acompanha regularmente os níveis de estresse dos colaboradores.", dimension: "Monitoramento e Controle" },
  { id: 11, text: "São realizadas pesquisas periódicas sobre clima organizacional e bem-estar.", dimension: "Monitoramento e Controle" },
  { id: 12, text: "Há controle estatístico de afastamentos por questões de saúde mental.", dimension: "Monitoramento e Controle" },
  { id: 13, text: "A organização monitora indicadores como turnover e absenteísmo.", dimension: "Monitoramento e Controle" },
  { id: 14, text: "Existem alertas automáticos para situações de risco psicossocial elevado.", dimension: "Monitoramento e Controle" },
  { id: 15, text: "Os dados de monitoramento são analisados e utilizados para tomada de decisões.", dimension: "Monitoramento e Controle" },
  { id: 16, text: "Há relatórios regulares sobre a evolução dos indicadores psicossociais.", dimension: "Monitoramento e Controle" },

  // Dimensão 3: Acolhimento e Suporte (8 questões)
  { id: 17, text: "A empresa oferece suporte psicológico aos colaboradores quando necessário.", dimension: "Acolhimento e Suporte" },
  { id: 18, text: "Existe um canal confidencial para relatar problemas de saúde mental.", dimension: "Acolhimento e Suporte" },
  { id: 19, text: "Os gestores são treinados para identificar sinais de sofrimento psíquico.", dimension: "Acolhimento e Suporte" },
  { id: 20, text: "Há protocolos claros para acolhimento de colaboradores em crise.", dimension: "Acolhimento e Suporte" },
  { id: 21, text: "A organização oferece programas de apoio emocional e bem-estar.", dimension: "Acolhimento e Suporte" },
  { id: 22, text: "Existe rede de apoio interna para questões de saúde mental.", dimension: "Acolhimento e Suporte" },
  { id: 23, text: "Os colaboradores têm acesso a recursos de autocuidado e mindfulness.", dimension: "Acolhimento e Suporte" },
  { id: 24, text: "Há acompanhamento personalizado para casos de risco psicossocial.", dimension: "Acolhimento e Suporte" },

  // Dimensão 4: Conformidade Legal e Normativa (8 questões)
  { id: 25, text: "A empresa cumpre integralmente as exigências da NR 01 sobre riscos psicossociais.", dimension: "Conformidade Legal" },
  { id: 26, text: "Há documentação adequada de todas as ações de gestão de riscos psicossociais.", dimension: "Conformidade Legal" },
  { id: 27, text: "A organização segue as diretrizes da ISO 45003 para saúde mental no trabalho.", dimension: "Conformidade Legal" },
  { id: 28, text: "Os colaboradores são informados sobre seus direitos relacionados à saúde mental.", dimension: "Conformidade Legal" },
  { id: 29, text: "Há um comitê ou grupo responsável pela gestão dos riscos psicossociais.", dimension: "Conformidade Legal" },
  { id: 30, text: "São definidas metas e indicadores para melhoria contínua em saúde mental.", dimension: "Conformidade Legal" },
  { id: 31, text: "O plano de ação é revisado regularmente com base em indicadores e feedback.", dimension: "Conformidade Legal" },
  { id: 32, text: "A empresa investe em capacitação contínua sobre riscos psicossociais.", dimension: "Conformidade Legal" },

  // Dimensão 5: Cultura Organizacional e Comunicação (8 questões)
  { id: 33, text: "A cultura da empresa valoriza a saúde mental dos colaboradores.", dimension: "Cultura e Comunicação" },
  { id: 34, text: "A comunicação interna promove o respeito e a empatia entre colegas.", dimension: "Cultura e Comunicação" },
  { id: 35, text: "Os líderes incentivam práticas que minimizam o estresse e conflitos.", dimension: "Cultura e Comunicação" },
  { id: 36, text: "Os colaboradores se sentem seguros para falar sobre suas dificuldades.", dimension: "Cultura e Comunicação" },
  { id: 37, text: "A empresa valoriza a diversidade e a inclusão em seu ambiente.", dimension: "Cultura e Comunicação" },
  { id: 38, text: "Há programas de reconhecimento que valorizam o bem-estar emocional.", dimension: "Cultura e Comunicação" },
  { id: 39, text: "As informações sobre riscos psicossociais são divulgadas com frequência.", dimension: "Cultura e Comunicação" },
  { id: 40, text: "A organização promove um ambiente de confiança e colaboração.", dimension: "Cultura e Comunicação" }
];

// Removido responseOptions - agora usando LikertScale component

const getMaturityLevel = (score: number): { level: string; color: string; description: string } => {
  if (score >= 4.5) return { 
    level: "Excelente", 
    color: "text-green-600", 
    description: "Gestão exemplar de riscos psicossociais" 
  };
  if (score >= 3.5) return { 
    level: "Boa", 
    color: "text-blue-600", 
    description: "Gestão adequada com oportunidades de melhoria" 
  };
  if (score >= 2.5) return { 
    level: "Regular", 
    color: "text-yellow-600", 
    description: "Gestão básica, necessita melhorias significativas" 
  };
  if (score >= 1.5) return { 
    level: "Insuficiente", 
    color: "text-orange-600", 
    description: "Gestão inadequada, requer ação imediata" 
  };
  return { 
    level: "Crítica", 
    color: "text-red-600", 
    description: "Ausência de gestão, risco elevado" 
  };
};

const getDimensionIcon = (dimension: string) => {
  switch (dimension) {
    case "Prevenção e Mapeamento": return Shield;
    case "Monitoramento e Controle": return TrendingUp;
    case "Acolhimento e Suporte": return Users;
    case "Conformidade Legal": return FileText;
    case "Cultura e Comunicação": return MessageSquare;
    default: return Shield;
  }
};

export default function HumaniqMGRPTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [isTransitioning, setIsTransitioning] = useState(false);

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const isLastQuestion = currentQuestion === questions.length - 1;
  const canProceed = answers[questions[currentQuestion]?.id] !== undefined;

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    // Avanço automático após 600ms
    setTimeout(() => {
      if (currentQuestion < questions.length - 1) {
        setCurrentQuestion(prev => prev + 1);
      } else {
        // Na última pergunta, finaliza o teste automaticamente
        const finalAnswers = { ...answers, [questionId]: value };
        completeTest(finalAnswers);
      }
    }, 600);
  };

  const completeTest = async (finalAnswers: Record<number, number>) => {
    try {
      // Calculate dimension scores
      const dimensionScores = {
        "Prevenção e Mapeamento": questions.filter(q => q.dimension === "Prevenção e Mapeamento").reduce((sum, q) => sum + (finalAnswers[q.id] || 0), 0) / 8,
        "Monitoramento e Controle": questions.filter(q => q.dimension === "Monitoramento e Controle").reduce((sum, q) => sum + (finalAnswers[q.id] || 0), 0) / 8,
        "Acolhimento e Suporte": questions.filter(q => q.dimension === "Acolhimento e Suporte").reduce((sum, q) => sum + (finalAnswers[q.id] || 0), 0) / 8,
        "Conformidade Legal": questions.filter(q => q.dimension === "Conformidade Legal").reduce((sum, q) => sum + (finalAnswers[q.id] || 0), 0) / 8,
        "Cultura e Comunicação": questions.filter(q => q.dimension === "Cultura e Comunicação").reduce((sum, q) => sum + (finalAnswers[q.id] || 0), 0) / 8
      };

      // Calculate global score
      const globalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0) / 5;
      const globalMaturity = getMaturityLevel(globalScore);

      // Create dimension results
      const dimensions: DimensionResult[] = Object.entries(dimensionScores).map(([name, score]) => {
        const maturity = getMaturityLevel(score);
        return {
          name,
          score,
          level: maturity.level,
          color: maturity.color,
          icon: getDimensionIcon(name),
          description: maturity.description
        };
      });

      // Generate recommendations and alerts
      const recommendations: string[] = [];
      const alerts: string[] = [];

      dimensions.forEach(dim => {
        if (dim.score < 2.5) {
          alerts.push(`${dim.name}: Nível ${dim.level.toLowerCase()} - Ação imediata necessária`);
          recommendations.push(`Implementar plano de ação urgente para ${dim.name}`);
        } else if (dim.score < 3.5) {
          recommendations.push(`Melhorar processos de ${dim.name}`);
        }
      });

      if (globalScore >= 4.0) {
        recommendations.push("Manter as boas práticas e buscar certificações em saúde mental");
      } else if (globalScore >= 3.0) {
        recommendations.push("Desenvolver programa estruturado de gestão de riscos psicossociais");
      } else {
        recommendations.push("Implementar sistema completo de gestão de riscos psicossociais");
        alerts.push("Nível geral de maturidade requer atenção imediata");
      }

      const testResults: TestResult = {
        globalScore,
        globalLevel: globalMaturity.level,
        dimensions,
        recommendations,
        alerts
      };

      setResults(testResults);
      setIsCompleted(true);

      // Submit to API
      await fetch('/api/tests/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          testType: 'HUMANIQ_MGRP',
          answers: finalAnswers,
          results: testResults,
          completedAt: new Date().toISOString()
        })
      });

      toast.success('Teste concluído com sucesso!');
    } catch (error) {
      console.error('Erro ao processar teste:', error);
      toast.error('Erro ao processar o teste. Tente novamente.');
    }
  };

  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(prev => prev - 1);
    }
  };

  const goToNext = () => {
    if (canProceed && currentQuestion < questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
    }
  };

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <Card className="mb-6">
            <CardHeader className="text-center">
              <CardTitle className="text-2xl font-bold text-gray-800 flex items-center justify-center gap-2">
                <CheckCircle className="h-8 w-8 text-green-600" />
                Resultados - HumaniQ MGRP
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Avaliação de Maturidade em Gestão de Riscos Psicossociais
              </p>
            </CardHeader>
          </Card>

          {/* Global Score */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Índice Geral de Maturidade</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center">
                <div className="text-4xl font-bold mb-2 ${getMaturityLevel(results.globalScore).color}">
                  {results.globalScore.toFixed(1)}/5.0
                </div>
                <Badge className={`text-lg px-4 py-2 ${getMaturityLevel(results.globalScore).color.replace('text-', 'bg-').replace('-600', '-100')} ${getMaturityLevel(results.globalScore).color}`}>
                  {results.globalLevel}
                </Badge>
                <p className="text-gray-600 mt-2">
                  {getMaturityLevel(results.globalScore).description}
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Alerts */}
          {results.alerts.length > 0 && (
            <Card className="mb-6 border-red-200">
              <CardHeader>
                <CardTitle className="text-xl text-red-600 flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5" />
                  Alertas Críticos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {results.alerts.map((alert, index) => (
                    <li key={index} className="flex items-start gap-2 text-red-700">
                      <AlertTriangle className="h-4 w-4 mt-0.5 flex-shrink-0" />
                      {alert}
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {/* Dimensions */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Resultados por Dimensão</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4">
                {results.dimensions.map((dimension, index) => {
                  const Icon = dimension.icon;
                  return (
                    <div key={index} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Icon className="h-6 w-6 text-gray-600" />
                        <div>
                          <h3 className="font-semibold">{dimension.name}</h3>
                          <p className="text-sm text-gray-600">{dimension.description}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="text-2xl font-bold ${dimension.color}">
                          {dimension.score.toFixed(1)}
                        </div>
                        <Badge className={`${dimension.color.replace('text-', 'bg-').replace('-600', '-100')} ${dimension.color}`}>
                          {dimension.level}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Recomendações</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {results.recommendations.map((rec, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <CheckCircle className="h-4 w-4 mt-0.5 text-green-600 flex-shrink-0" />
                    {rec}
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>

          <div className="flex gap-4">
            <Button 
              onClick={() => router.push('/colaborador/psicossociais')}
              variant="outline"
              className="flex-1"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Voltar aos Testes
            </Button>
            <Button 
              onClick={() => router.push('/colaborador/resultados')}
              className="flex-1"
            >
              Ver Todos os Resultados
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header com gradiente roxo/azul */}
      <div className="bg-gradient-to-r from-purple-600 to-blue-800 text-white px-6 py-4">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          {/* Logo circular */}
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-full flex items-center justify-center">
              <div className="w-8 h-8 bg-white rounded-full flex items-center justify-center">
                <div className="w-4 h-4 bg-purple-600 rounded-full"></div>
              </div>
            </div>
            <div>
              <h1 className="text-2xl font-bold">HumaniQ MGRP</h1>
              <p className="text-purple-100 text-sm">Maturidade em Gestão de Riscos Psicossociais</p>
            </div>
          </div>
          
          {/* Contador de questões */}
          <div className="text-right">
            <div className="text-sm text-purple-200">Questão</div>
            <div className="text-2xl font-bold">{currentQuestion + 1}/{questions.length}</div>
          </div>
        </div>
        
        {/* Barra de progresso */}
        <div className="max-w-6xl mx-auto mt-4">
          <div className="w-full bg-white/20 rounded-full h-2">
            <div 
              className="bg-white h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Categoria da pergunta */}
        <div className="mb-6">
          <h3 className="text-purple-600 font-semibold text-lg">
            {questions[currentQuestion]?.dimension}
          </h3>
        </div>

        {/* Pergunta */}
        <div className="mb-8">
          <h2 className="text-2xl font-medium text-gray-800 leading-relaxed">
            {questions[currentQuestion]?.text}
          </h2>
        </div>

        {/* Escala de concordância */}
        <div className="mb-6">
          <div className="flex justify-between text-sm text-gray-600 mb-4">
            <span>Discordo</span>
            <span>Neutro</span>
            <span>Concordo</span>
          </div>
          
          {/* Barra de gradiente */}
          <div className="w-full h-2 bg-gradient-to-r from-red-300 via-yellow-300 to-green-300 rounded-full mb-8"></div>
          
          {/* Botões da escala Likert */}
          <div className="flex justify-center gap-4 mb-6">
            {[1, 2, 3, 4, 5].map((value) => {
              const colors: { [key: number]: string } = {
                1: 'bg-red-300 hover:bg-red-400',
                2: 'bg-orange-300 hover:bg-orange-400', 
                3: 'bg-yellow-300 hover:bg-yellow-400',
                4: 'bg-green-300 hover:bg-green-400',
                5: 'bg-green-400 hover:bg-green-500'
              };
              
              const isSelected = answers[questions[currentQuestion]?.id] === value;
              
              return (
                <button
                  key={value}
                  onClick={() => handleAnswer(value)}
                  className={`w-16 h-16 rounded-lg ${colors[value]} ${isSelected ? 'ring-4 ring-purple-500 ring-offset-2' : ''} flex items-center justify-center text-xl font-bold text-gray-700 transition-all duration-200 hover:scale-105`}
                >
                  {value}
                </button>
              );
            })}
          </div>
          
          {/* Labels dos botões */}
          <div className="flex justify-center gap-4 text-xs text-gray-600">
            <div className="w-16 text-center">Discordo totalmente</div>
            <div className="w-16 text-center">Discordo</div>
            <div className="w-16 text-center">Neutro</div>
            <div className="w-16 text-center">Concordo</div>
            <div className="w-16 text-center">Concordo totalmente</div>
          </div>
        </div>

        {/* Navegação */}
        <div className="flex justify-between items-center mt-12">
          <Button 
            variant="ghost" 
            onClick={goToPrevious}
            disabled={currentQuestion === 0}
            className="text-gray-600 hover:text-gray-800 disabled:opacity-50"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Anterior
          </Button>
          
          <div className="text-center text-gray-500 text-sm">
            {canProceed ? "Avançando automaticamente..." : "Selecione uma resposta para continuar"}
          </div>
          
          <div className="w-24"></div> {/* Espaço para manter o layout balanceado */}
        </div>
      </div>
    </div>
  );
}