'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, ArrowRight, CheckCircle, AlertTriangle, TrendingUp, Target } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { LikertScale } from '@/components/ui/likert-scale';

interface Question {
  id: number;
  text: string;
  dimension: string;
}

interface DimensionResult {
  name: string;
  score: number;
  maxScore: number;
  percentage: number;
  level: string;
  description: string;
}

interface TestResult {
  totalScore: number;
  maxScore: number;
  percentage: number;
  level: string;
  dimensions: DimensionResult[];
  recommendations: string[];
}

const questions: Question[] = [
  // Abertura à mudança (1-6)
  { id: 1, text: "Sinto-me confortável com mudanças repentinas no trabalho.", dimension: "Abertura à mudança" },
  { id: 2, text: "Gosto de experimentar novas formas de realizar minhas tarefas.", dimension: "Abertura à mudança" },
  { id: 3, text: "Vejo a mudança como uma oportunidade, não como uma ameaça.", dimension: "Abertura à mudança" },
  { id: 4, text: "Adapto-me facilmente a novas regras ou políticas.", dimension: "Abertura à mudança" },
  { id: 5, text: "Aceito bem lideranças ou colegas diferentes do habitual.", dimension: "Abertura à mudança" },
  { id: 6, text: "Encaro transições com positividade e disposição.", dimension: "Abertura à mudança" },
  
  // Resiliência emocional (7-12)
  { id: 7, text: "Mantenho o foco mesmo em situações de crise.", dimension: "Resiliência emocional" },
  { id: 8, text: "Costumo me recuperar rapidamente após frustrações.", dimension: "Resiliência emocional" },
  { id: 9, text: "Lido bem com pressões inesperadas.", dimension: "Resiliência emocional" },
  { id: 10, text: "Permaneço otimista diante de desafios.", dimension: "Resiliência emocional" },
  { id: 11, text: "Evito reagir impulsivamente a mudanças de planos.", dimension: "Resiliência emocional" },
  { id: 12, text: "Consigo manter a calma em ambientes instáveis.", dimension: "Resiliência emocional" },
  
  // Aprendizagem contínua (13-18)
  { id: 13, text: "Tenho interesse constante em aprender coisas novas.", dimension: "Aprendizagem contínua" },
  { id: 14, text: "Busco feedbacks para melhorar meu desempenho.", dimension: "Aprendizagem contínua" },
  { id: 15, text: "Atualizo meus conhecimentos mesmo sem exigência da empresa.", dimension: "Aprendizagem contínua" },
  { id: 16, text: "Encaro erros como oportunidades de crescimento.", dimension: "Aprendizagem contínua" },
  { id: 17, text: "Busco entender novas tecnologias ou processos.", dimension: "Aprendizagem contínua" },
  { id: 18, text: "Tenho curiosidade em relação a novos contextos profissionais.", dimension: "Aprendizagem contínua" },
  
  // Flexibilidade comportamental (19-24)
  { id: 19, text: "Modifico meu estilo de comunicação conforme o público.", dimension: "Flexibilidade comportamental" },
  { id: 20, text: "Ajusto minha rotina de trabalho diante de novas prioridades.", dimension: "Flexibilidade comportamental" },
  { id: 21, text: "Aceito mudanças em projetos mesmo que exijam recomeçar.", dimension: "Flexibilidade comportamental" },
  { id: 22, text: "Adapto minha forma de pensar quando recebo bons argumentos.", dimension: "Flexibilidade comportamental" },
  { id: 23, text: "Mudo de estratégia se os resultados não aparecem.", dimension: "Flexibilidade comportamental" },
  { id: 24, text: "Consigo equilibrar diferentes tarefas e demandas simultâneas.", dimension: "Flexibilidade comportamental" }
];

// Removido responseOptions - agora usando LikertScale component

export default function HumaniqFlexTest() {
  const router = useRouter();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<Record<number, number>>({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [results, setResults] = useState<TestResult | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleAnswer = (value: number) => {
    const questionId = questions[currentQuestion].id;
    setAnswers(prev => ({ ...prev, [questionId]: value }));
    
    if (currentQuestion < questions.length - 1) {
      // Auto-advance to next question
      setTimeout(() => {
        setCurrentQuestion(prev => prev + 1);
      }, 300);
    } else {
      // All questions answered, complete test automatically
      setTimeout(() => {
        calculateResults();
        completeTest();
      }, 500);
    }
  };

  const calculateResults = () => {
    const dimensionScores = {
      "Abertura à mudança": 0,
      "Resiliência emocional": 0,
      "Aprendizagem contínua": 0,
      "Flexibilidade comportamental": 0
    };

    // Calculate scores by dimension
    questions.forEach(question => {
      const answer = answers[question.id] || 0;
      dimensionScores[question.dimension as keyof typeof dimensionScores] += answer;
    });

    const totalScore = Object.values(dimensionScores).reduce((sum, score) => sum + score, 0);
    const maxScore = 120; // 24 questions × 5 points
    const percentage = (totalScore / maxScore) * 100;

    // Determine overall level
    let level = "";
    if (totalScore <= 59) level = "Baixa adaptabilidade";
    else if (totalScore <= 89) level = "Adaptabilidade moderada";
    else if (totalScore <= 109) level = "Alta adaptabilidade";
    else level = "Adaptabilidade excepcional";

    // Create dimension results
    const dimensions: DimensionResult[] = Object.entries(dimensionScores).map(([name, score]) => {
      const dimPercentage = (score / 30) * 100; // 6 questions × 5 points = 30 max per dimension
      let dimLevel = "";
      if (score <= 14) dimLevel = "Baixo";
      else if (score <= 22) dimLevel = "Moderado";
      else if (score <= 27) dimLevel = "Alto";
      else dimLevel = "Excepcional";

      return {
        name,
        score,
        maxScore: 30,
        percentage: dimPercentage,
        level: dimLevel,
        description: getDimensionDescription(name, dimLevel)
      };
    });

    const testResults: TestResult = {
      totalScore,
      maxScore,
      percentage,
      level,
      dimensions,
      recommendations: generateRecommendations(level, dimensions)
    };

    setResults(testResults);
    setIsCompleted(true);
  };

  const getDimensionDescription = (dimension: string, level: string): string => {
    const descriptions: Record<string, Record<string, string>> = {
      "Abertura à mudança": {
        "Baixo": "Pode apresentar resistência a mudanças organizacionais e preferir rotinas estabelecidas.",
        "Moderado": "Aceita mudanças quando bem explicadas e implementadas gradualmente.",
        "Alto": "Abraça mudanças como oportunidades de crescimento e melhoria.",
        "Excepcional": "Prospera em ambientes dinâmicos e é agente de transformação."
      },
      "Resiliência emocional": {
        "Baixo": "Pode ter dificuldades para lidar com pressões e situações de crise.",
        "Moderado": "Mantém estabilidade emocional na maioria das situações desafiadoras.",
        "Alto": "Demonstra forte capacidade de recuperação e controle emocional.",
        "Excepcional": "Mantém equilíbrio emocional mesmo nas situações mais adversas."
      },
      "Aprendizagem contínua": {
        "Baixo": "Pode preferir manter conhecimentos atuais sem buscar atualizações frequentes.",
        "Moderado": "Busca aprendizado quando necessário para suas funções.",
        "Alto": "Demonstra curiosidade constante e busca ativa por novos conhecimentos.",
        "Excepcional": "É um aprendiz nato, sempre buscando crescimento e desenvolvimento."
      },
      "Flexibilidade comportamental": {
        "Baixo": "Pode ter dificuldades para ajustar comportamentos a diferentes contextos.",
        "Moderado": "Adapta comportamentos quando a situação claramente exige.",
        "Alto": "Ajusta facilmente seu estilo às demandas do ambiente e pessoas.",
        "Excepcional": "Demonstra versatilidade comportamental excepcional em qualquer contexto."
      }
    };

    return descriptions[dimension]?.[level] || "Descrição não disponível.";
  };

  const generateRecommendations = (level: string, dimensions: DimensionResult[]): string[] => {
    const recommendations: string[] = [];

    // Global recommendations based on overall level
    if (level === "Baixa adaptabilidade") {
      recommendations.push("Participe de programas de desenvolvimento de competências adaptativas");
      recommendations.push("Busque mentoria para desenvolver resiliência e flexibilidade");
      recommendations.push("Pratique mindfulness para melhorar o controle emocional");
    } else if (level === "Adaptabilidade moderada") {
      recommendations.push("Busque desafios graduais para expandir sua zona de conforto");
      recommendations.push("Participe de projetos multidisciplinares");
      recommendations.push("Desenvolva habilidades de comunicação adaptativa");
    } else if (level === "Alta adaptabilidade") {
      recommendations.push("Considere assumir papéis de liderança em mudanças organizacionais");
      recommendations.push("Compartilhe suas estratégias adaptativas com colegas");
      recommendations.push("Busque desafios internacionais ou interculturais");
    } else {
      recommendations.push("Torne-se um agente de mudança e transformação na organização");
      recommendations.push("Mentore outros colaboradores em adaptabilidade");
      recommendations.push("Lidere iniciativas de inovação e transformação digital");
    }

    // Specific recommendations for low-scoring dimensions
    dimensions.forEach(dim => {
      if (dim.level === "Baixo") {
        if (dim.name === "Abertura à mudança") {
          recommendations.push("Pratique exercícios de exposição gradual a mudanças");
        } else if (dim.name === "Resiliência emocional") {
          recommendations.push("Desenvolva técnicas de gestão do estresse e autorregulação");
        } else if (dim.name === "Aprendizagem contínua") {
          recommendations.push("Estabeleça metas de aprendizado e crie hábitos de estudo");
        } else if (dim.name === "Flexibilidade comportamental") {
          recommendations.push("Pratique diferentes estilos de comunicação e comportamento");
        }
      }
    });

    return recommendations;
  };

  const completeTest = async () => {
    setIsSubmitting(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Here you would typically send results to your API
      console.log('Test results:', results);
      
      // Redirect to results page or dashboard
      router.push('/colaborador/resultados');
    } catch (error) {
      console.error('Error submitting test:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const progress = ((currentQuestion + 1) / questions.length) * 100;
  const currentQ = questions[currentQuestion];
  
  // Verificar se currentQ existe antes de renderizar
  if (!currentQ && !isCompleted) {
    console.error('currentQ é undefined:', { currentQuestion, questionsLength: questions.length });
    return <div>Erro: Questão não encontrada</div>;
  }

  if (isCompleted && results) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle className="w-8 h-8 text-green-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Teste Concluído!</h1>
            <p className="text-gray-600">HumaniQ FLEX - Avaliação de Adaptabilidade</p>
          </div>

          {/* Overall Results */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Resultado Geral
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center mb-6">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {results.totalScore}/{results.maxScore}
                </div>
                <div className="text-xl text-gray-700 mb-2">{results.level}</div>
                <div className="text-sm text-gray-500">
                  {results.percentage.toFixed(1)}% de adaptabilidade
                </div>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {results.dimensions.map((dimension, index) => (
                  <div key={index} className="bg-gray-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-sm mb-2">{dimension.name}</h4>
                    <div className="text-2xl font-bold text-blue-600 mb-1">
                      {dimension.score}/{dimension.maxScore}
                    </div>
                    <Badge 
                      variant={dimension.level === 'Baixo' ? 'destructive' : 
                              dimension.level === 'Moderado' ? 'secondary' : 'default'}
                      className="text-xs"
                    >
                      {dimension.level}
                    </Badge>
                    <p className="text-xs text-gray-600 mt-2">{dimension.description}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Recommendations */}
          <Card className="mb-6">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Recomendações de Desenvolvimento
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {results.recommendations.map((recommendation, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0" />
                    <p className="text-gray-700">{recommendation}</p>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-4 justify-center">
            <Button 
              variant="outline" 
              onClick={() => router.push('/colaborador/psicossociais')}
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Voltar aos Testes
            </Button>
            <div className="flex items-center justify-center">
              <div className="p-3 bg-green-50 rounded-lg">
                <p className="text-green-700 text-sm font-medium">
                  Resultados salvos automaticamente!
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-4">
      <div className="max-w-2xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            HumaniQ FLEX
          </h1>
          <p className="text-gray-600 mb-4">Avaliação de Adaptabilidade</p>
          <div className="flex items-center justify-between text-sm text-gray-500 mb-2">
            <span>Questão {currentQuestion + 1} de {questions.length}</span>
            <span>{Math.round(progress)}% concluído</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Question Card */}
        <Card className="mb-6">
          <CardHeader>
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="text-xs">
                {currentQ?.dimension || 'Carregando...'}
              </Badge>
              <span className="text-sm text-gray-500">
                {currentQuestion + 1}/{questions.length}
              </span>
            </div>
          </CardHeader>
          <CardContent>
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {currentQ.text}
            </h2>
            
            {currentQ && (
              <LikertScale
                value={answers[currentQ.id]}
                onChange={handleAnswer}
                hideQuestion={true}
              />
            )}
          </CardContent>
        </Card>

        {/* Instructions */}
        <div className="text-center text-sm text-gray-500">
          <p>Responda com base em como você realmente se comporta no trabalho.</p>
        </div>
      </div>
    </div>
  );
}