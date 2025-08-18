'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, RotateCcw, Home } from 'lucide-react';

interface DimensionScore {
  dimension: string;
  score: number;
  maxScore: number;
  percentage: number;
  description: string;
}

const dimensionDescriptions = {
  'Visionário': 'Capacidade de inspirar e motivar através de uma visão clara do futuro.',
  'Afiliativo': 'Habilidade de criar harmonia e construir relacionamentos positivos.',
  'Coaching': 'Competência para desenvolver pessoas e melhorar seu desempenho.',
  'Democrático': 'Capacidade de envolver a equipe nas decisões e valorizar contribuições.',
  'Diretivo': 'Habilidade de dar direções claras e tomar decisões rápidas.',
  'Pacesetting': 'Competência para estabelecer padrões altos e liderar pelo exemplo.',
  'Estratégico': 'Capacidade de pensar a longo prazo e planejar estrategicamente.',
  'Inteligência Emocional': 'Habilidade de gerenciar emoções próprias e dos outros.'
};

export default function HumaniqLideraResultado() {
  const router = useRouter();
  const [scores, setScores] = useState<DimensionScore[]>([]);
  const [loading, setLoading] = useState(true);

  // Função para calcular scores reais baseado nas respostas
  const calculateRealScores = (answersObj: { [key: number]: number }): DimensionScore[] => {
    // Mapeamento das perguntas para dimensões (6 perguntas por dimensão)
    // As perguntas têm IDs de 1-48, não índices 0-47
    const dimensionMapping = {
      'Liderança Visionária': [1, 2, 3, 4, 5, 6],
      'Liderança Afiliativa': [7, 8, 9, 10, 11, 12],
      'Liderança Coaching': [13, 14, 15, 16, 17, 18],
      'Liderança Democrática': [19, 20, 21, 22, 23, 24],
      'Liderança Diretiva': [25, 26, 27, 28, 29, 30],
      'Liderança Pacesetting': [31, 32, 33, 34, 35, 36],
      'Liderança Estratégica': [37, 38, 39, 40, 41, 42],
      'Inteligência Emocional': [43, 44, 45, 46, 47, 48]
    };

    const dimensionNames = {
      'Liderança Visionária': 'Visionário',
      'Liderança Afiliativa': 'Afiliativo',
      'Liderança Coaching': 'Coaching',
      'Liderança Democrática': 'Democrático',
      'Liderança Diretiva': 'Diretivo',
      'Liderança Pacesetting': 'Pacesetting',
      'Liderança Estratégica': 'Estratégico',
      'Inteligência Emocional': 'Inteligência Emocional'
    };

    const results: DimensionScore[] = [];

    Object.entries(dimensionMapping).forEach(([fullDimension, questionIds]) => {
       const dimensionName = dimensionNames[fullDimension as keyof typeof dimensionNames];
       let totalScore = 0;
       
       // Somar as respostas das 6 perguntas desta dimensão
       questionIds.forEach(questionId => {
         if (answersObj[questionId] !== undefined) {
           totalScore += answersObj[questionId];
         }
       });

      const maxScore = 30; // 6 perguntas × 5 pontos máximos = 30
      const percentage = Math.round((totalScore / maxScore) * 100);

      results.push({
        dimension: dimensionName,
        score: totalScore,
        maxScore: maxScore,
        percentage: percentage,
        description: dimensionDescriptions[dimensionName as keyof typeof dimensionDescriptions]
      });
    });

    return results;
  };

  useEffect(() => {
    // Recuperar respostas do localStorage
    const savedAnswers = localStorage.getItem('humaniq-lidera-answers');
    const testCompleted = localStorage.getItem('humaniq-lidera-completed');

    if (savedAnswers && testCompleted) {
       try {
         const answers: { [key: number]: number } = JSON.parse(savedAnswers);
         const calculatedScores = calculateRealScores(answers);
        
        setTimeout(() => {
          setScores(calculatedScores);
          setLoading(false);
        }, 1000);
      } catch (error) {
        console.error('Erro ao processar respostas:', error);
        // Redirecionar para o teste se houver erro
        router.push('/colaborador/psicossociais/humaniq-lidera');
      }
    } else {
      // Se não há respostas salvas, redirecionar para o teste
      router.push('/colaborador/psicossociais/humaniq-lidera');
    }
  }, [router]);

  const getScoreColor = (percentage: number) => {
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  const getBarColor = (percentage: number) => {
    if (percentage >= 80) return 'bg-green-500';
    if (percentage >= 60) return 'bg-yellow-500';
    return 'bg-red-500';
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Processando seus resultados...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-purple-900 text-white p-6">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-white rounded-full flex items-center justify-center">
                <div className="w-8 h-8 bg-purple-900 rounded-full"></div>
              </div>
              <div>
                <h1 className="text-2xl font-bold">HumaniQ LIDERA</h1>
                <p className="text-purple-200">Resultados do Teste de Liderança</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto p-6">
        {/* Summary Card */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-4">Resumo dos Resultados</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{scores.length}</div>
              <div className="text-sm text-gray-600">Dimensões Avaliadas</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">
                {Math.round(scores.reduce((acc, score) => acc + score.percentage, 0) / scores.length)}%
              </div>
              <div className="text-sm text-gray-600">Pontuação Média</div>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <div className="text-2xl font-bold text-purple-600">
                {scores.find(s => s.percentage === Math.max(...scores.map(s => s.percentage)))?.dimension}
              </div>
              <div className="text-sm text-gray-600">Dimensão Mais Forte</div>
            </div>
          </div>
        </div>

        {/* Detailed Results */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h2 className="text-xl font-semibold text-gray-800 mb-6">Resultados por Dimensão</h2>
          <div className="space-y-6">
            {scores.map((score, index) => (
              <div key={index} className="border-b border-gray-200 pb-4 last:border-b-0">
                <div className="flex justify-between items-center mb-2">
                  <h3 className="font-medium text-gray-800">{score.dimension}</h3>
                  <span className={`font-semibold ${getScoreColor(score.percentage)}`}>
                    {score.score}/{score.maxScore} ({score.percentage}%)
                  </span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-3 mb-2">
                  <div 
                    className={`h-3 rounded-full transition-all duration-500 ${getBarColor(score.percentage)}`}
                    style={{ width: `${score.percentage}%` }}
                  ></div>
                </div>
                <p className="text-sm text-gray-600">{score.description}</p>
              </div>
            ))}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <button
            onClick={() => router.push('/colaborador/psicossociais/humaniq-lidera')}
            className="flex items-center justify-center space-x-2 bg-purple-900 text-white px-6 py-3 rounded-lg hover:bg-purple-800 transition-colors"
          >
            <RotateCcw className="w-5 h-5" />
            <span>Refazer Teste</span>
          </button>
          
          <button
            onClick={() => router.push('/colaborador/psicossociais')}
            className="flex items-center justify-center space-x-2 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span>Voltar aos Testes</span>
          </button>
          
          <button
            onClick={() => router.push('/colaborador')}
            className="flex items-center justify-center space-x-2 bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Home className="w-5 h-5" />
            <span>Dashboard</span>
          </button>
        </div>

        {/* Additional Information */}
        <div className="bg-blue-50 rounded-lg p-6 mt-6">
          <h3 className="font-semibold text-blue-800 mb-2">Sobre o HumaniQ Lidera</h3>
          <p className="text-blue-700 text-sm">
            O HumaniQ Lidera avalia 8 dimensões fundamentais da liderança, fornecendo insights valiosos 
            sobre seu estilo de liderança e áreas de desenvolvimento. Use estes resultados para 
            aprimorar suas competências de liderança e maximizar seu potencial.
          </p>
        </div>
      </div>
    </div>
  );
}